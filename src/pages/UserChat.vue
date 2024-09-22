<template>
  <div class="container pt-5">
    <div class="row d-flex px-5 justify-content-center align-items-center">
      <div class="col-12">
        <!-- <Alert v-if="message.text !== null">
          {{ message.text }}
        </Alert> -->
      </div>
      <div class="col-5">
        <img
          src="/assets/imgs/image-chat.png"
          alt="image-default"
          class=".img-fluid"
          style="max-width: 100%; height: auto"
        />
      </div>
      <div class="col-7">
        <h1 class="mb-4 h4">Chat con {{ otherUser.email }}</h1>
        <div class="p-3 mb-3 border rounded chat-messages" style="min-height: 400px">
          <div v-for="message in messages" class="mb-2">
            <b
              >(<DateFormatted :date="message.created_at" />)
              <router-link :to="`/user/${message.user}`">{{
                message.user
              }}</router-link>
              dijo</b
            >: {{ message.message }}
          </div>
        </div>
        <form action="#" @submit.prevent="sendMessage">
          <div class="d-flex justify-content-start">
            <label for="message" class="visually-hidden">Mensaje</label>
            <input
              type="text"
              id="message"
              class="form-control me-3"
              v-model="formMessage"
            />
            <button type="submit" class="btn btn-primary">ENVIAR</button>
          </div>
        </form>
        <router-link
          class="btn btn-dark mt-4 w-100 border border-light"
          :to="`/${(backurl != 'user') ? backurl : backurl+'/'+otherUser.email }`"
        >
          <b class="h5 text-decoration-none"> VOLVER </b>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "../composition/functions.js";
import { useRoute } from "vue-router";
import DateFormatted from "../components/DateFormatted.vue";
import { getUserProfileByEmail } from "../users/index.js";
import { onMounted, onUnmounted, ref } from "vue";
import {
  subscribeToIncomingPrivateMessages,
  savePrivateMessage,
} from "../chat/chat.js";

const route = useRoute();
const { user } = useAuth();
const otherUser = ref({
  id: "",
  email: "",
  displayName: "",
});

const formMessage = ref("");
const backurl = ref(route.params.backurl);

async function sendMessage() {
  const currentMessage = formMessage.value;
  formMessage.value = "";
  await savePrivateMessage(
    user.value.email,
    otherUser.value.email,
    currentMessage
  );
}

const messages = ref([]);
let unsubscribe = () => {};

onMounted(async () => {
  otherUser.value = await getUserProfileByEmail(route.params.email).catch(
    (err) => console.error("[UserChat] getUserProfileByEmail - Error: ", err)
  );
  unsubscribe = await subscribeToIncomingPrivateMessages(
    user.value.email,
    otherUser.value.email,
    (data) => (messages.value = data)
  );
});

onUnmounted(() => {
  unsubscribe();
});
</script>
<style>
.chat-messages {
  height: 60vh;
  overflow-y: auto;
}
</style>