<template>
  <row>
    <div>
      <!-- <h2>
        Edit Review
        <router-link :to="{ name: 'VenueDetails', params: { id: key } }">(Back to venue)</router-link>
      </h2> -->
      <div>
        <form @submit="onSubmit">
          <form-group id="nameGroup"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Review">
            <form-input id="name" v-model.trim="review.text"></form-input>
          </form-group>
          <button type="submit" variant="primary">Update</button>
        </form>
      </div>
    </div>
  </row>
</template>

<script>
const fb = require('../firebase.js')
import router from "../router";

export default {
  name: 'EditReview',
  data () {
    return {
      key: this.$route.params.id,
      review: {}
    }
  },
  created () {
    const ref = fb.firestore().collection('venues').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.review = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
    beforeCreate() {
    this.$emit("onAuth", fb.auth().currentUser !== null);
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const updateRef = fb.firestore().collection('venues').doc(this.$route.params.id);
      // eslint-disable-next-line no-unused-vars
      updateRef.set(this.venue).then((docRef) => {
        this.key = ''
        this.review.text = ''
        router.push({ name: 'VenueDetails', params: { id: this.$route.params.id }})
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>

    editReview(id) {
      router.push({
        name: "EditVenue",
        params: { id: id }
      });
    },
    deleteReview() {
      const toBeDeleted = this.reviews.filter(e => e.author === fb.auth().currentUser.email);
      // console.log(JSON.stringify(test));
      const currentVenue = this.ref.doc(this.$route.params.id);
      currentVenue.update({
        reviews: fb.firestore.FieldValue.arrayRemove(...toBeDeleted)
        // reviewsCount: reviewsCount- 1,
      });
      this.key += 1;
    },