 <template>

  <form class="my-2" action="#" @submit.prevent="sendComment">
    <h5 class="sr-only">Deja tú comentario:</h5>
    <label for="chat-form-message" class="form-label d-none">Descripción</label>
    <textarea
      id="chat-form-message"
      name="message"
      class="form-control"
      placeholder="ingrese un comentario"
      :disabled="form.isLoading"
      v-model="form.message"
      style="margin-bottom: 5px"
    ></textarea>
    <ButtonSubmitLoader :loading="form.isLoading"> <b> ENVIAR </b></ButtonSubmitLoader>
  </form>
  
</template>
<script setup>
import { ref, defineProps } from "vue";
import { saveComment } from "../comments/index.js";
import ButtonSubmitLoader from "./ButtonSubmitLoader.vue";

const props = defineProps({
  post: { 
    id: String,
    idDoc: String,
    title: String,
    body: String,
    user: Object,
    timestamp: Date,
  },
});

const form = ref({
  user: props.post.user,
  message: "",
  timestamp: "",
  isLoading: false,
});

const sendComment = async () => {
  form.value.isLoading = true;
  await saveComment({
    user: props.post.user,
    idPost: props.post.idDoc,
    message: form.value.message,
  });
  form.value.isLoading = false;
  form.value.message = "";
};
</script>

<style></style>
