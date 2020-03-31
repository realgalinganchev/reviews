import VueRouter from 'vue-router'
import VenueList from '../components/VenueList.vue'
import VenueDetails from '../components/VenueDetails.vue'


// import ShowBoard from '../components/ShowBoard.vue'
// import Boardlist from '../components/Boardlist.vue'
import AddBoard from '../components/AddBoard.vue'
import EditBoard from '../components/EditBoard.vue'
import HelloWorld from '../components/HelloWorld.vue'

export default new VueRouter({
  routes: [
        // {
    //   path: '/',
    //   name: 'Boardlist',
    //   component: Boardlist
    // },
    // {
    //   path: '/show-board/:id',
    //   name: 'ShowBoard',
    //   component: ShowBoard
    // },
    {
      path: '/',
      name: 'VenueList',
      component: VenueList
    },
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    
    {
      path: '/venue-details/:id',
      name: 'VenueDetails',
      component: VenueDetails
    },
    {
      path: '/add-board',
      name: 'AddBoard',
      component: AddBoard
    },
    {
      path: '/edit-board/:id',
      name: 'EditBoard',
      component: EditBoard
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
