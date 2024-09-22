import { getFirestore, addDoc, doc, getDocs, updateDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit } from "firebase/firestore";
import {newGuid} from '../helpers/newGuid.js'
const db = getFirestore();
const categoriesRef = collection(db, 'categories');

/**
 * Graba las categorias default de nuestro sistema.
 *
 * @param {{id: string, user: string, title: string, body: string}} data
 * @returns {Promise<void>}
 */
 export async function saveCategorie(name) {
     const data = {
         id: newGuid(),
         name
        };
        
    try {
        return await addDoc(categoriesRef, data);
    } catch(err) {
        console.error('Error al grabar la categoría. ', err);
    }
}

/**
 * Obtiene las categorias de nuestra base de datos.
 *
 * @returns {Array} - Array de categorias.
 */
 export async function getCategories() {
    let categories = []
    const querySnapshot = await getDocs(categoriesRef);
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        categories.push(doc.data())
    });

    return categories
}

// /**
//  * Retorna un Post de la base de datos a partir de un ID.
//  *
//  * @param {{id: string}} id
//  * @returns {{post: {id:string, user:string, title:string, body:string, image:string, timestamp:Date}}}
//  */
//  export const getPostById = async (id) => {
 
//     const queryPost = query(postRef, where('id', '==', id), limit(1));
//     const snapshot = await getDocs(queryPost);    //  const snapshot = await getDocs(query);
     
//     const post = snapshot.docs[0].data();

//     return {
//         id: post.id,
//         title: post.title,
//         body: post.body,
//         image: post.image,
//         timestamp: post.timestamp
//     };
// }

// /**
//  * @param {string} id
//  * @param {{title: string, body: string, image: string}} data
//  */
//  export const updatePost = async (id, data) => {
//     const docRef = doc(db, 'posts', id);
//     await updateDoc(docRef, {
//         title: data.title,
//         body: data.body,
//         // image: data.image
//       });
// }
