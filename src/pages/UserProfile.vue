
<template>
 <div class="container-fluid" style="padding-left: 0px;padding-right: 0px;">
  <div class="row d-flex justify-content-center align-items-center">
      <div
        class="col-12 d-flex justify-content-center align-items-center text-white"
        style="height: 350px; background-image: url('/assets/imgs/bg/bg-profile.jpg');background-repeat: no-repeat; background-size: cover; background-position: center;" 
      >
        <div class="col-9">
          <div id="portada" class="d-flex align-items-center py-4">
            <img
              :src="user.photoURLFile ?? '/assets/imgs/image-avatar.png'"
              alt="image-avatar"
              style="width: 200px; height: 200px; border-radius: 50%"
            />
            <h1 class="px-4">
              Perfil de {{ user.displayName || user.email }}
            </h1>
          </div>
        </div>
        <div class="col-2 text-center">
           <router-link class="text-white rounded bg-warning p-2" :to="`/user/${user.email}/user/chat`"><i class="fa-solid fa-comment-dots"></i> Enviar mensaje</router-link>
        </div>
    </div>
    <div v-if="!toEdit" class="col-8 py-5">
      <h2 class="mb-5 d-none">Estas son sus publicaciones:</h2>
      <template  v-if="hasPosts">

       <div v-for="post in posts" class="mb-1">
              <PostComponent
                :post="post"
                class="shadow py-3"
                :backurl="`userprofile`"
              ></PostComponent>
            </div>
      </template>
      <template v-else>
        <p class="p-5 text-center">
          <strong>
            EL USUARIO NO TIENE NINGUN POSTEO PARA MOSTRAR
          </strong>
        </p>
      </template>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { doUpdateProfile } from "../auth/auth.js";
import { subscribeToIncomingProfilePosts } from "../posts/index.js";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import { useAuth } from "../composition/functions.js";
import {onMounted, onUnmounted} from "vue";
import Loader from "../components/Loader.vue";
import PostComponent from "../components/Post.vue";
import {useRoute} from "vue-router";
import {getUserProfileByEmail} from "../users/index.js";
import {computed} from "vue";


const hasPosts = computed(() => posts.value.length > 0);


const posts = ref([]);
const isLoading = ref(false);
const toEdit = ref(false);

const route = useRoute();

const user = ref({
    id: null,
    email: null,
    displayName: null,
});

const messages = ref([]); 
let unsubscribe = () => {};

onMounted(async () => {
    await getUserProfileByEmail(route.params.email)
        .then(data => user.value = data)
        .catch(err => console.error('[UserProfile] getUserProfileByEmail: Error al obtener la data: ', err));
        
    unsubscribe = await subscribeToIncomingProfilePosts(user.value.id, data => { posts.value = data.reverse() });
});

</script>

<style></style>
