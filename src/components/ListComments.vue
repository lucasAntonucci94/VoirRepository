<template>

  <div class="accordion accordion-flush" id="accordionFlushExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Comentarios <b> ({{comments.length}}) </b>
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div v-for="comment in comments" class="mb-1">
                <div class="accordion-body">
                  <!-- Mensaje: <code>{{comment.message}}</code> -->
                   <p class="small py-2"><DateFormatted :date="comment.timestamp" /> : <code>{{comment.message}}</code></p>
                </div>
            </div>
             
            </div>
          </div>
        </div>
  
</template>
<script setup>
import { useRouter } from "vue-router";
import {useAuth} from "../composition/functions.js";
import { ref, defineProps } from "vue";
import {onMounted, onUnmounted} from "vue";
import { subscribeToIncomingComments } from "../comments/comments.js";
import DateFormatted from "../components/DateFormatted.vue";

const props = defineProps({
  post: {
    id: String,
    title: String,
    body: String,
    user: String,
    timestamp: Date,
  },
});

const isLoading = ref(false);
const messages = ref([]); 
const comments = ref([]);
let unsubscribe = () => {};

onMounted(async () => {
    unsubscribe = await subscribeToIncomingComments(props.post.idDoc, data => comments.value = data);
});

</script>

<style></style>
