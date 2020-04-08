<template>
  <row>
    <div>
      <h2>
        Edit Venue
        <router-link :to="{ name: 'VenueList', params: { id: key } }">(View all venues)</router-link>
      </h2>
      <div>
        <form @submit="onSubmit">
          <form-group id="nameGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Name">
            <form-input id="name" v-model.trim="venue.name"></form-input>
          </form-group>
          <form-group id="descGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Description">
              <form-textarea id="description"
                         v-model="venue.description"
                         placeholder="Enter something"
                         :rows="2"
                         :max-rows="6">{{venue.description}}</form-textarea>
          </form-group>
          <form-group id="locationGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Location">
            <form-input id="location" v-model.trim="venue.location"></form-input>
          </form-group>
          <button type="submit" variant="primary">Update</button>
        </form>
      </div>
    </div>
  </row>
</template>

<script>
const fb = require('../firebase.js')
import router from "../router";

export default {
  name: 'EditVenue',
  data () {
    return {
      key: this.$route.params.id,
      venue: {}
    }
  },
  created () {
    const ref = fb.firestore().collection('venues').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.venue = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
    beforeCreate() {
    this.$emit("onAuth", fb.auth().currentUser !== null);
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = fb.firestore().collection('venues').doc(this.$route.params.id);
      // eslint-disable-next-line no-unused-vars
      updateRef.set(this.venue).then((docRef) => {
        this.key = ''
        this.venue.name = ''
        this.venue.description = ''
        this.venue.location = ''
        router.push({ name: 'VenueList', params: { id: this.$route.params.id }})
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>