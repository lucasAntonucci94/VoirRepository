<template>
  <div class="row justify-content-center align-items-center">
    <template v-if="!showFlag">
          <div
            class="col-12 d-flex justify-content-center align-items-center text-white"
            style="
              height: 250px;
              background-image: url('/assets/imgs/bg/bg-profile.jpg');
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
            "
            v-if="!formFlag"
          >
            <div class="row">
              <div
                id="portada"
                class="col-12 d-flex align-items-center justify-content-center py-4"
              >
                <h1 class="px-4">PENDIENTES</h1>
              </div>
            </div>
          </div>
          <div class="col-12 my-4">
            <Alert v-if="message.text !== null" :type="message.type">
              {{ message.text }}
            </Alert>
          </div>
          <div v-if="!formFlag" class="col-12 d-flex justify-content-end px-5">
            <button class="btn btn-warning text-white" v-on:click="toCreate()">
              <b> INGRESA UN NUEVO LUGAR </b>
            </button>
          </div>
          <div class="col-8 d-flex justify-content-center align-items-center pb-5">
            <!-- <div class="col-8"> -->
            <div v-if="!formFlag" class="col-8">
              <h2 class="mb-5 text-center sr-only">Listado de Lugares de interes</h2>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Título</th>
                    <th scope="col">Detalle</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(location, index)  in arrayLocations">
                    <th scope="row">{{index+1}}</th>
                    <td>{{ location.title }}</td>
                    <td>{{ location.detail }}</td>
                    <td>{{ location.address }}</td>
                    <td>{{ location.phone }}</td>
                    <td>
                      <button class="btn btn-primary mx-1 px-3"
                        v-on:click="toShow(location)"
                      >
                        Ver
                      </button>
                      <button class="btn btn-primary mx-1 px-3"
                        v-on:click="changeState(location)"
                      >
                        Aprobar
                      </button>
                      <button
                        class="btn btn-secondary mx-1 px-3"
                        v-on:click="toEdit(location)"
                      >
                        Editar
                      </button>
                      <button
                        class="btn btn-warning mx-1 px-3"
                        v-on:click="toDelete(location.idDoc)"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- <div class="col-8"> -->
            <div v-else class="col-8">
              <button class="btn btn-secondary" v-on:click="changeFlag()">
                Volver
              </button>
              <h3 class="mt-3 text-center h4">INGRESAR UN NUEVO LUGAR DE INTERES</h3>
              <form action="#" @submit.prevent="saveLocation">
                <div class="row d-flex justify-content-center p-3">
                  <div class="col-12">
                    <!-- <label for="idDoc" class="form-label my-2 d-none"
                      >idDoc</label
                    >
                    <input
                      type="text"
                      id="idDoc"
                      class="form-control d-none"
                      v-model="formData.idDoc"
                    /> -->
                    <label for="title" class="form-label my-2">Titulo</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="ingrese un título"
                      class="form-control"
                      v-model="formData.title"
                    />
                    <label for="detail" class="form-label my-2">Detalle</label>
                    <input
                      type="text"
                      id="detail"
                      class="form-control"
                      placeholder="ingrese un detalle"
                      :disabled="isLoading"
                      v-model="formData.detail"
                    />
                    <label for="address" class="form-label my-2">Direccion</label>
                    <input
                      type="text"
                      id="address"
                      class="form-control"
                      placeholder="ingrese una dirección"
                      :disabled="isLoading"
                      v-model="formData.address"
                    />
                    <label for="phone" class="form-label my-2">Teléfono</label>
                    <input
                      type="text"
                      id="phone"
                      placeholder="ingrese un telefono"
                      class="form-control"
                      :disabled="isLoading"
                      v-model="formData.phone"
                    />
                  </div>
                  <div class="col-12">
                    <label for="imageBase64" class="form-label my-2">Imagen</label>
                    <input
                      type="file"
                      id="imageBase64"
                      class="form-control"
                      :disabled="isLoading"
                      @change="loadImage"
                    />
                    <div class="p-5" v-if="imageBase64 !== null">
                      <p>Previsualización de la imagen</p>
                      <img 
                        :src="imageBase64"
                        alt=""
                        ref="previewImage"
                        class=".img-fluid"    
                        style="width: 100%;"
                      />
                    </div>
                  </div>
                  <div class="col-12 my-3">
                    <ButtonSubmitLoader :loading="isLoading">
                      <strong> ACEPTAR </strong></ButtonSubmitLoader
                    >
                  </div>
                </div>
              </form>
            </div>
          </div>
    </template>
    <template v-else>
       <div class="col-12 text-center  rounded border bg-light">
        <div class="container">
              <h2 class="mb-5 text-center p-5">Ver Lugar de Interes: {{ locationRef.title }}</h2>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Título</th>
                    <th scope="col">Detalle</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{{index+1}}</th>
                    <td>{{ locationRef.title }}</td>
                    <td>{{ locationRef.detail }}</td>
                    <td>{{ locationRef.address }}</td>
                    <td>{{ locationRef.phone }}</td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-secondary" v-on:click="toShow()">
                Volver
              </button>

              </div>
            </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  createLocation,
  changeStateLocation,
  updateLocation,
  deleteLocation,
  subscribeToIncomingLocations,
} from "../../locations/index.js";
import ButtonSubmitLoader from "../../components/ButtonSubmitLoader.vue";
import { useAuth } from "../../composition/functions.js";
import { onMounted, onUnmounted } from "vue";
import Loader from "../../components/Loader.vue";
import Alert from "../../components/Alert.vue";

