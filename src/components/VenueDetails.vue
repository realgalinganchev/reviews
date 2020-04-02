<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Venue
        <b-link href="#/">(Venue List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">{{venue.name}}</template>
        <template slot="lead">
          Description: {{venue.description}}
          <br />
          Location: {{venue.location}}
          <br />
          Reviews made: {{venue.reviewsCount}}
          <br />
          Rating: {{venue.rating}}
          <br />
        </template>
        <hr class="my-4" />
        <b-btn class="edit-btn" variant="success" @click.stop="editVenue(key)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deleteVenue(key)">Delete</b-btn>
      </b-jumbotron>
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group id="descGroup" horizontal breakpoint="md">
            <b-form-textarea
              id="review"
              v-model="review.text"
              placeholder="How was your experience here?"
              :rows="4"
              :max-rows="10"
            >{{review.text}}</b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit review</b-button>
        </b-form>
      </b-jumbotron>
      <b-jumbotron>
        <div v-for="(r, i) in reviews" class="reviews" :key="i">
          <!-- <a>
            <img :src="g.imgSrc" :alt="g.imgAlt" />
          </a>-->
          <div>
            <template v-if="r.text">
              <p>{{r.text}}</p>
              <!-- <button
                class="show-desc"
                :class="createBinding(i)"
                @click="toggleDescription(g, $event)"
              >Show Less</button>-->
            </template>
            <template v-else>
              <!-- <button
                class="show-desc"
                @click="toggleDescription(g)"
                :class="createBinding(g)"
              >Show More</button>-->
            </template>
          </div>
        </div>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import firebase from "../firebase";
import router from "../router";

export default {
  name: "VenueDetails",
  data() {
    return {
      key: "",
      venue: {},
      ref: firebase.firestore().collection("venues"),
      review: {},
      // eslint-disable-next-line no-undef
      reviews: []
    };
  },
  created() {
    const ref = firebase
      .firestore()
      .collection("venues")
      .doc(this.$route.params.id);
    ref.get().then(doc => {
      if (doc.exists) {
        this.key = doc.id;
        this.venue = doc.data();
        this.reviews = doc.data().reviews;
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
    onSubmit(evt) {
      evt.preventDefault();

      this.reviews.push(this.review);
      const currentVenue = this.ref.doc(this.$route.params.id);
      currentVenue.update({
        reviews: firebase.firestore.FieldValue.arrayUnion(this.review)
      });
    }
  },
  computed: {
    // getReviewsArray() {
    //   let reviews = this.venue.reviews;
    //   const reviewsTexts = [];
    //   console.log(reviews)
    //   if (reviews !== undefined) {
    //     let slicedReviews = reviews.slice(0, reviews.length - 1);
    //     slicedReviews.forEach(e => {
    //       reviewsTexts.push(e.text);
    //     });
    //   }
    //   return reviewsTexts;
    // }
  }
};
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
  addVenueToFavourites(item) {
    const venueToBeAdded = this.db.collection('venues').doc(item.payload.doc.id);
    venueToBeAdded.get().toPromise().then(documentSnapshot => {
      const data = documentSnapshot.data();
      const currentUserRef = this.db.collection('users').doc(this.customersUid);
      currentUserRef.update({
        favourites: firebase.firestore.FieldValue.arrayUnion(data)
      });
    });
  }