<template>
  <div>
      <h2>
        Add Venue
        <router-link to="/venue-list">Back to venues</router-link>
      </h2>
      <div>
        <form @submit="onSubmit">
          <form-group
            id="nameGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter name"
          >
            <form-input id="name" v-model.trim="venue.name"></form-input>
          </form-group>
          <form-group
            id="descGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter description"
          >
            <form-textarea
              id="description"
              v-model="venue.description"
              placeholder="Enter something"
              :rows="2"
              :max-rows="6"
            >{{venue.description}}</form-textarea>
          </form-group>
          <form-group
            id="locationGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter location"
          >
            <form-input id="location" v-model.trim="venue.location"></form-input>
          </form-group>
          <button type="submit" variant="primary">Save</button>
        </form>
      </div>
  </div>
</template>

<script>
const fb = require('../firebase.js')
import router from "../router";

export default {
  name: "AddVenue",
  data() {
    return {
      ref: fb.firestore().collection("venues"),
      venue: {},
      review: {},

      reviews: []
    };
  },
    beforeCreate() {
    this.$emit("onAuth", fb.auth().currentUser !== null);
  },
  methods: {
    onSubmit(evt) {
      (this.venue.rating = 0), (this.venue.reviewsCount = 0);
      this.venue.reviews = [];
      evt.preventDefault();
      
      this.ref
        .add(this.venue)
        // eslint-disable-next-line no-unused-vars
        .then(doc => {
          this.venue.name = "";
          this.venue.description = "";
          this.venue.location = "";
          router.push({
            name: "VenueList"
          });
        })
        .catch(error => {
          alert("Error adding document: ", error);
        });
    }
  }
};
</script>

