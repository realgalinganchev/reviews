<template>
  <div id="venue-list">
    <section>
      <div class="col2">
        <div>
          <transition name="fade">
            <p v-if="showFailureVenue" class="failure">You have not created this venue!</p>
          </transition>
          <h2>Venue List</h2>
        </div>
        <div v-if="venues.length">
          <div v-for="venue in venues" class="venue" v-bind:key="venue.id">
            <h5>{{ venue.name }}</h5>
            <!-- <span>{{ venue.createdOn | formatDate }}</span> -->
            <p>{{ venue.description }}</p>
            <ul>
              <li>
                <a @click="viewVenue(venue)">View all {{ venue.reviews }} reviews ⭐</a>
              </li>
              <li>
                <a @click="openReviewModal(venue)">Add a review ➕</a>
              </li>
              <li>
                <a @click="likeVenue(venue.id, venue.likes)">Likes {{ venue.likes }} 👍</a>
              </li>

              <li>
                <a @click="deleteVenue(venue)">Delete ❌</a>
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
          <p>How was your experience here?</p>
          <form @submit.prevent>
            <textarea v-model.trim="review.content"></textarea>
            <button @click="addReview" :disabled="review.content == ''" class="button">Add review</button>
            <transition name="fade">
              <p v-if="showFailureReview" class="failure">You have already reviewed this venue!</p>
            </transition>
          </form>
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
      fullVenue: {},
      venueReviews: [],
      showFailureReview: false,
      showFailureVenue: false
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "venues"])
  },
  methods: {
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
      let docId = `${this.currentUser.uid}_${venueId}`;

      fb.reviewsCollection
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.showFailureReview = true;

            setTimeout(() => {
              this.showFailureReview = false;
            }, 4000);
            return;
          } else {
            fb.reviewsCollection
              .doc(docId)
              .set({
                createdOn: new Date(),
                content: this.review.content,
                venueId: venueId,
                userId: this.currentUser.uid,
                userName: this.userProfile.name,
                venueName: venueName
              })
              .then(() => {
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
          }
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
    },
    deleteVenue(venue) {
      fb.venuesCollection
        .doc(venue.id)
        .get()
        .then(doc => {
          if (doc.data().userId !== this.currentUser.uid) {
            this.showFailureVenue = true;

            setTimeout(() => {
              this.showFailureVenue = false;
            }, 4000);
            return;
          } else {
            let docId = `${this.currentUser.uid}_${venue.id}`;
            fb.venuesCollection.doc(venue.id).delete();
            fb.likesCollection.doc(docId).delete();
            fb.reviewsCollection.doc(docId).delete();
          }
        });
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    }
  }
};
</script>
