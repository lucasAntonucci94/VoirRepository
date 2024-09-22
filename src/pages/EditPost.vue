<template >
<div class="container pt-5">

    <section class="row py-2 d-flex justify-content-center">
        <div class="col-8">
            <h1 class="mb-4">Selecionaste: "{{ post.title }}".</h1>

                <div class="col-12">
                 <Alert v-if="message.text !== null" :type="message.type">
                     {{ message.text }}
                </Alert>
            </div>

            <form class="my-2 w-100" action="#" @submit.prevent="update" >
                <div class="mb-3">
                    <label for="post-form-title" class="form-label py-2"> Título:</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="post-form-title" 
                        class="form-control" 
                        placeholder="ingrese un título"
                        :disabled="isLoading"
                        v-model="form.title"    
                        style="margin-bottom:5px" 
                    >
                    <label for="post-form-body" class="form-label py-2">Descripción</label>
                    <textarea
                        id="post-form-body"
                        name="body"
                        class="form-control"
                        placeholder="ingrese una descripción"
                        :disabled="isLoading"
                        v-model="form.body"
                        style="margin-bottom:5px"
                    ></textarea>
                    <label for="photoURL" class="form-label my-2">Imagen</label>
                    <input
                        type="file"
                        id="photoURL"
                        class="form-control"
                        :disabled="form.isLoading"
                        @change="loadImage"
                    />
                </div>
                <div class="btn-group form-control">
                    <router-link class="btn btn-secondary " :to="`/${backurl == 'home' ? '' : backurl}`">Volver</router-link>
                    <button class="btn btn-primary">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    </section>

    </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "../composition/functions.js";
import {getPostById, updatePost} from "../posts/index.js";
// import DateFormatted from "../components/DateFormatted.vue";
import Alert from "../components/Alert.vue";

const route = useRoute();
const router = useRouter();
const {user} = useAuth();

const isLoading = ref(true);
const backurl = ref(route.params.backurl);
const reader = new FileReader();
const message = ref({
  text: null,
  type: "danger",
});

const post = ref({
    id: '',
    title: '',
    body: '',
    image: '',
    timestamp:''
});

const form = ref({
    user: '',
    title: '',
    body: '=',
    imagePathFile: '',
    imageBase64: null,
    timestamp: ''
});

// funciones de carga de imagen
const loadImage = (ev) => {

const image = ev.target.files[0];
reader.addEventListener("load", function () {
  form.value.imageBase64 = reader.result;

});
reader.readAsDataURL(image);
};

const update = async () => {
    isLoading.value = true;
    
    if( form.value.title == '' | form.value.body == '')
    {
       message.value = {
                text: "Verifique los datos del formulario.",
                type: "danger",
            }
        isLoading.value = false;
    }else{

   
        try{
            await updatePost(route.params.idDoc, form.value);
            message.value = {
                text: "Publicación actualizada exitosamente.",
                type: "info",
            }
            post.value.title = form.value.title
            post.value.body = form.value.body
            // form.value.title = ''
            // form.value.body = ''
            setTimeout(async () => {
                router.push({
                    path: "/",
                });
            }, 750);
        }   
        catch(err){
            console.log("Method: updatePost. Error al intentar actualizar un post", err)
        }
        
        isLoading.value = false;
    }
    //  form.value = {
    //         // user: post.value.user,
    //         title: post.value.title,
    //         body: post.value.body,
    //         // image: post.value.image,
    //         // timestamp: post.value.user
    // }
}

/*
 |--------------------------------------------------------------------------
 | Obtener un Post/Publicación a partir de si doc.ID
 |--------------------------------------------------------------------------
 */

let unsubscribe = () => {};

onMounted(async () => {
    //  this.message = {
    //         text: null,
    //         type: "danger",
    // }
    isLoading.value = true
    post.value = await getPostById(route.params.id)
        .catch(err => console.error('[GetPostById] ERROR - ', err));
    form.value = {
            user: post.value.user,
            title: post.value.title,
            body: post.value.body,
            timestamp: post.value.user,
            imagePathFile: post.value.imagePathFile,
            // imageUrlFile: post.value.imageUrlFile,
    }
    isLoading.value = false

    // unsubscribe = await subscribeToIncomingComments(user.value.email, post.value.id, data => messages.value = data);
});

onUnmounted(() => {
    unsubscribe();
})
</script>
