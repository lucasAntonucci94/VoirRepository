<template>
  <div
    class="container-fluid border border-light rounded bg-light"
    style="padding-right: 0px; padding-left: 0px; background-color: aqua"
  >
    <div class="row">
      <div class="col-12">
        <div class="row px-5">
          <div class="col-11">
            <div class="row">
              <div class="col-1" style="padding-right: 75px; ">
                <img
                :src="post.user.photoURLFile ?? 'imgs/image-avatar.png'"
                alt="image-avatar"
                style="width: 65px; height: 65px;border-radius: 35px;"
              />
              </div>
              <div class="col-10">
                  <router-link class="text-dark h4" style="text-decoration:none" :to="`/user/${post.user.email}`">
                    {{ post.user.displayName ?? post.user.email }}
                  </router-link>
                <p class="text-dark h4">
                </p>
                <p class="small pb-2"><DateFormatted :date="post.timestamp" /></p>
              </div>
            </div>
          </div>
          <template v-if="(post.user.id === user.id) || user.isAdmin">

            <div class="col-1">
              <div class="dropdown">
                <button
                  class="btn btn-primary dropdown-toggle"
                  type="button"
                  :id="'dropdown' + post.id"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
                <ul
                  class="dropdown-menu"
                  :aria-labelledby="'dropdown' + post.id"
                >
                  <li class="p-1">
                    <router-link
                      class="btn btn-outline-primary"
                      :to="`/post/${post.id}/${post.idDoc}/${backurl}/edit`"
                    >
                      <i class="fa-solid fa-pen"></i> Editar
                    </router-link>
                  </li>
                  <li class="p-1">
                    <!-- <router-link
                      class="btn btn-outline-danger"
                      :to="`/post/${post.id}/${post.idDoc}/${backurl}/edit`"
                    >
                      <i class="fa-solid fa-bucket"></i> Eliminar
                    </router-link> -->

                      <button
                      class="btn btn-outline-danger"
                      v-on:click="toDelete(post.idDoc)"
                    >
                        <i class="fa-solid fa-bucket"></i>Eliminar
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <div class="col-12">
            <template v-for="category in post.categories">
              <h3 class="badge bg-info mx-1">{{ category.name }}</h3>
            </template>
          </div>
        </div>
      </div>
      <div v-if="post.imageUrlFile != null" class="col-12 text-center">
        <img
           :src="post.imageUrlFile"
          alt="image-default"
          class=".img-fluid"
          style="max-width: 100%; height: auto"
        />
      </div>
      <div class="col-12 mt-3">
        <div class="row px-5">
          <div class="col-12 pt-2">
            <h3 class="h4">{{ post.title }}</h3>
          </div>
          <div class="col-12">
            <p>{{ post.body }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row px-5">
      <div class="col-12">
        <CreateComment :post="post" class="py-3"></CreateComment>
      </div>
      <div class="col-12">
        <ListComments :post="post" class="py-3"></ListComments>
      </div>
    </div>
  </div>
</template>
<script setup>
import Alert from "../components/Alert.vue";
import { ref, defineProps, reactive, onMounted, onUnmounted  } from "vue";
import DateFormatted from "../components/DateFormatted.vue";
import CreateComment from "../components/CreateComment.vue";
import ListComments from "../components/ListComments.vue";
import { getFileUrl } from "../storage/index.js";
import { deletePost } from "../posts/index.js";
import { useAuth } from "../composition/functions.js";
const { user } = useAuth();

const props = defineProps({
  backurl: String,
  post: {
    id: String,
    title: String,
    body: String,
    user: String,
    timestamp: Date,
    imagePathFile: String,
    imageUrlFile: String,
  },
});

// const messages = ref([]);
// let unsubscribe = () => {};
//elimina un posteo
const toDelete = async (id) => {
  const success = await deletePost(id);
  // isLoading.value = false;
};
// const updatePostUserImage = (newPhotoURLFile) => {
//   post.user.photoURLFile = newPhotoURLFile;
// };

onMounted(async () => {
  // COMO SOLUCION A LA FALLA EN REFRESCAR LAS REFERENCIAS SE PUEDE CORRER ESTO
  // Carga le imagen del usuario del posteo cada vez que monta el componente
  //  getFileUrl(props.post.user.photoURL).then(url=>{
  //           props.post.user.photoURLFile = url
  //       })
  // $on('update-post-user-image', updatePostUserImage);
  // console.log("props.post")
  // console.log(props.post)

})
</script>

<style></style>
