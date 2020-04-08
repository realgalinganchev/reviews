<template>
  <row>
    <div>
      <h2>
        Edit Venue
        <router-link to="/venue-list">Venue list</router-link>
      </h2>
      <div>
        <template slot="header">{{venue.name}}</template>
        <template slot="lead">
          Description: {{venue.description}}
          <br />
          Location: {{venue.location}}
          <br />
          <!-- Reviews made: {{venue.reviewsCount}} -->
          <br />
          Rating: {{venue.rating}}
          <br />
        </template>
        <hr class="my-4" />
        <btn class="edit-btn" variant="success" @click.stop="editVenue(key)">Edit</btn>
        <btn variant="danger" @click.stop="deleteVenue(key)">Delete</btn>
      </div>
      <div> v-if="!isHidden">
        <form @submit="onSubmit">
          <form-group id="descGroup" horizontal breakpoint="md">
            <form-textarea
              id="review"
              v-model="review.text"
              placeholder="How was your experience here?"
              :rows="4"
              :max-rows="10"
            >{{review.text}}</form-textarea>
          </form-group>
          <button type="submit" variant="primary">Submit review</button>
        </form>
      </div>
      <div> v-if="isHidden">
        <router-link to="/venue-list">Back to venues</router-link>
      </div>
      <div>
        <div v-for="(r, i) in reviews" class="reviews" :key="i">
          <div class="edit">
            <template v-if="!r.showEditField">
              <div>
                <p>{{r.text}} submitted by {{r.author}} on {{r.submittedAt}}</p>
                <div v-if="(authorEmail === r.author)">
                  <form @submit="deleteReview">
                    <button type="submit" variant="primary">Delete</button>
                  </form>
                  <button
                    class="show-desc"
                    
                    @click="toggleDescription(r, $event)"
                  >Edit</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div>
                <form @submit="editReview">
                  <form-group id="descGroup" horizontal breakpoint="md">
                    <form-textarea
                      id="edit-review"
                      v-model="review.editedText"
                      placeholder="You have changed your mind?"
                      :rows="4"
                      :max-rows="10"
                    >{{review.text}}</form-textarea>
                  </form-group>
                  <button
                    class="show-desc"
                    @click="toggleDescription(r)"
                    
                  >Save changes</button>
                  <form @submit="deleteReview">
                    <button type="submit" variant="primary">Delete</button>
                  </form>
                </form>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </row>
</template>

<script>
const fb = require('../firebase.js')
import router from "../router";

export default {
  name: "VenueDetails",
  data() {
    return {
      key: "",
      rKey: "",
      venue: {},
      ref: fb.firestore().collection("venues"),
      usersRef: fb.firestore().collection("users"),
      review: {},
      // eslint-disable-next-line no-undef
      reviews: [],
      isHidden: false,
      alreadyReviewed: [],
      authorEmail: fb.auth().currentUser.email,
      isDeleted: Boolean,
      currEmail: fb.auth().currentUser.email
      
    };
  },
  beforeCreate() {
    this.$emit("onAuth", fb.auth().currentUser !== null);
  },
  created() {
    const ref = fb
      .firestore()
      .collection("venues")
      .doc(this.$route.params.id);
    ref.get().then(doc => {
      if (doc.exists) {
        this.key = doc.id;
        this.venue = doc.data();
        this.reviews = doc.data().reviews.reverse();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    editVenue(id) {
      router.push({
        name: "EditVenue",
        params: { id: id }
      });
    },
    deleteVenue(id) {
      this.ref
        .doc(id)
        .delete()
        .then(() => {
          router.push({
            name: "VenueList"
          });
        })
        .catch(error => {
          alert("Error removing document: ", error);
        });
    },
    // editReview(id) {
    //   router.push({
    //     name: "EditVenue",
    //     params: { id: id }
    //   });
    // },
    onSubmit(evt) {
      evt.preventDefault();
      const currentUser = this.usersRef.doc(fb.auth().currentUser.uid);
      currentUser.get().then(doc => {
        if (!doc.data().alreadyReviewed.includes(this.$route.params.id)) {
          this.review.submittedAt = new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, "/");
          this.review.author = fb.auth().currentUser.email;
          this.review.venueId = this.$route.params.id;
          this.review.showEditField = false;
          this.review.editedText = "";
          this.reviews.push(this.review);
          const currentVenue = this.ref.doc(this.$route.params.id);
          currentVenue.update({
            reviews: fb.firestore.FieldValue.arrayUnion(this.review),
            reviewsCount: fb.firestore.FieldValue.increment(1)
          });
          currentUser.update({
            reviewsMade: fb.firestore.FieldValue.arrayUnion(this.review),
            alreadyReviewed: fb.firestore.FieldValue.arrayUnion(
              this.$route.params.id
            )
          });
        } else {
          alert("You have already submitted a review for this venue!");
        }
      });

      //this.reviews = this.reviews.reverse();
      this.isHidden = true;
    },
    deleteReview(evt) {
      evt.preventDefault();

      const toBeDeleted = this.reviews.filter(e => e.author === this.currEmail);
      const currentVenue = this.ref.doc(this.$route.params.id);
      currentVenue.update({
        reviews: fb.firestore.FieldValue.arrayRemove(...toBeDeleted)
        // reviewsCount: reviewsCount- 1,
      });
      this.reviews = this.reviews.filter(e => e.author !== this.currEmail);
    },

    toggleDescription(r) {

      r.showEditField = !r.showEditField;
    },
    editReview(evt) {
      evt.preventDefault();
    }
  }
};
</script>

<style>
.jumbotron {
  padding: 2rem;
  border-style: groove;
  border-color: black;
}
.edit-btn {
  margin-right: 20px;
  width: 70px;
}
</style>
