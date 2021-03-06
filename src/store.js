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
        fb.venuesCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            let venuesArray = [];
            querySnapshot.forEach(doc => {
                let venue = doc.data();
                venue.id = doc.id;
                venuesArray.push(venue);
            })
            store.commit('setVenues', venuesArray);
        });
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        venues: [],
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
        },
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

        updateProfile({ state }, data) {
            let name = data.name;
            let surname = data.surname;
            let phoneNumber = data.phoneNumber;

            fb.usersCollection.doc(state.currentUser.uid).update({ name, surname, phoneNumber }).then(() => {
                fb.venuesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.venuesCollection.doc(doc.id).update({
                            userName: name,
                            surname: surname,
                            phoneNumber: phoneNumber
                        });
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        }
    }

});
