<template>
  <section class="container pt-5">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-12">
        <Alert v-if="message.text !== null" :type="message.type">
          {{ message.text }}
        </Alert>
      </div>
      <div class="col-6">
        <img src="/assets/imgs/catanddog3.png" 
          alt="image-default"
          class=".img-fluid"
          style="max-width: 70%; height: auto" />
      </div>

      <div class="col-6 p-5">
        <h1 class="text-center my-5" >Iniciar Sesión</h1>

        <form action="#" method="post" @submit.prevent="attemptLogin">
          <div class="mb-3">
            <label for="auth-login-email" class="form-label">Email</label>
            <input
              type="email"
              name="email"
              id="auth-login-email"
              class="form-control"
              v-model="form.email"
              :disabled="isLoading"
              placeholder="ingrese su email"
            />
          </div>
          <div class="mb-3">
            <label for="auth-login-password" class="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="auth-login-password"
              class="form-control"
              v-model="form.password"
              :disabled="isLoading"
              placeholder="ingrese su contraseña"
            />
          </div>
          <ButtonSubmitLoader :loading="isLoading">
          <b>
            INGRESAR
          </b>
          </ButtonSubmitLoader>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../auth/auth.js";
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
const attemptLogin = async () => {
  isLoading.value = true;
  const result = await login(form.value.email, form.value.password);
  isLoading.value = false;

  if (result !== true) {
    message.value = {
      text: result.message,
      type: "danger",
    };
  } else {
    closeAlert();
    router.push({
      path: "/",
    });
  }
};
</script>

<style></style>
