<template>
  <section class="container-fluid py-5">
    <div class="row d-flex justify-content-center">
      <div class="col-12 text-center">
        <h1 class="mb-4">Conecta con otros usuarios</h1>
      </div>
      <div class="col-12">
        <h2 class="mb-4 text-center h3 d-none">Listado de usuarios cercanos</h2>
        <div class="row g-2" >
          <template
            v-for="user in this.users"
            :key="'key_' + user.email"
          >
          <div class="col-3 col-sm-12 col-md-4 col-lg-3 d-flex-row align-items-center rounded border-secondary text-center border py-3" :style="{ height: '275px', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.78)), url('${user.photoURLFile ?? '/assets/imgs/avatar1.jpg'}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
            <div class="wrapper">
              <div id="divButtons">
                <router-link id="buttonAdd" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}`"><i class="fa-solid fa-add"></i></router-link>
                <router-link id="buttonProfile" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}`"><i class="fa-solid fa-eye"></i></router-link>
                <router-link id="buttonChat" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}/sociales/chat`"><i class="fa-solid fa-comment-dots"></i></router-link>
              </div>
              <p id="userName" class="pt-4 h5"><b>{{ user.displayName ?? user.email }}</b></p>
            </div>
          </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getAllUsers } from "../users/index.js";

export default {
  name: "Sociales",
  components: { },
  props: {},
  data: () => ({
    messages: [],
    users: [],
    userAuth: {},
    form: {
      user: "",
      message: "",
      isLoading: false,
    },
    isLoading: true,
  }),
  computed: {},
  methods: {
    async getUsers() {
      var users = await getAllUsers();
      var filteredUsers = []
      users.forEach(user => {
        if(user.email != this.userAuth.email)
          filteredUsers.push(user)
      });
      this.users = filteredUsers
    },
  },
  mounted() {
    this.getUsers()
  },
  unmounted() {
  },
};
</script>

<style>
.wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three equal columns for buttons */
  grid-template-rows: auto 1fr; /* Auto-height for buttons, remaining space for content */
  grid-gap: 10px;
}

#divButtons {
  grid-column: 3 / span 3; /* Span across all three columns */
  grid-row: 1; /* Align to the first row */
  justify-content: flex-end; /* Align buttons to the right */
  align-items: center; /* Align buttons vertically within the row */
}

#userName {
  grid-column: 1 / span 3; /* Span across all three columns */
  grid-row: 2; /* Place below the buttons */
  text-align: center; /* Center the user name horizontally */
}
</style>
