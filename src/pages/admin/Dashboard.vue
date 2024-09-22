<template>
  <section class="container-fluid py-5">
    <div class="row d-flex justify-content-center">
      <h1 class="my-4 text-center">Panel de Administrador</h1>
      <div class="col-10">
        <p class="mb-4 small text-center text-secondary">
          Aquí podrás de momento editar los lugares de interés.
        </p>
        <div class="row justify-content-center p-5">
          <div class="col-5 text-center p-5 border rounded bg-light m-1">
            <router-link class="nav-link text-dark" to="/admin/pendinglocations">
              <i class="fa fa-solid fa-location-dot icons-card" ></i>
              <p class="text-Card">Aprobar Lugares de interes</p>
            </router-link>
          </div>
          <div class="col-5 text-center p-5 border rounded bg-light m-1">
            <router-link class="nav-link text-dark" to="/admin/abmlocations">
              <i class="fa fa-solid fa-location-dot icons-card" ></i>
              <p class="text-Card">ABM Lugares de interes</p>
            </router-link>
          </div>
          <div class="col-5 text-center p-5 border rounded bg-light m-1">
            <router-link class="nav-link text-dark" to="/admin/abmUsers">
              <i class="fa fa-solid fa-users icons-card"></i>
              <p class="text-Card">ABM Usuarios</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { subscribeToIncomingMessages, saveMessage } from "../../chat/chat.js";
import { listenForAuthChanges } from "../../auth/auth.js";
import { getAllUsers } from "../../users/index.js";
import DateFormatted from "../../components/DateFormatted.vue";
import ButtonSubmitLoader from "../../components/ButtonSubmitLoader.vue";
import Loader from "../../components/Loader.vue";

export default {
  name: "Dashboard",
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
      var filteredUsers = [];
      users.forEach((user) => {
        if (user.email != this.userAuth.email) filteredUsers.push(user);
      });
      this.users = filteredUsers;
    },
    setGlobal() {
      this.showGlobal = !this.showGlobal;
    },
  },
  mounted() {
    this.getUsers();
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
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 45px;
  grid-template-rows: 45px 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
}
#buttonChat {
  grid-column: 3;
  grid-row: 1;
}
#userName {
  grid-column: 1/4;
  grid-row: 5;
}
.icons-card{
  width: 300px;
  height: 100px;
  margin-bottom: 25px;
  color: #04a395;
}
.text-Card {
  font-weight: bold;
  font-size: 1.25em;
    color: #04a395;
}
</style>
