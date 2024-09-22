import './firebase'
import { createApp } from "vue"
import router from "./router/router.js"
import App from "./App.vue"
import * as $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

const app = createApp(App)
app.use(router)
app.mount('#app')