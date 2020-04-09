import Vue from 'vue';
import Vuex from 'vuex';
const fb = require('./firebase.js');

Vue.use(Vuex);


fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user);
        store.dispatch('fetchUserProfile');

        fb.usersCollection.doc(user.uid).onSnapshot(doc => {
            store.commit('setUserProfile', doc.data());
        })

        // realtime updates from our venues collection
        fb.venuesCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
                let venuesArray = [];

                querySnapshot.forEach(doc => {
                    let venue = doc.data();
                    venue.id = doc.id;
                    venuesArray.push(venue);
                })

                store.commit('setVenues', venuesArray);
            
        })
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        venues: [],

    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null);
            commit('setUserProfile', {});
            commit('setVenues', null);

        },
        fetchUserProfile({ commit, state }) {
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                commit('setUserProfile', res.data());
            }).catch(err => {
                console.log(err);
            })
        },
        // eslint-disable-next-line no-unused-vars
        updateProfile({ commit, state }, data) {
            let name = data.name;
            let surname = data.surname;
            let phoneNumber = data.phoneNumber;

            // eslint-disable-next-line no-unused-vars
            fb.usersCollection.doc(state.currentUser.uid).update({ name, surname, phoneNumber }).then(user => {
                // update all venues by user to reflect new name
                fb.venuesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.venuesCollection.doc(doc.id).update({
                            userName: name,
                            surname: surname,
                            phoneNumber: phoneNumber
                        })
                    })
                })
                // update all reviews by user to reflect new name
                fb.reviewsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.reviewsCollection.doc(doc.id).update({
                            userName: name,
                            surname: surname,
                            phoneNumber: phoneNumber
                        })
                    })
                })
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val;
        },
        setUserProfile(state, val) {
            state.userProfile = val;
        },
        setVenues(state, val) {
            if (val) {
                state.venues = val;
            } else {
                state.venues = [];
            }
        }
    }
})
