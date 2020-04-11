<template >
  <div>
    <div class="venue-title">
      <transition name="fade">
        <p v-if="showFailure" class="failure">You have not submitted this review!</p>
      </transition>
      <h2>{{ venue.name }}</h2>
    </div>
    <div class="p-modal">
      <div class="p-container">
        <div id="venue-details">
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
        <div v-show="venueReviews.length" class="review">
          <div v-for="review in venueReviews" class="review" v-bind:key="review.id">
            <h5>{{review.content | trimLength}}...</h5>
            <p>{{ review.content }}</p>
            <span>{{ review.createdOn | formatDate }}</span>
            <p>by {{ review.userName }}</p>
            <li>
              <a @click="deleteReview(review)">Delete ❌</a>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      fullVenue: {},
      venueReviews: [],
      showFailure: false
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
      })
      .catch(err => {
        console.log(err);
      });
    fb.venuesCollection.doc(this.$route.params.id).onSnapshot(doc => {
      this.venue = doc.data();
    });
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "venues"])
  },
  methods: {
    deleteReview(review) {
      if (this.currentUser.uid !== review.userId) {
        this.showFailure = true;

        setTimeout(() => {
          this.showFailure = false;
        }, 4000);
        return;
      } else {
        fb.reviewsCollection.doc(review.id).delete();

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
          })
          .catch(err => {
            console.log(err);
          });
        let updatedReviews = this.venue.reviews;
        if (updatedReviews >= 1) {
          fb.venuesCollection.doc(this.$route.params.id).update({
            reviews: updatedReviews - 1
          });
        } else {
          fb.venuesCollection.doc(this.$route.params.id).update({
            reviews: 0
          });
        }
      }
    }
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