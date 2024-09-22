<template>
  <section class="container-fluid py-5">
    <div class="row d-flex justify-content-center">
      <div class="col-12 text-center">
        <h1 class="mb-4">Listado de usuarios</h1>
      </div>
      <div class="col-12">
        <h2 class="mb-4 text-center h3 d-none">Listado de usuarios</h2>
        <div class="row d-flex justify-content-center align-items-center pb-5">
          <div
            class="col-8 "
          >
            <h2 class="mb-5 text-center sr-only">
              Listado de Lugares de interes
            </h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Email</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in this.users" :key="'key_' + index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ user.displayName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>
                     <router-link class="btn btn-primary" :to="`/user/${user.email}`">
                                <b class="px-2">VER</b> 
                            </router-link>
                    <!-- <button
                      class="btn btn-secondary mx-1 px-3"
                      v-on:click="toEdit(user)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-warning mx-1 px-3"
                      v-on:click="toDelete(user.id)"
                    >
                      Eliminar
                    </button> -->
                  </td>
                </tr>
              </tbody>
            </table>
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
  name: "ABMUsers",
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
</style>
