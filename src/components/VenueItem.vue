<template>
  <div class="venue-item" >
    <p>
      {{venue.name}}
      <button @click="$emit('venue-details', venue.id)" class="btn">More..</button>
      {{venue.id}}
    </p>
  </div>
</template>

<script>
import firebase from '../firebase'
export default {
  name: "VenueItem",
  props: ["venue"],
  data() {
    return {
      venues: []
    };
  },
  created() {
    firebase.collection("venues")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            venue_id: doc.data().id,
            name: doc.data().name,
            description: doc.data().description,
            location: doc.data().location,
            rating: doc.data().rating,
            reviewsCount: doc.data().reviewsCount
          };
          this.venues.push(data);
        });
      });
  }
};
</script>


<style scoped>
/* .venue-item {
  background: lightgray;
  padding: 10px;
  border: 1px #ccc dotted;
}
.btn {
  display: inline-block;
  border: none;
  background: rgb(95, 18, 18);
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
} */
</style>