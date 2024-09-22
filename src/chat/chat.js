import { getFirestore, addDoc, FieldPath, collection, doc, getDocs, onSnapshot,  serverTimestamp,orderBy, query, where, limit } from "firebase/firestore";

const db = getFirestore();
const chatRef = collection(db, 'chat-global');

/*
 |--------------------------------------------------------------------------
 | Chat GLOBAL
 |--------------------------------------------------------------------------
 */
/**
 * Graba un nuevo mensaje en base de datos.
 *
 * @param {{user: string, message: string}} data
 * @returns {Promise<void>}
 */
export async function saveMessage({user, message}) {
    
    const data = { user, message, timestamp: serverTimestamp(),};

    try {
        return await addDoc(chatRef, data);
    } catch(err) {
        console.error('Error al grabar el mensaje. ', err);
    }
}

/**
 * Escucha los mensajes que llegan.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
export function subscribeToIncomingMessages(callback) {

    const q = query(chatRef, orderBy('timestamp'));

    return onSnapshot(q, snapshot => {
        const messages = snapshot.docs.map(doc => doc.data());

        callback(messages);
    });
}

/*
 |--------------------------------------------------------------------------
 | Chat privado
 |--------------------------------------------------------------------------
 */
/*
¿Cómo vamos a guardar los mensajes privados?
La idea es usar esta estructura:

collection chats-private {
    id#ejhwejhfuisdejhf document {
        users: {
            email1: true,
            email2: true,
        }
        created_at: Timestamp

        collection messages {
            id#ajskhdfajkshfkjwe document {
                created_at: Timestamp,
                user: email,
                message: ....
            }
        }
    }
}
*/
const privateChatRef = collection(db, 'chats-private');
const privateRefCache = [
    // Estructura:
    // {
    //      users: {email1: true, email2: true},
    //      ref: collection(...)
    // }
];

/**
 * Crea un nuevo chat privado.
 *
 * @param {string} from
 * @param {string} to
 * @returns {Promise<CollectionReference<DocumentData>>}
 */
async function createPrivateChatRef(from, to) {
    const users = {
        [from]: true,
        [to]: true,
    };
    const docRef = await addDoc(privateChatRef, { users, created_at: serverTimestamp(),});
    const id = docRef.id;

    const chatRef = collection(db, `/chats-private/${id}/messages`);

    addRefToCache(users, chatRef);

    return chatRef;
}

/**
 * Retorna la referencia del chat entre los usuarios indicados.
 * Si no existe, retorna null.
 *
 * @param {string} from
 * @param {string} to
 * @returns {Promise<CollectionReference<DocumentData>>}
 */
async function getPrivateChatRef(from, to) {
    const users = {
        [from]: true,
        [to]: true,
    };

    const cachedRef = getCachedRef(from, to);
    if(cachedRef) return cachedRef;

    const queryChat = query(privateChatRef, where('users', '==', users), limit(1));
    const snap = await getDocs(queryChat);

    if(snap.empty) {
        return await createPrivateChatRef(from, to);
    }

    const id = snap.docs[0].id;
    const chatRef = collection(db, `/chats-private/${id}/messages`);

    addRefToCache(users, chatRef);

    return chatRef;
}

/**
 *
 * @param {{}} users
 * @param {{}} ref
 */
function addRefToCache(users, ref) {
    privateRefCache.push({
        users,
        ref,
    });
}

/**
 * Retorna la referencia cacheada para el chat privado entre los dos usuarios.
 *
 * @param {string} from
 * @param {string} to
 * @returns {*}
 */
function getCachedRef(from, to) {
    for(let refData of privateRefCache) {
        if(refData.users[from] && refData.users[to]) {
            return refData.ref;
        }
    }
    return null;
}

/**
 * Graba un mensaje de chat privado.
 * Si el chat no existe, primero se crea.
 *
 * @param {string} from         - El que envía el mensaje
 * @param {string} to           - Quien recibe el mensaje
 * @param {string} message
 * @returns {Promise<void>}
 */
export const savePrivateMessage = async (from, to, message) => {

    const currentChatRef = await getPrivateChatRef(from, to);
    await addDoc(currentChatRef, {
        message,
        user: from,
        created_at: serverTimestamp(),
    });
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {function} callback
 * @returns {Promise<Unsubscribe>}
 */
export const subscribeToIncomingPrivateMessages = async (from, to, callback) => {
    const ref = await getPrivateChatRef(from, to);

    const queryMessages = query(ref, orderBy('created_at'));

    return onSnapshot(queryMessages, snapshot => {
        const docs = snapshot.docs.map(item => item.data());

        callback(docs);
    });
}


/**
 *
 * @param {string} from
 * @param {string} to
 * @param {function} callback
 * @returns {Promise<Unsubscribe>}
 */
export const hasPrivateMessages = async (from, to) => {
    const ref = await getPrivateChatRef(from, to);

    const queryMessages = query(ref, orderBy('created_at'));

    return onSnapshot(queryMessages, snapshot => {
        const docs = snapshot.docs.map(item => item.data());
        console.log("hasPrivateMessages: docs")
        console.log(docs)
        return docs;
    });
}

/**
 * Retorna un listado de chats a partir del EMAIL de usuario proporcionado
 *
 * @param {String} email - Email en formato string del usuario.
 * @returns {Array} - Retorna un listado de chats.
 */
 export async function getChatsByEmail(email) {
    const chats = []
    let fieldPath = new FieldPath('users', email);
    try{
        const q = query(privateChatRef, where(fieldPath, '==', true), orderBy("created_at", "desc"))
        
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            let chat =  doc.data()
            // ACA DEBERIA VERIFICAR QUE TENGA MENSAJES PARA HACER EL PUSH, evitando cargar chats vacios.
            chats.push( {
                idDoc : doc.id,
                user: chat.users,
                created_at: chat.created_at,
            })
        });
    }catch(err){
        console.log('err', err)
    }
    return chats
    
}
