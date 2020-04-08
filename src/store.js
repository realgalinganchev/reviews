import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebase.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')
        // console.log(user.id +"from Store");
        fb.usersCollection.doc(user.uid).onSnapshot(doc => {
            store.commit('setUserProfile', doc.data())
        })

        // realtime updates from our venues collection
        fb.venuesCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            // check if created by currentUser
            let createdByCurrentUser
            if (querySnapshot.docs.length) {
                createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges()[0].doc.data().userId ? true : false
            }

            // add new venues to hiddenVenues array after initial load
            if (querySnapshot.docChanges().length !== querySnapshot.docs.length
                && querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser) {

                let venue = querySnapshot.docChanges()[0].doc.data()
                venue.id = querySnapshot.docChanges()[0].doc.id

                store.commit('setHiddenVenues', venue)
            } else {
                let venuesArray = []

                querySnapshot.forEach(doc => {
                    let venue = doc.data()
                    venue.id = doc.id
                    venuesArray.push(venue)
                })

                store.commit('setVenues', venuesArray)
            }
        })
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        venues: [],
        hiddenVenues: []
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null)
            commit('setUserProfile', {})
            commit('setVenues', null)
            commit('setHiddenVenues', null)
        },
        fetchUserProfile({ commit, state }) {
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                commit('setUserProfile', res.data())
            }).catch(err => {
                console.log(err)
            })
        },
        // eslint-disable-next-line no-unused-vars
        updateProfile({ commit, state }, data) {
            let name = data.name

            // eslint-disable-next-line no-unused-vars
            fb.usersCollection.doc(state.currentUser.uid).update({ name }).then(user => {
                // update all venues by user to reflect new name
                fb.venuesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.venuesCollection.doc(doc.id).update({
                            userName: name
                        })
                    })
                })
                // update all reviews by user to reflect new name
                fb.reviewsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.reviewsCollection.doc(doc.id).update({
                            userName: name
                        })
                    })
                })
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setVenues(state, val) {
            if (val) {
                state.venues = val
            } else {
                state.venues = []
            }
        },
        setHiddenVenues(state, val) {
            if (val) {
                // make sure not to add duplicates
                if (!state.hiddenVenues.some(x => x.id === val.id)) {
                    state.hiddenVenues.unshift(val)
                }
            } else {
                state.hiddenVenues = []
            }
        }
    }
})
