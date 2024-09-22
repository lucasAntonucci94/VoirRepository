<template>
  <section class="container-fluid pt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-12 text-center">
        <h1 class="mb-4 sr-only">Preguntas Frecuentes</h1>
      </div>
      <div class="col-4">
        <h2 class="mb-4 text-center h3">Preguntas Frecuentes</h2>
        <p class="mb-4 small text-center text-secondary">
          Aquí podrás preguntar sobre cualquier consulta que tengas y quieras
          respuestas al respecto.
        </p>
      </div>
      <div class="col-8">
        <div class="row d-flex justify-content-center">
          <h2 class="mb-4 text-center h3">Chat de consultas global.</h2>
          <section class="col-8">
            <div id="chat-message-list">
              <Loader v-if="isLoading" class="gray" />
              <div class="scrollable" v-else>
                <div
                  v-for="message in messages"
                  class="m-1 bg-light reounded p-3"
                >
                  <b
                    >(<DateFormatted :date="message.timestamp" />)
                    <router-link :to="`/user/${message.user}`">{{
                      message.user
                    }}</router-link>
                    dijo</b
                  >: {{ message.message }}
                </div>
              </div>
            </div>
          </section>
          <section class="col-8 py-3">
            <h2 class="pb-2 h5">Inserte un mensaje:</h2>
            <form action="#" @submit.prevent="send">
              <div class="mb-3">
                <label for="chat-form-message" class="form-label d-none"
                  >Mensaje</label
                >
                <textarea
                  id="chat-form-message"
                  name="message"
                  class="form-control"
                  :disabled="form.isLoading"
                  v-model="form.message"
                ></textarea>
              </div>
              <ButtonSubmitLoader :loading="form.isLoading">
                Enviar
              </ButtonSubmitLoader>
            </form>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { subscribeToIncomingMessages, saveMessage } from "../chat/chat.js";
import { listenForAuthChanges } from "../auth/auth.js";
import { getAllUsers } from "../users/index.js";
import DateFormatted from "../components/DateFormatted.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "Sociales",
  components: { Loader, ButtonSubmitLoader, DateFormatted },
  props: {},
  data: () => ({
    messages: [],
    users: [],
    userAuth: {},
    showGlobal: false,
    form: {
      user: "",
      message: "",
      isLoading: false,
    },
    isLoading: true,
    chatUnsubscribe: () => {},
    authUnsubscribe: () => {},
  }),
  computed: {},
  methods: {
    async send() {
      this.form.isLoading = true;
      await saveMessage({ ...this.form });
      this.form.isLoading = false;
      this.form.message = "";
    },
    async getUsers() {
    
      var users = await getAllUsers({ ...this.form });
      var filteredUsers = []
      users.forEach(user => {
        if(user.email != this.userAuth.email)
          filteredUsers.push(user)
      });
      this.users = filteredUsers
    },
    setGlobal() {
      this.showGlobal = !this.showGlobal;
    },
  },
  mounted() {
    this.getUsers()
    this.chatUnsubscribe = subscribeToIncomingMessages((msgs) => {
      this.messages = msgs;
      this.isLoading = false;
    });
    this.authUnsubscribe = listenForAuthChanges((userData) => {
      this.userAuth = userData;
      this.form.user = userData.email;
    });
  },
  unmounted() {
    this.chatUnsubscribe();
    this.authUnsubscribe();
  },
};
</script>
<style>
.scrollable {
  height: 50vh;
  overflow-y: auto;
}
</style>