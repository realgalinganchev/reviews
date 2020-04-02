import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router'

// import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'

import VenueList from '../components/VenueList.vue'
import VenueDetails from '../components/VenueDetails.vue'
import AddVenue from '../components/AddVenue.vue'
import EditVenue from '../components/EditVenue.vue'

Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/venue-list',
      name: 'VenueList',
      component: VenueList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/edit-venue',
      name: 'EditVenue',
      component: EditVenue,
      meta: {
        requiresAuth: true
      }   
    },
    {
      path: '/venue-details/:id',
      name: 'VenueDetails',
      component: VenueDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add-venue',
      name: 'AddVenue',
      component: AddVenue,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('/venue-list');
  else next();
});

export default router;