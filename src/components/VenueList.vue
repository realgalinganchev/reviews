<template>
  <b-row>
    <b-col cols="12">
      <h2>Venue List</h2>
      <b-table striped hover :items="venues" :fields="fields">
        <template slot="cell(actions)" scope="row">
          <b-btn size="sm" @click.stop="viewReviews(row.item)">View Reviews</b-btn>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import firebase from "../firebase";
// import VenueItem from "./VenueItem";
import router from "../router";

export default {
  name: "VenueList",

  // components: {
  //   VenueItem
  // },
  // props: ["venues"],
  data() {
    return {
      fields: [
        {
          name: { label: "Name", class: "text-left" }
        },
        {
          actions: { label: "Action", class: "text-center" }
        },
        {
          reviewsCount: { label: "Reviewed", class: "text-center" }
        },
        {
          rating: { label: "Rating", class: "text-center  " }
        },
                {
          location: { label: "Location", class: "text-center  " }
        }
      ],
      venues: [],
      errors: [],
      ref: firebase.firestore().collection("venues")
    };
  },
  created() {
    this.ref.onSnapshot(querySnapshot => {
      this.venues = [];
      querySnapshot.forEach(doc => {
        this.venues.push({
          key: doc.id,
          name: doc.data().name,
          reviewsCount: doc.data().reviewsCount,
          rating : doc.data().rating,
          location : doc.data().location,
        });
      });
    });
  },
  methods: {
    viewReviews(venue) {
      router.push({ name: "VenueDetails", params: { id: venue.key } });
    }
  }
};
</script>

<style>
.table {
  width: 96%;
  margin: 0 auto;
}
</style>