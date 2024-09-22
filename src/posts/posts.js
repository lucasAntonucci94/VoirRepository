import { getFirestore, addDoc, deleteDoc, doc, getDocs, updateDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit } from "firebase/firestore";
import {newGuid} from '../helpers/newGuid.js'
import {getFileMetadata, getFileUrl, uploadFile} from "../storage/index.js";

const db = getFirestore();
const postRef = collection(db, 'posts');

/**
 * Graba un Post en la base de datos.
 *
 * @param {{id: string, user: Object, title: string, body: string}} data
 * @returns {Promise<void>}
 */
export async function savePost({user, title, body, categories, imageBase64}) {
    try {
        user.isAdmin = false;
        const data = {
            id: newGuid(),
            user,
            title,
            body,
            categories,
            timestamp: serverTimestamp(),
            imagePathFile: null,
            imageUrlFile: null,
        };

        if(imageBase64 != null) {
            const filePath = 'post/' + user.email + '/' + data.id + '.jpg';
            var response = await uploadFile(filePath, imageBase64, {
                // customMetadata: {
                //     ...{
                //         width: user.value?.avatar?.width,
                //         height: user.value?.avatar?.height,
                //       }
                // }
            });
            
            data.imagePathFile = filePath;
            
            // obtengo uri de la imagen cargada
            await getFileUrl(filePath).then(url=>{
                data.imageUrlFile = url
            })
        }
        return await addDoc(postRef, data);
    } catch(err) {
        console.error('Error al grabar el Post. ', err);
    }
}

/**
 * Escucha los mensajes que llegan.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export function subscribeToIncomingPosts(callback) {
    const q = query(postRef, orderBy('timestamp', "desc"));

    return onSnapshot(q, snapshot => {
        const posts = snapshot.docs.map(doc => {
            let post =  doc.data()
            return {
                    idDoc : doc.id,
                    id : post.id,
                    title: post.title,
                    body: post.body,
                    user: post.user,
                    categories: post.categories,
                    timestamp: post.timestamp,
                    imagePathFile: post.imagePathFile,
                    imageUrlFile: post.imageUrlFile
                }
            });
        callback(posts);
    });
}

/**
 * Retorna un listado de publicaciones a partir de los filtros establecidos
 *
 * @param {Array} filters - Este parametro de tipo array contiene todos los filtros seleccionados.
 * @returns {function} - Función para cancelar la suscripción.
 */
export async function find(filters) {
    const posts = []
    
    const q = query(postRef, where('categories', 'array-contains-any', filters ?? []), orderBy("timestamp"))

    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
        let post =  doc.data()
        posts.push( {
            idDoc : doc.id,
            id : post.id,
            title: post.title,
            body: post.body,
            image: post.image,
            user: post.user,
            categories: post.categories,
            timestamp: post.timestamp,
            imagePathFile: post.imagePathFile,
            imageUrlFile: post.imageUrlFile
        })
    });

    return posts
}

/**
 * Retorna un Post de la base de datos a partir de un ID.
 *
 * @param {{id: string}} id
 * @returns {{post: {id:string, user:string, title:string, body:string, image:string, timestamp:Date}}}
 */
 export const getPostById = async (id) => {
 
    const queryPost = query(postRef, where('id', '==', id), limit(1));
    const snapshot = await getDocs(queryPost);
     
    const post = snapshot.docs[0].data();

    const filePath = 'post/' + post.user.email + '/' + post.id + '.jpg';

    return {
        id: post.id,
        title: post.title,
        body: post.body,
        user: post.user,
        timestamp: post.timestamp,
        imagePathFile: post.imagePathFile ?? filePath,
        imageUrlFile: post.imageUrlFile ?? null
    };
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{idDoc: string, data: Object}} data
 */
 export const updatePost = async (idDoc, data) => {
    if(data.imageBase64 != null && data.imageBase64 != "") {
        const filePath = data.imagePathFile;
        var response = await uploadFile(filePath, data.imageBase64, {
            // customMetadata: {
            //     ...{
            //         width: user.value?.avatar?.width,
            //         height: user.value?.avatar?.height,
            //       }
            // }
        });
        
        // obtengo URL de la imagen cargada
        await getFileUrl(filePath).then(url=>{
            data.imageUrlFile = url
        })
    }

    const docRef = doc(db, 'posts', idDoc);
    await updateDoc(docRef, {
       title: data.title,
       body: data.body,
       imagePathFile: data.imagePathFile,
       imageUrlFile: data.imageUrlFile ?? null
     });
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
 export const deletePost = async (id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
 }
 

/**
 * 
 * Actualiza el usuario de un POST a partir del ID del Usuario.
 * 
 * @param {string} id
 * @param {id: string, email: string, displayName: string|null} data
 */
 export const updateUserFromPost = async ({id, data}) => {
    // 1- GET POSTS WITH USER ID
    const q = query(postRef, where("user.id", "==", id));
    const postQuerySnapshot = await getDocs(q);
    let postIds = []
    postQuerySnapshot.forEach((doc) => {
        postIds.push(doc.id);
    });

    // 2- Update User From POSTS
    postIds.forEach(idPost => {
        updateDoc(doc(db, 'posts', idPost), {
            user: {
                id,
                ...data
            },
        });
    })
}

/**
 * Escucha los comentarios que llegan para un post especifico.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export async function subscribeToIncomingProfilePosts(idUser, callback) {
    
    const q = query(postRef, where('user.id', '==', idUser), orderBy("timestamp"))

    return onSnapshot(q, snapshot => {
        const posts = snapshot.docs.map(doc => {
            let post =  doc.data()
            return {
                idDoc: doc.id,
                id: post.id,
                user: post.user,
                title: post.title,
                body: post.body,
                image: post.image,
                timestamp: post.timestamp,
                imagePathFile: post.imagePathFile,
                imageUrlFile: post .imageUrlFile ?? null
            };
        });
        callback(posts);
    });
}


/**
 * Actualiza la imagen de usuario de cada post.
 *
 * @param {{photoURLFile: string}} options
 * @returns {Promise<Array>}
 */
export function reloadPostImage(posts, photoURLFile) {
    try {
        posts.forEach(post => {
          post.photoURLFile = photoURLFile;
        });
        return posts;
    } catch(err) {
        return [];
    }
}