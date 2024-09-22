<template>
    <nav class="navbar navbar-expand-sm navbar-light">
        <div class="container-fluid ">
            <a class="navbar-brand" href="#"><img src="/assets/imgs/icons/logoVoir.png" alt="icon" class="navbarImage"></a>
            <div id="navbar">
                <ul class="nav navbar-nav">
                    <li class="nav-item px-2">
                        <router-link class="nav-link text-white " to="/">
                            <i class="fa-solid fa-house"></i>
                            <b class="px-2">Inicio</b> 
                        </router-link>
                    </li>
                    <template v-if="isAuthenticated">
                        <li class="nav-item px-2">
                                <router-link class="nav-link text-white" to="/sociales">
                                    <i class="fa-solid fa-users "></i>
                                    <b class="px-2">Sociales</b> 
                                </router-link>
                            </li>
                        <li class="nav-item px-2">
                            <router-link class="nav-link text-white" to="/explore">
                                <i class="fa-solid fa-search "></i>
                                <b class="px-2">Explorar</b> 
                            </router-link>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto">
                    <template v-if="isAuthenticated">
                        <li class="nav-item px-2">
                            <router-link class="nav-link text-white" to="/chatList">
                                <i class="fa-solid fa-comments"></i>
                                <b class="px-2">Mensajes</b> 
                            </router-link>
                        </li>
                        <li class="nav-item  px-2">
                            <router-link class="nav-link text-white" to="/profile">
                                <i class="fa-solid fa-user"></i>
                                <b class="px-2">Perfil</b> 
                            </router-link>
                        </li>    
                        <template v-if="isAdmin">     
                            <li class="nav-item  px-2">
                                <router-link class="nav-link text-white" to="/dashboard">
                                    <i class="fa-solid fa-unlock"></i>
                                    <b class="px-2">Panel de Administrador</b> 
                                </router-link>
                            </li>                           
                        </template>
                        <li class="nav-item px-2">
                            <router-link class="nav-link text-white" to="/faqs">
                                <i class="fa-solid fa-circle-question"></i>
                                <b class="px-2">FAQs</b> 
                            </router-link>
                        </li>
                        <li class="nav-item px-2">
                            <button
                                type="button"
                                class="btn btn-link nav-link"
                                @click="doLogout"
                            >
                                <span class="small text-white">
                                        
                                    <b class="px-1">{{ user.displayName || user.email }}</b> 

                                        </span>
                                <b class=" text-white">
                                        <i class="fa-solid fa-right-from-bracket px-2"></i>
                                </b>
                            </button>
                        </li>
                    </template>
                    <template v-else>
                        <li class="nav-item">
                            <router-link class="nav-link text-white" to="/login">
                                <b>
                                    Iniciar Sesión
                                </b>
                            </router-link>
                        </li>
                        <li class="nav-item text-white">
                            <router-link class="nav-link text-white" to="/register">
                                <b>
                                    Registrarse
                                </b>
                            </router-link>
                        </li>
                    </template>
                </ul>		  
            </div>
        </div>
    </nav>
    <main class="container-fluid">
        <router-view />
    </main>
    <footer class="footer">
        <p>Proyecto Final &copy; 2024 - Antonucci Lucas</p>
    </footer>
</template>

<script setup>
import {logout} from "./auth/auth.js";
import {computed} from "vue";
import {useRouter} from "vue-router";
import {useAuth} from "./composition/functions.js";

const router = useRouter();
const {user} = useAuth();

const isAuthenticated = computed(() => user.value.email !== null);
const isAdmin = computed(() => user.value.isAdmin == true);

const doLogout = () => {
    logout();
    router.push({
        path: '/login',
    });
}
</script>

<style>
html, body, #app {
    height: 100%;
}

#app {
    display: grid;
    grid-template-rows: 56px 1fr 75px;
}

.navbar{
    height:75px;
    background-color: #02bcae;
} 


.navbarImage{
     width: 55px;
     height: 55px;
}
.footer {
    display: flex;
    height: 75px;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    height:75px; 
    background-color: #02bcae
}

.footer p {
    margin-bottom: 0;
    
}
</style>
