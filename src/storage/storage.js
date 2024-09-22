import { getStorage, ref, uploadString, getDownloadURL, getMetadata } from 'firebase/storage';

const storage = getStorage();

/**
 * Hace un uploadfile en el storage de Firestore
 *
 * @param {string} filepath
 * @param {*} file
 *  * @param {{}} metadata
 * @returns {Promise<void>}
 */
 export async function uploadFile(filepath, file, metadata = {}) {
    const imageRef = ref(storage, filepath);
    return await uploadString(imageRef, file,'data_url', metadata);
}

/**
 *
 * @param {string} filepath
 * @returns {Promise<string>}
 */
 export async function getFileUrl(filepath) {
    const imageRef = ref(storage, filepath);

    return getDownloadURL(imageRef);
}
/**
 *
 * @param {string} filepath
 * @returns {Promise<string>}
 */
export async function getFileMetadata(filepath) {
    const imageRef = ref(storage, filepath);

    return getMetadata(imageRef);
}
