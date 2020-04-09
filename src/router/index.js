import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router'


import Login from '../views/Login.vue'
import VenueList from '../components/VenueList.vue'
import VenueDetails from '../components/VenueDetails.vue'
import AddVenue from '../components/AddVenue.vue'
import Profile from '../components/Profile.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
		{
			path: '*',
			redirect: '/venue-list'
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
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
    },
    {
			path: '/profile',
			name: 'Profile',
			component: Profile,
            meta: {
                requiresAuth: true
            }
		}
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router