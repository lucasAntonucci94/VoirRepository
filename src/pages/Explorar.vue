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
              <div id="portada" class="col-12 d-flex align-items-center justify-content-center py-4">
                <h1 class="px-4">EXPLORAR</h1>
              </div>
            </div>
          </div>
          <div class="col-12 my-2">
            <Alert v-if="message.text !== null" :type="message.type">
              {{ message.text }}
            </Alert>
          </div>
          <div v-if="!formFlag" class="col-12 d-flex justify-content-end px-3">
            <button class="btn btn-warning text-white" v-on:click="toCreate()">
              <b> ¿Queres adherirte a nuestra lista? </b>
            </button>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center py-3">
            <div v-if="!formFlag" class="row">
              <h2 class="mb-5 text-center sr-only">Listado de Lugares de interes</h2>
                <div class="col-4 list-scrollable" style="height: 450px"> 
                  <template v-for="location in arrayLocations">
                    <div class="row bg-light rounded border my-2">
                        <div v-if="location.imageUrlFile != null" class="col-12 text-center">
                          <img
                            :src="location.imageUrlFile"
                            alt="image-default"
                            class=".img-fluid"
                            style="max-width: 100%; max-height: 275px"
                          />
                        </div>
                        <div class="col-12 my-3">
                          <div class="row px-5">
                            <div class="col-12 pt-2">
                              <h3 class="h4">{{ location.title }}</h3>
                            </div>
                            <div class="col-12">
                              <div class="row d-flex justify-content-center">
                                <div class="col-11">
                                  <p>{{ location.detail }}</p>
                                </div>
                                <div class="col-12 d-flex  justify-content-end align-items-center">
                                  <button class="btn btn-primary mx-1" v-on:click="toShow(location)"><i class="fa-solid fa-circle-info"></i></button>
                                  <button class="btn btn-primary mx-1" v-on:click="centerMap(location)"><i class="fa-solid fa-location-dot"></i></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </template>
                </div>
                <div class="col-8 "> 
                  <Map v-if="arrayLocations.length > 0" :locations="arrayLocations ?? []" :selectedLocation="locationRef" />
                </div>
            </div>
            <!-- Formulario de adhesion -->
            <div v-else class="col-8">
              <button class="btn btn-secondary" v-on:click="changeFlag()">
                Volver
              </button>
              <h3 class="mt-3 text-center h4">ENVIANOS TU SERVICIO</h3>
              <p class="small text-secondary">Una vez envies la solicitud, un moderador del sitio debe aprobarla para que tu lugar de interes/servicio aparezca en la app.</p>
              <form action="#" @submit.prevent="saveLocation">
                <div class="row d-flex justify-content-center p-3">
                  <div class="col-12">
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
                      placeholder="ingrese un teléfono"
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
                      <strong> ACEPTAR </strong>
                    </ButtonSubmitLoader>
                  </div>
                </div>
              </form>
            </div>
          </div>
    </template>
    <template v-else>
        <div class="col-12 d-flex justify-content-center align-items-center p-5">
          <div class="row">
            <div class="col-6 d-flex-column justify-content-center align-items-center">
                  <p class="p-5 rounded" style="font-weight: bold;"> LUGAR SELECCIONADO: {{locationRef.title}} </p>
                  <p>{{locationRef.detail}}</p>
                  <p>Dirección: {{locationRef.address}}</p>
                  <p>Teléfono: {{locationRef.phone}}</p>
              </div>
              <div class="col-6" v-if="locationRef.imageUrlFile != null">
                  <img
                      :src="locationRef.imageUrlFile"
                      alt="image-default"
                      class=".img-fluid"
                      style="max-width: 100%; height: auto"
                    />
              </div>
            <button class="btn btn-info mt-4" v-on:click="toShow(null)">
                Volver
            </button>
            </div>          
        </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch,onMounted, onUnmounted, defineEmits  } from "vue";
import {
  createLocation,
  updateLocation,
  deleteLocation,
  subscribeToIncomingLocations,
} from "../locations/index.js";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import { useAuth } from "../composition/functions.js";
import Loader from "../components/Loader.vue";
import Alert from "../components/Alert.vue";
import Map from "../components/Map.vue";

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
  pending: false,
});

//Cambia formFlag que oculta el listado y muestra el formulario
const toShow = (location) => {
  showFlag.value = !showFlag.value
  if(location != null){
    locationRef.value = location
    console.log(locationRef.value.imageUrlFile)
  }
};

//Cambia formFlag que oculta el listado y muestra el formulario
const centerMap = (location) => {
  locationRef.value = location
  // this.$emit('locationSelected', location)
  // emit('locationSelected', location)
};
//Cambia formFlag que oculta el listado y muestra el formulario
const toCreate = () => {
  locationRef.value.idDoc = null;
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
      const body = {
        ...formData.value,
      }
      if(imageBase64.value != null){
        body.photo = {
          imageBase64: imageBase64.value,
          dimensions: {
            width: previewImage.value.width,
            height: previewImage.value.height,
          }
        }
      }
      const success = createLocation(body);
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
        imageBase64.value = null;
      } else {
        // TODO ERROR
      }
    } else {
      const success = updateLocation(locationRef.value.idDoc, {
        ...formData.value,
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

//elimina un lugar de interes
const toEdit = async (id) => {
  locationRef.value.idDoc = id;

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
    arrayLocations.value = locations.filter(location => location.pending === false);
  });
});
</script>
<style>
.list-scrollable{
  height: 60vh;
  overflow-y: auto;
}
</style>
