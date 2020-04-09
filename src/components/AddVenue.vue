<template>
  <section id="add-venue">
        <div class="col1">
          <div class="profile">
            <h3>Add venue</h3>
            <div class="create-venue">
              <form @submit.prevent>
                <label for="name">Name</label>
                <input v-model.trim="venue.name" type="text" placeholder="Your favorite bar's name" />
                <label for="name">Description</label>
                <input v-model.trim="venue.description" type="text" placeholder="Draught beer bar" />
                <label for="name">Location</label>
                <input
                  v-model.trim="venue.location"
                  type="text"
                  placeholder="Patriarh Evtimii Street 35"
                />
                <button @click="createVenue" :disabled="venue.name == '' || venue.description == '' || venue.location == ''" class="button">Submit</button>
              </form>
            </div>
          </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebase.js");
// import router from "../router";

export default {
  name: "AddVenue",
  data() {
    return {
      venue: {
        name: "",
        description: "",
        location: ""
      }
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "venues"])
  },
  methods: {
    createVenue() {
      fb.venuesCollection
        .add({
          createdOn: new Date(),
          name: this.venue.name,
          description: this.venue.description,
          location: this.venue.location,
          userId: this.currentUser.uid,
          userName: this.userProfile.name,
          reviews: 0,
          likes: 0
        })
        // eslint-disable-next-line no-unused-vars
        .then(ref => {
          this.venue.description = "";
        })
        .catch(err => {
          console.log(err);
        });
      this.$router.push("/venue-list");
    }
  }
};
</script>

