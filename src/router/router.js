import {createRouter, createWebHashHistory} from "vue-router"
import Home from "../pages/Home.vue"
import ChatList from "../pages/ChatList.vue"
import Sociales from "../pages/Sociales.vue"
import Profile from "../pages/Profile.vue"
import Explore from "../pages/Explorar.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import UserProfile from "../pages/UserProfile.vue"
import UserChat from "../pages/UserChat.vue"
import EditPost from "../pages/EditPost.vue"
import Dashboard from "../pages/admin/Dashboard.vue"
import PreguntasFrecuentes from "../pages/PreguntasFrecuentes.vue"
import AbmLocations from "../pages/admin/AbmLocations.vue"
import PendingLocations from "../pages/admin/pendinglocations.vue"
import AbmUsers from "../pages/admin/AbmUsers.vue"

import {listenForAuthChanges} from "../auth/auth.js"

// Rutas de nuestra app
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/sociales',
        component: Sociales,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/faqs',
        component: PreguntasFrecuentes,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/explore',
        component: Explore,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/chatList',
        component: ChatList,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/chatList',
        component: ChatList,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/profile',
        component: Profile,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/user/:email',
        component: UserProfile,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/user/:email/:backurl/chat',
        component: UserChat,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/post/:id/:idDoc/:backurl/edit',
        component: EditPost,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
        }
    }, 
    {
        path: '/admin/abmlocations',
        component: AbmLocations,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/admin/pendinglocations',
        component: PendingLocations,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/admin/abmusers',
        component: AbmUsers,
        meta: {
            requiresAuth: true,
        }
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Observamos el estado de autenticación.
let isAuthenticated = false;
let isAdmin = false;

listenForAuthChanges(user => isAuthenticated = user.email !== null);

// Verificamos si una ruta requiere de autenticación para poder acceder.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && !isAuthenticated) {
        return {
            path: '/login',
        }
    }
});

export default router;
