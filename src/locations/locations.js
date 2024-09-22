import { getFirestore, addDoc, doc, getDocs, updateDoc, deleteDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit } from "firebase/firestore";
import {newGuid} from '../helpers/newGuid.js'
import {getFileMetadata, getFileUrl, uploadFile} from "../storage/index.js";

const db = getFirestore();
const locationRef = collection(db, 'locations');

/**
 * Graba un Lugar de Interes en la base de datos.
 *
 * @param {{title: string, detail: string, address: string, socialNetworkLink: string}} data
 * @returns {Promise<void>}
 */
export async function createLocation({title, detail, address, phone, socialNetworkLink, photo, pending}) {
    const data = {
        id: newGuid(),
        title,
        detail,
        address,
        phone,
        socialNetworkLink,
        timestamp: serverTimestamp(),
        imagePathFile: null,
        imageUrlFile: null,
        pending: pending
    };
    debugger

    if(photo != undefined && photo != null && photo.imageBase64 != null && photo.imageBase64 != "") {
        const filePath = 'location/' + data.id + '.jpg';
        var response = await uploadFile(filePath, photo.imageBase64, {
            customMetadata: {
                ...photo.dimensions
            }
        });
        data.imagePathFile = filePath
        // obtengo URL de la imagen cargada
        await getFileUrl(filePath).then(url=>{
            data.imageUrlFile = url
        })
    }else{
        data.imagePathFile = null
        data.imageUrlFile = null
    }
    
    try {
        return await addDoc(locationRef, data);
    } catch(err) {
        console.error('Error al grabar el lugar de interes. ', err);
    }
}

/**
 * Escucha los mensajes que llegan.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export function subscribeToIncomingLocations(callback) {
    const q = query(locationRef, orderBy('timestamp', "desc"));

    return onSnapshot(q, snapshot => {

        const locations = snapshot.docs.map(doc => {
            let location =  doc.data()

            return {
                    idDoc : doc.id,
                    id: newGuid(),
                    title:location.title,
                    detail:location.detail,
                    address:location.address,
                    phone:location.phone,
                    socialNetworkLink:location.socialNetworkLink,
                    timestamp: serverTimestamp(),
                    imagePathFile: location.imagePathFile ?? null,
                    imageUrlFile: location.imageUrlFile ?? null,
                    pending: location.pending ?? true,
                }
            });

        callback(locations);
    });
}


/**
 * Retorna un Location de la base de datos a partir de un ID.
 *
 * @param {{id: string}} id
 * @returns {{post: {id:string, user:string, title:string, body:string, image:string, timestamp:Date}}}
 */
 export const getLocationById = async (id) => {
 
    const queryPost = query(locationRef, where('id', '==', id), limit(1));
    const snapshot = await getDocs(queryPost);
     
    const post = snapshot.docs[0].data();

    return {
        id: post.id,
        title: post.title,
        body: post.body,
        image: post.image,
        timestamp: post.timestamp
    };
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
 export const updateLocation = async (id, data) => {
   const docRef = doc(db, 'locations', id);
   if(photo.imageBase64 != null && photo.imageBase64 != "") {
        const filePath = data?.photo?.pathFile ?? null;
        
        if(filePath != null && filePath != '')
        var response = await uploadFile(filePath, photo.imageBase64, {
            customMetadata: {
                ...photo.dimensions
            }
        });
        data.imagePathFile = filePath
        // obtengo URL de la imagen cargada
        await getFileUrl(filePath).then(url=>{
            data.imageUrlFile = url
        })
    }


   await updateDoc(docRef, {
       title: data.title,
       detail: data.detail,
       address: data.address,
       phone: data.phone,
       socialNetworkLink: data.socialNetworkLink,
       imagePathFile: data.imagePathFile,
       imageUrlFile: data.imageUrlFile ?? null,
     });
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
 export const deleteLocation = async (id) => {
   const docRef = doc(db, 'locations', id);
   await deleteDoc(docRef);
}


/**
 * 
 * Actualiza el estado pendiente a true
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
export const changeStateLocation = async (location) => {
    const docRef = doc(db, 'locations', location.idDoc);
    
    await updateDoc(docRef, {
        // id: location.id,
        // idDoc: location.idDoc,
        // title: location.title,
        // detail: location.detail,
        // address: location.address,
        // phone: location.phone,
        // socialNetworkLink: location.socialNetworkLink,
        // imagePathFile: location.imagePathFile,
        // imageUrlFile: location.imageUrlFile ?? null,
        pending: false,
        // timestamp: Date.now(),
    });
 }