const { user } = useAuth();
const arrayLocations = ref([]);
const locationRef = ref({});
const isLoading = ref(false);
const formFlag = ref(false);
const showFlag = ref(false);
const imageBase64 = ref(null);
const previewImage = ref(null);
const reader = new FileReader();

const message = ref({
  text: null,
  type: "danger",
});

//Cambia formFlag que oculta el listado y muestra el formulario
const changeFlag = () => {
  formFlag.value = !formFlag.value;
  message.value = {
    text: null,
    type: "",
  };
};

// funciones de carga de imagen
const loadImage = (ev) => {
  const reader = new FileReader();
  const image = ev.target.files[0];
  reader.addEventListener("load", function () {
    imageBase64.value = reader.result;
  });
  reader.readAsDataURL(image);
};

// form ref
const formData = ref({
  // idDoc: null,
  title: null,
  detail: null,
  address: null,
  phone: null,
  socialNetworkLink: null,
  pending: true
});

//Cambia formFlag que oculta el listado y muestra el formulario
const toShow = (location) => {
  showFlag.value = !showFlag.value
  if(location != null){
    locationRef.value = location
  }
};
//Cambia formFlag que oculta el listado y muestra el formulario
const toCreate = () => {
  locationRef.value.idDoc = null;
  formData.value.title = null;
  formData.value.detail = null;
  formData.value.address = null;
  formData.value.phone = null;
  changeFlag();
};

// guardamos el nuevo lugar de interes
const saveLocation = () => {
  isLoading.value = true;
  if (
    formData.value.title == null ||
    formData.value.title == "" ||
    formData.value.detail == null ||
    formData.value.detail == "null" ||
    formData.value.address == null ||
    formData.value.address == "" ||
    formData.value.phone == null ||
    formData.value.phone == ""
  ) {
    message.value = {
      text: "Verifique los datos del formulario.",
      type: "danger",
    };
    isLoading.value = false;
  } else {
    if (locationRef.value.idDoc == null || locationRef.value.idDoc == "") {
      let dimensions = null
      if(previewImage != null && previewImage.value != null && previewImage.value != undefined){
        dimensions = {
            width: previewImage.value.width,
            height: previewImage.value.height,
          }
      }
      const success = createLocation({
        ...formData.value,
        photo: {
          imageBase64: imageBase64.value,
          dimensions: dimensions,
        },
        pending: user.value.isAdmin ? false : true
      });
      if (success) {
        isLoading.value = false;
        formFlag.value = !formFlag.value;
        message.value = {
          text: null,
          type: "",
        };
        formData.value.title = null;
        formData.value.detail = null;
        formData.value.address = null;
        formData.value.phone = null;
        formData.value.socialNetworkLink = null;
      } else {
        // TODO ERROR
      }
    } else {
      const success = updateLocation(locationRef.value.idDoc, {
        ...formData.value,
        photo: {
          imageBase64: imageBase64.value,
          pathFile: locationRef.value.imagePathFile ?? null,
          dimensions: {
            width: previewImage.value.width,
            height: previewImage.value.height,
          },
        },
      });
      if (success) {
        isLoading.value = false;
        formFlag.value = !formFlag.value;
        message.value = {
          text: null,
          type: "",
        };
        formData.value.title = null;
        formData.value.detail = null;
        formData.value.address = null;
        formData.value.phone = null;
        formData.value.socialNetworkLink = null;
      } else {
        // TODO ERROR
      }
    }
  }
};

//muestra pantalla con formulario de edicion, y pasa los valores de dicha location
const changeState = async (location) =>  {
  var response = await changeStateLocation(location);
};

//aprueba un lugar de interes pendiente
const toEdit = (location) => {
  debugger
  locationRef.value.idDoc = location.idDoc;
  formData.value.title = location.title;
  formData.value.detail = location.detail;
  formData.value.address = location.address;
  formData.value.phone = location.phone;
  
  changeFlag();
  // const success = await updateLocation(id)
  isLoading.value = false;
};

//elimina un lugar de interes
const toDelete = async (id) => {
  const success = await deleteLocation(id);
  isLoading.value = false;
};

let unsubscribe = () => {};

// Al montar el componente cargo los posteos de mi usuario
onMounted(async () => {
  unsubscribe = await subscribeToIncomingLocations((locations) => {
    arrayLocations.value = locations.filter(location => location.pending === true);
  });
});
</script>

<style>
</style>
