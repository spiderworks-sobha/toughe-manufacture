import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./state/store";

import BootstrapVue3 from 'bootstrap-vue-3';
import vClickOutside from "click-outside-vue3"
import Maska from 'maska';

import VueFeather from 'vue-feather';
import Particles from "particles.vue3";

import axios from 'axios';
import toast from './services/toast'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import '@/assets/scss/config/default/app.scss';

axios.interceptors.response.use(
    function(response) { 
        return response;
    }, 
    function(error) {
        if (error.response) {
            toast.error(error.response.data.message);
        }
    });

axios.interceptors.request.use(config => {
    if (store.getters["auth/authenticated"]) {
        const user = store.getters["auth/user"]
        const token = user.auth_token;
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

let app = createApp(App)

app.config.globalProperties.base_url = 'http://localhost/omnisellcrm-backend/api'
app.config.globalProperties.parant_organisations_id = 6

app.use(store)
    .use(router)
    .use(BootstrapVue3)
    .component(VueFeather.type, VueFeather)
    .use(Maska)
    .use(Particles)
    .use(VueSweetalert2)
    .use(vClickOutside).mount('#app')
