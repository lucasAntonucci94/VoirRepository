// Armamos un objeto "chat" que represente el "módulo" del chat, que incluya los elementos de HTML,
// los métodos de funcionamiento, etc.
import {getFirestore, addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit, doc, getDocs } from "firebase/firestore";

const db = getFirestore();
const commentsRef = collection(db, 'comments');

/*
 |--------------------------------------------------------------------------
 | Save Comment
 |--------------------------------------------------------------------------
 */
/**
 * Graba un comentario en la base de datos.
 *
 * @param {{user: { id: String, displayName: String }, idPost: string, message: string}} data
 * @returns {Promise<void>}
 */
export async function saveComment({user, idPost, message}) {
    const data = {
        user,
        idPost,
        message,
        timestamp: serverTimestamp(),
    };
   
    try {
        return await addDoc(commentsRef, data);
    } catch(err) {
        console.error('Error al grabar el mensaje. ', err);
    }
}

/**
 * Escucha los comentarios que llegan para un post especifico.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export async function subscribeToIncomingComments(idPost, callback) {
    
    const q = query(commentsRef, where('idPost', '==', idPost), orderBy("timestamp"))

    return onSnapshot(q, snapshot => {
        const comments = snapshot.docs.map(doc => {
            let comment =  doc.data()
            return {
                    idDoc : doc.id,
                    idPost : comment.idPost,
                    message: comment.message,
                    user: comment.user,
                    timestamp: comment.timestamp
                }
            });
        callback(comments);
    });
}
