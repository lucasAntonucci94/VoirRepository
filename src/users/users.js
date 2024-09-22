import {getFirestore, doc, setDoc, addDoc, updateDoc, collection, onSnapshot, orderBy, query, where, limit, getDocs, serverTimestamp} from "firebase/firestore";
import { updateUserFromPost } from '../posts/index.js'
import {getFileMetadata, getFileUrl, uploadFile} from "../storage/index.js";
const db = getFirestore();
const usersRef = collection(db, 'users');

/**
 * Retorna un listado de publicaciones a partir de los filtros establecidos
 *
 * @returns {function} - Función para cancelar la suscripción.
 */
 export async function getAllUsers() {
    const users = []

    const q = query(usersRef)

    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
        let user =  doc.data()
        users.push( {
            idDoc : doc.id,
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar || null,
            photoURLFile: user.photoURLFile,
        })
    });
    return users
}

/**
 *
 * @param {string} email
 * @returns {Promise<{email: string, id: string, displayName: string, avatar: Object}|null>}
 */
export const getUserProfileByEmail = async (email) => {
    const queryUser = query(usersRef, where('email', '==', email), limit(1));
    const snapshot = await getDocs(queryUser);

    if(snapshot.empty) return null;
    const user = snapshot.docs[0].data();
    return {
        id: snapshot.docs[0].id,
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        avatar: user.avatar || null,
        isAdmin: user.isAdmin || null,
        photoURLFile: user.photoURLFile
    };
}

/**
 * @param {string} id
 * @param {{email: string, displayName: string|null}} data
 */
export const createUser = async (id, data) => {
    const docRef = doc(db, 'users', id);
    await setDoc(docRef, data);
}

/**
 * @param {string} id
 * @param {{email: string, displayName: string|null, firstName: string|null, lastName: string|null, avatar: Any}} data
 */
export const updateUser = async (id, data) => {

    const docRef = doc(db, 'users', id);
    
    await updateDoc(docRef, {
        displayName: data.displayName,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        avatar: data.avatar,
        photoURLFile: data.photoURLFile,
    });
    const updateUserFromPosts = await updateUserFromPost({id, data})
}
