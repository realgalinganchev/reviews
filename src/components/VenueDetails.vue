<template >
  <div class="p-modal">
    <div class="p-container">
      <div class="venue">
        <h4>{{ venue.name }}</h4>
        <!-- <span>{{ venue.createdOn | formatDate }}</span> -->
        <p>{{ venue.description }}</p>
        <ul>
          <li>
            <a>reviews {{ venue.reviews }}</a>
          </li>
          <li>
            <a>likes {{ venue.likes }}</a>
          </li>
        </ul>
      </div>
      <div v-show="venueReviews.length" class="reviews">
        <div v-for="review in venueReviews" class="review" v-bind:key="review.id">
          <h5>{{review.content | trimLength}}...</h5>
          <p>{{ review.content }}</p>
          <span>{{ review.createdOn | formatDate }}</span>
          <p>by {{ review.userName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import moment from "moment";
const fb = require("../firebase.js");

export default {
  data() {
    return {
      venue: {},
      review: {
        venueId: "",
        venueName: "",
        userId: "",
        content: "",
        venueReviews: 0
      },
      errors: [],
      // showReviewModal: false,
      // showVenueModal: false,
      fullVenue: {},
      venueReviews: []
    };
  },
  created() {
    fb.reviewsCollection
      .where("venueId", "==", this.$route.params.id)
      .orderBy("createdOn", "desc") 
      .get()
      .then(docs => {
        let reviewsArray = [];

        docs.forEach(doc => {
          let review = doc.data();
          review.id = doc.id;
          reviewsArray.push(review);
        });

        this.venueReviews = reviewsArray;
        this.fullVenue = this.venue;
        // console.log(JSON.stringify(this.fullVenue));
        // this.showVenueModal = true;
      })
      .catch(err => {
        console.log(err);
      });
    fb.venuesCollection.doc(this.$route.params.id).onSnapshot(doc => {
      this.venue = doc.data();
    });
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 20) {
        return val;
      }
      return `${val.substring(0, 20)}...`;
    }
  }
};
</script>