<template>
  <div class="home">
    <Venues v-bind:venues="venues" v-on:venue-details="showVenueDetails" />
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
// import db from "../firebase/firebaseInit";
import firebase from "firebase";
import Venues from "@/components/Venues.vue";
// import axios from "axios";

export default {
  name: "home",
  components: {
    Venues
  },
  data() {
    return {
      venues: []
    };
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    },
    showVenueDetails(id) {
      this.$router.push({ name: "venue-details", params: { venue_id: id } });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
</style>