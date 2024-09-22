<template>
  <section class="container pt-5">
      <div class="row d-flex justify-content-center align-items-center">
   
    <div class="col-12">
   <Alert v-if="message.text !== null" :type="message.type">
          {{ message.text }}
    </Alert>
      </div>
    <div class="col-6">
         <h1 class="text-center my-5" >Crea tu propio usuario</h1>
      <form action="#" class="mx-3" @submit.prevent="register">
        <div class="mb-3">
          <label for="auth-register-email" class="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="auth-register-email"
            class="form-control"
            :disabled="isLoading"
            v-model="form.email"
            placeholder="ingrese su email"
          />
        </div>
        <div class="mb-3">
          <label for="auth-register-password" class="form-label"
            >Password</label
          >
          <input
            type="password"
            name="password"
            id="auth-register-password"
            class="form-control"
            :disabled="isLoading"
            v-model="form.password"
            placeholder="ingrese una contraseña"
          />
        </div>
        <ButtonSubmitLoader :loading="isLoading"
          >
          <b>
            REGISTRAR
          </b>
          </ButtonSubmitLoader
        >
      </form>
    </div>
    <div class="col-6">
      <img src="/assets/imgs/catanddog4.png" 
          alt="image-default"
          class=".img-fluid"
          style="max-width: 70%; height: auto" />
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { doRegister } from "../auth/auth.js";
import Alert from "../components/Alert.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";

const form = ref({
  email: null,
  password: null,
});
const message = ref({
  text: null,
  type: "danger",
});
const isLoading = ref(false);
const router = useRouter();

const closeAlert = () => {
  message.value.text = null;
};

const register = async () => {
  isLoading.value = true;

  const response = await doRegister({ ...form.value });
  isLoading.value = false;

  if (response !== true)
    message.value = {
      text: response.message,
      type: "danger",
    };
  else {
    closeAlert();
    router.push({
      path: "/",
    });
  }
};
</script>

<style></style>
