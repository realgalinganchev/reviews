/* eslint-disable no-unused-vars */
<template>
  <div id="venue-list">
    <section>
      <div class="col2">
        <div id="title">
          <h2>Venue List</h2>
        </div>
        <div v-if="venues.length">
          <div v-for="venue in venues" class="venue" v-bind:key="venue.id">
            <h5>{{ venue.name }}</h5>
            <span>{{ venue.createdOn | formatDate }}</span>
            <p>{{ venue.description }}</p>
            <ul>
              <li>
                <a @click="openReviewModal(venue)">add a review</a>
              </li>
              <li>
                <a @click="likeVenue(venue.id, venue.likes)">likes {{ venue.likes }}</a>
              </li>
              <li>
                <a @click="viewVenue(venue)">view all {{ venue.reviews }} reviews</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no venues</p>
        </div>
      </div>
    </section>

    <!-- review modal -->
    <transition name="fade">
      <div v-if="showReviewModal" class="c-modal">
        <div class="c-container">
          <a @click="closeReviewModal">X</a>
          <p>add a review</p>
          <form @submit.prevent>
            <textarea v-model.trim="review.content"></textarea>
            <button @click="addReview" :disabled="review.content == ''" class="button">add review</button>
          </form>
        </div>
      </div>
    </transition>

    <!-- venue modal -->
    <transition name="fade">
      <div v-if="showVenueModal" class="p-modal">
        <div class="p-container">
          <a @click="closeVenueModal" class="close">X</a>
          <div class="venue">
            <h5>{{ fullVenue.name }}</h5>
            <span>{{ fullVenue.createdOn | formatDate }}</span>
            <p>{{ fullVenue.description }}</p>
            <ul>
              <li>
                <a>reviews {{ fullVenue.reviews }}</a>
              </li>
              <li>
                <a>likes {{ fullVenue.likes }}</a>
              </li>
            </ul>
          </div>
          <div v-show="venueReviews.length" class="reviews">
            <div v-for="review in venueReviews" class="review" v-bind:key="review.id">
              <p>{{ review.userName }}</p>
              <span>{{ review.createdOn | formatDate }}</span>
              <p>{{ review.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../firebase.js");

import router from "../router";
export default {
  data() {
    return {
      venue: {
        description: ""
      },
      review: {
        venueId: "",
        venueName: "",
        userId: "",
        content: "",
        venueReviews: 0
      },
      errors: [],
      showReviewModal: false,
      showVenueModal: false,
      fullVenue: {},
      venueReviews: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "venues"])
  },
  methods: {
    // viewReviews(venue) {
    //   router.push({ name: "VenueDetails", params: { id: venue.key } });
    // },

    openReviewModal(venue) {
      this.review.venueId = venue.id;
      this.review.venueName = venue.name;
      this.review.userId = venue.userId;
      this.review.venueReviews = venue.reviews;
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.review.venueId = "";
      this.review.venueName = "";
      this.review.userId = "";
      this.review.content = "";
      this.showReviewModal = false;
    },
    addReview() {
      let venueId = this.review.venueId;
      let venueName = this.review.venueName;
      let venueReviews = this.review.venueReviews;

      fb.reviewsCollection
        .add({
          createdOn: new Date(),
          content: this.review.content,
          venueId: venueId,
          userId: this.currentUser.uid,
          userName: this.userProfile.name,
          venueName: venueName
        })
        // eslint-disable-next-line no-unused-vars
        .then(doc => {
          fb.venuesCollection
            .doc(venueId)
            .update({
              reviews: venueReviews + 1
            })
            .then(() => {
              this.closeReviewModal();
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    likeVenue(venueId, venueLikes) {
      let docId = `${this.currentUser.uid}_${venueId}`;

      fb.likesCollection
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          }

          fb.likesCollection
            .doc(docId)
            .set({
              venueId: venueId,
              userId: this.currentUser.uid
            })
            .then(() => {
              fb.venuesCollection.doc(venueId).update({
                likes: venueLikes + 1
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    viewVenue(venue) {
      fb.reviewsCollection
        .where("venueId", "==", venue.id)
        .get()
        .then(() => {
          router.push({ name: "VenueDetails", params: { id: venue.id } });
        })
        .catch(err => {
          console.log(err);
        });
    }
    // closeVenueModal() {
    //   this.venueReviews = [];
    //   this.showVenueModal = false;
    // }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    }
    // trimLength(val) {
    //   if (val.length < 200) {
    //     return val;
    //   }
    //   return `${val.substring(0, 200)}...`;
    // }
  }
};
</script>
