<template>
  <div class="row justify-content-center align-items-center">
    <div
      class="col-12 d-flex justify-content-center align-items-center text-white"
      style="
        height: 250px;
        background-image: url('/assets/imgs/bg/bg-profile.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      "
      v-if="!toEdit"
    >
      <div class="col-9">
        <div id="portada" class="d-flex align-items-center py-4">
          <img
            :src="user.photoURLFile ?? '/assets/imgs/image-avatar.png'"
            alt="image-avatar"
            style="width: 200px; height: 200px; border-radius: 50%"
          />
          <h1 v-if="!toEdit" class="px-4">
            Bienvenido {{ user.displayName || user.email }}
          </h1>
          <h1 v-else class="px-4 h4">
            Bienvenido {{ user.displayName || user.email }} acá podras modificar
            tus nick de usuario
          </h1>
        </div>
      </div>
      <div class="col-2 text-center">
        <button class="btn btn-warning text-white" v-on:click="edit()">
          <b> EDITAR PERFIL </b>
        </button>
      </div>
    </div>
    <div class="col-8 d-flex justify-content-center align-items-center py-5">
      <!-- <div class="col-8"> -->
      <div v-if="!toEdit" class="col-8">
        <h2 class="mb-5 d-none">Estas son tus publicaciones:</h2>
        <div v-for="post in posts" class="mb-1">
          <PostComponent
            :post="post"
            :backurl="'profile'"
            class="shadow py-3"
          ></PostComponent>
        </div>
      </div>

      <!-- <div class="col-8"> -->
      <div v-else class="col-8">
        <button class="btn btn-secondary" v-on:click="showProfile()">
          Volver al Perfil
        </button>

        <h3 class="mt-3 text-center h4">EDITAR DATOS DEL USUARIO</h3>

        <form action="#" @submit.prevent="updateProfile">
          <div
            class="row d-flex justify-content-center p-3"
          >
            <div class="col-6">
              <label for="email" class="form-label my-2"
                >Correo Electrónico</label
              >
              <input
                type="text"
                id="email"
                class="form-control"
                :disabled="true"
                v-model="user.email"
              />
              <label for="displayName" class="form-label my-2"
                >Nick de usuario</label
              >
              <input
                type="text"
                id="displayName"
                class="form-control"
                placeholder="ingrese su nick de usuario"
                :disabled="isLoading"
                v-model="formData.displayName"
              />
              <label for="firstName" class="form-label my-2"
                >Nombre del usuario</label
              >
              <input
                type="text"
                id="firstName"
                class="form-control"
                placeholder="ingrese su nombre"
                :disabled="isLoading"
                v-model="formData.firstName"
              />
              <label for="lastName" class="form-label my-2"
                >Apellido de usuario</label
              >
              <input
                type="text"
                id="lastName"
                placeholder="ingrese su apellido"
                class="form-control"
                :disabled="isLoading"
                v-model="formData.lastName"
              />
            </div>
            <div class="col-6">
              <label for="photoURL" class="form-label my-2">Imagen</label>
              <input
                type="file"
                id="photoURL"
                class="form-control"
                :disabled="isLoading"
                @change="loadImage"
              />
              <div class="p-5" v-if="photoURL !== null">
                <p>Previsualización de la imagen</p>
                <img 
                  :src="photoURL"
                  alt=""
                  ref="previewImage"
                  class=".img-fluid"    
                  style="width: 100%;"
                />
              </div>
            </div>
            <div class="col-12 my-3">
              <ButtonSubmitLoader :loading="isLoading"
                > <strong> ACTUALIZAR </strong></ButtonSubmitLoader
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { doUpdateProfile } from "../auth/auth.js";
import { subscribeToIncomingProfilePosts, reloadPostImage } from "../posts/index.js";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import { useAuth } from "../composition/functions.js";
import { onMounted, onUnmounted } from "vue";
import Loader from "../components/Loader.vue";
import PostComponent from "../components/Post.vue";

const { user } = useAuth();
const isLoading = ref(false);
const posts = ref([]);
const toEdit = ref(false);
const photoURL = ref(null);
const previewImage = ref(null);
const reader = new FileReader();

// Show edit profile panel
const edit = () => {
  toEdit.value = true;
};

// Oculta el form, retornando al perfil
const showProfile = () => {
  toEdit.value = false;
  photoURL.value = null;
};

// funciones de carga de imagen
const loadImage = (ev) => {

  const image = ev.target.files[0];
  reader.addEventListener("load", function () {
    photoURL.value = reader.result;
  });
  reader.readAsDataURL(image);
};

// form ref
const formData = ref({
  displayName: user.displayName || null,
  firstName: user.firstName || null,
  lastName: user.lastName || null,
  // photoURL: user.photoURL || null,
  // photoURLFile: user.photoURLFile || null,
});
// watcher,detecta cuando hay nueva info en user.
watch(user, async (newUser, oldUser) => {
  if (newUser.displayName !== oldUser.displayName) {
    formData.value.displayName = newUser.displayName;
  }
  if (newUser.firstName !== oldUser.firstName) {
    formData.value.firstName = newUser.firstName;
  }
  if (newUser.lastName !== oldUser.lastName) {
    formData.value.lastName = newUser.lastName;
  }
});

// update de perfil de usuario
const updateProfile = async () => {
  isLoading.value = true;
  const response = await doUpdateProfile({
    ...formData.value,
    photo: {
      base64: photoURL.value,
      dimensions: {
        width: previewImage?.value?.width ?? user.value?.avatar?.width,
        height: previewImage.value?.height ?? user.value?.avatar?.height,
      },
    },
    // photo: {
    //   name: photoURL.value ?? user.value.avatar.photoURL,
    //   dimensions: {
    //     width: previewImage?.value?.width ?? user.value?.avatar?.width,
    //     height: previewImage.value.height ?? user.value?.avatar?.height,
    //   },
    // },
  });
  if (response.success) {
    // TODO: Mensaje de éxito
    // if(response.photoURLFile != null) posts.value = reloadPostImage(posts.value, response.photoURLFile)
    // posts.value.forEach(post => {
    //       post.photoURLFile = response.photoURLFile;
    //     });
    // emit('update-post-image', response.photoURLFile);
    setTimeout(async () => {
      isLoading.value = false;
      toEdit.value = false;
    }, 250);
  } else {
    // TODO: Mensaje de error
  }
};
// const messages = ref([]);
let unsubscribe = () => {};
// Al montar el componente cargo los posteos de mi usuario
onMounted(async () => {
  unsubscribe = await subscribeToIncomingProfilePosts(user.value.id, (data) => {
    posts.value = data.reverse();
    // photoURL.value = reader.result;
  });
});

onUnmounted(async () => {
  unsubscribe()
});

</script>

<style></style>
