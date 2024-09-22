<template>
  <section class="container-fluid pt-5">
    <h1 class="mb-4 px-1 sr-only">Listado de chats</h1>
    <div class="row d-flex justify-content-center align-items-center">
      <template v-if="!hasChats">
        <p class="p-5 text-center h4">
          <Loader v-if="isLoading" class="gray" />
          NO TIENE CHATS DISPONIBLES
        </p>
      </template>
      <template v-else>
        <section class="col-4">
          <div id="chat-list">
            <Loader v-if="isLoading.value" class="gray" />
            <template v-else>
              <div v-if="chats.length > 0" class="bg-light rounded border shadow list-scrollable">
                <div
                  v-for="chat in chats" :key="chat.id"
                  style="text-decoration: none; background-color: #f3f3f3"
                  class="m-1 rounded border border-secondary p-2"
                >
                  <div class="row d-flex justify-content-center align-items-center">
                      <div class="col-1 ">
                        <img
                          :src="chat.user.photoURLFile != null ? chat.user?.photoURLFile : '/assets/imgs/image-avatar.png'"
                          alt="image-avatar"
                          style="width: 45px; height: 45px; border-radius: 35px;"
                        />
                      </div>
                      <div class="col-11 px-5">
                        <b class="text-secondary">
                          <a href="#" v-on:click.prevent="handleChatSelected(chat.user.email)">
                            <span class="text-dark "> {{ chat.user.email }} </span>
                            (Ver chat)
                            <!-- <i class="fa-solid fa-caret-right"></i> -->
                          </a>
                          <br>
                          (<DateFormatted :date="chat.timestamp" />)
                        </b>
                      </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
      </section>
      <ChatDetails :selectedUserEmail="selectedChatUser" />
    </template>
    </div>
  </section>
</template>
<script>

import { getChatsByEmail } from "../chat/chat.js";
import { getUserProfileByEmail } from "../users/index.js";
import { listenForAuthChanges } from "../auth/auth.js";
import DateFormatted from "../components/DateFormatted.vue";
import ChatDetails from "../components/ChatDetails.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "ChatList",
  components: { Loader, ButtonSubmitLoader, DateFormatted, ChatDetails },
  props: {
  },
  data: () => ({
    chats: [],
    user: {},
    selectedChatUser: null,
    isLoading: true,
    authUnsubscribe: () => {},
    chatUnsubscribe: () => {},
  }),
  computed: {
    hasChats(){
      if(this.chats.length > 0)
        return true
      else 
        return false
    }
  },
  methods: {
    handleChatSelected(userEmail) {
      this.selectedChatUser = userEmail;
    },
    async getChatsByUserEmail(email) {
      this.isLoading = true;
      const registeredChats = await getChatsByEmail(email);
      this.getChatsFullData(registeredChats).then((chats)=>{
        this.chats = chats
      })
    },
    async getChatsFullData(registeredChats) {
        var arrayChats = [];
      // Creo el listado array de chats a partir del registro de chats de base de datos
      registeredChats.forEach((chat) => {
        Object.keys(chat.user).forEach(async (element) =>  {
          if (element != undefined && element != null && this.validateEmail(element) && element != this.user.email) {
            arrayChats.push({
              id: chat.idDoc,
              user: {email: element},
              timestamp: chat.created_at,
            });
          }
        });
      });
      // Crear un array de promesas para cada llamada a getUserProfileByEmail
      const promises = arrayChats.map(async (chat) => {
        chat.user = await getUserProfileByEmail(chat.user.email);
        return chat;
      });

      // Esperar a que todas las promesas se resuelvan
      return Promise.all(promises);
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());   
    }
  },
   async mounted() {
    this.authUnsubscribe = listenForAuthChanges(async (userData) => {
      this.user = userData;
    });
    await this.getChatsByUserEmail(this.user.email).then(()=>{
      this.isLoading = false
    });
  },
  unmounted() {
    this.authUnsubscribe();
    this.chatUnsubscribe();
  },
};
</script>
<style>
.list-scrollable{
  height: 60vh;
  overflow-y: auto;
}
</style>