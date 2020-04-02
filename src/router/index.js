import VueRouter from 'vue-router'
import VenueList from '../components/VenueList.vue'
import VenueDetails from '../components/VenueDetails.vue'
import AddVenue from '../components/AddVenue.vue'
import EditVenue from '../components/EditVenue.vue'

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'VenueList',
      component: VenueList
    },
    {
      path: '/edit-venue',
      name: 'EditVenue',
      component: EditVenue
    },
    {
      path: '/venue-details/:id',
      name: 'VenueDetails',
      component: VenueDetails
    },
    {
      path: '/add-venue',
      name: 'AddVenue',
      component: AddVenue
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   const currentUser = firebase.auth().currentUser;
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//   if (requiresAuth && !currentUser) next('login');
//   else if (!requiresAuth && currentUser) next('home');
//   else next();
// });
