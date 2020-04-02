<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Add Venue
        <b-link href="#/">back to all venues</b-link>
      </h2>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group
            id="nameGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter name"
          >
            <b-form-input id="name" v-model.trim="venue.name"></b-form-input>
          </b-form-group>
          <b-form-group
            id="descGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter description"
          >
            <b-form-textarea
              id="description"
              v-model="venue.description"
              placeholder="Enter something"
              :rows="2"
              :max-rows="6"
            >{{venue.description}}</b-form-textarea>
          </b-form-group>
          <b-form-group
            id="locationGroup"
            horizontal
            :label-cols="4"
            breakpoint="md"
            label="Enter location"
          >
            <b-form-input id="location" v-model.trim="venue.location"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import firebase from "../firebase";
import router from "../router";

export default {
  name: "AddVenue",
  data() {
    return {
      ref: firebase.firestore().collection("venues"),
      venue: {},
      review: {},

      reviews: []
    };
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

<style>
.jumbotron {
  padding: 2rem;
}
</style>