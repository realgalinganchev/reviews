<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Venue
        <b-link href="#/">(Venue List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">
          {{venue.name}}
        </template>
        <template slot="lead">
          Description: {{venue.description}}<br>
          Location: {{venue.location}}<br>
          Reviews made: {{venue.reviewsCount}}<br>
          Rating: {{venue.rating}}<br>
        </template>
        <hr class="my-4">
        <b-btn class="edit-btn" variant="success" @click.stop="editVenue(key)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deleteVenue(key)">Delete</b-btn>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import firebase from '../firebase'
import router from "../router";

export default {
  name: 'VenueDetails',
  data () {
    return {
      key: '',
      venue: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('venues').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.key = doc.id;
        this.venue = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    editVenue (id) {
      router.push({
        name: 'EditVenue',
        params: { id: id }
      })
    },
    deleteVenue (id) {
      firebase.firestore().collection('venues').doc(id).delete().then(() => {
        router.push({
          name: 'VenueList'
        })
      }).catch((error) => {
        alert("Error removing document: ", error);
      });
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
  .edit-btn {
    margin-right: 20px;
    width: 70px;
  }
</style>