import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase';
// import VueRouter from 'vue-router'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'



Vue.config.productionTip = false
Vue.use(router)
Vue.use(BootstrapVue)

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

let app = '';

// firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});