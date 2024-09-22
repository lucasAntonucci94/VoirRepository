<template>
  <section class="col-8 bg-light d-flex justify-content-center align-items-center " style="height:  100%;">
      <div class="col-12 py-2">
        <!-- <h1 class="mb-4 h4 sr-only">Chat con : {props.selectedUserEmail}</h1> -->
        <div ref="chatMessages" class="p-3 mb-3 border rounded chat-messages">
          <div v-for="message in messages" class="mb-2">
            <b>
              (<DateFormatted :date="message.created_at" />)
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
      </div>
  </section>
</template>

<script setup>
import { useAuth } from "../composition/functions.js";
import { useRoute } from "vue-router";
import DateFormatted from "../components/DateFormatted.vue";
import { getUserProfileByEmail } from "../users/index.js";
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  subscribeToIncomingPrivateMessages,
  savePrivateMessage,
} from "../chat/chat.js";

// const emit = defineEmits(['clearMessages']);
const route = useRoute();
const { user } = useAuth();
const formMessage = ref("");
const selectedUser = ref({
  id: "",
  email: "",
  displayName: "",
});

const props = defineProps({
  selectedUserEmail: String,
});

watch(
  () => props.selectedUserEmail,
  async (newEmail) => {
    messages.value = [];
    loadMessagesForSelectedUser(newEmail);
  }
);
async function sendMessage() {
  const currentMessage = formMessage.value;
  formMessage.value = "";
  await savePrivateMessage(
    user.value.email,
    props.selectedUserEmail,
    currentMessage
  );
}
async function loadMessagesForSelectedUser(selectedUserEmail) {
  const currentMessage = formMessage.value;
  formMessage.value = "";
  await subscribeToIncomingPrivateMessages(
    user.value.email,
    selectedUserEmail,
    (data) => (messages.value = data)
  );
}

// no funciona re veer, deberia tirar la barra de scroll para abajo de todo en caso que tenga muchos chats y no entren a la vista. Para mostrar siempre los ultimos mensajes enviados.
function scrollToBottom() {
  if(this.$refs.chatMessages){
    console.log('this.$refs.chatMessages')
    console.log(this.$refs.chatMessages)
    const chatMessagesElement = this.$refs.chatMessages;
    chatMessagesElement.scrollTop = 0;
  }else{
    console.log('this.$refs.chatMessages')
    console.log(this.$refs.chatMessages)
  }
}

const messages = ref([]);
let unsubscribe = () => {};

onMounted(async () => {
  // console.log("props.selectedUserEmail")
  // console.log(props.selectedUserEmail)
  if(props.selectedUserEmail != null && props.selectedUserEmail != ""){
    selectedUser.value = await getUserProfileByEmail(props.selectedUserEmail).catch(
      (err) => console.error("[UserChat] getUserProfileByEmail - Error: ", err)
    );
    unsubscribe = await subscribeToIncomingPrivateMessages(
      user.value.email,
      selectedUser.value.email,
      (data) => (messages.value = data)
    );
    scrollToBottom();
  }
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