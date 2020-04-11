import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate";
import router from './router'
import { store } from './store.js'
const fb = require('./firebase.js')
import './assets/scss/app.scss'

Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.use(router);

let app = '';


fb.auth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})
