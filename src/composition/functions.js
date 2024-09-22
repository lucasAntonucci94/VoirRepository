// Las funciones son el punto central en la API de Composición.
// Permiten a los componentes acceder a acciones y valores comunes que podemos repartir y reutilizar.
// Como convención (tomada de React Hooks) estas funciones suelen empezar con el prefijo "use".
import {ref, onMounted, onUnmounted} from "vue";
import {listenForAuthChanges} from "../auth/auth.js";

/**
 * Da la data del usuario autenticado.
 *
 * @return {{user: {id: string|null, email: string|null, displayName: string|null, photoURL: string|null, photoURLFile: string|null, photoMetadata: {width: string, height: string}|null}, stale: boolean}}}
 */
export const useAuth = () => {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        photoURL: null,
        photoURLFile: null,
        photoMetadata: null,
        isAdmin: null,
    });

    let unsubscribe;
    onMounted(() => {
        unsubscribe = listenForAuthChanges(userData => user.value = userData);
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        user,
    }
};
