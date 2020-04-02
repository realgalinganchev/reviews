<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Venue
        <router-link :to="{ name: 'VenueList', params: { id: key } }">(View all venues)</router-link>
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="nameGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Name">
            <b-form-input id="name" v-model.trim="venue.name"></b-form-input>
          </b-form-group>
          <b-form-group id="descGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Description">
              <b-form-textarea id="description"
                         v-model="venue.description"
                         placeholder="Enter something"
                         :rows="2"
                         :max-rows="6">{{venue.description}}</b-form-textarea>
          </b-form-group>
          <b-form-group id="locationGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Location">
            <b-form-input id="location" v-model.trim="venue.location"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Update</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import firebase from '../firebase'
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
    const ref = firebase.firestore().collection('venues').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.venue = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = firebase.firestore().collection('venues').doc(this.$route.params.id);
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