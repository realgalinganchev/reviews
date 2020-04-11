<template>
  <section id="add-venue">
    <div class="col1">
      <div class="profile">
        <h3>Add venue</h3>
        <div class="create-venue">
          <form @submit.prevent>
            <label for="name">Name</label>
            <input
              v-model.trim="venue.name"
              type="text"
              placeholder="required field"
              v-model.lazy="$v.venue.name.$model"
            />
            <p class="error" v-if="!$v.venue.name.required"></p>
            <p
              class="error"
              v-if="!$v.venue.name.minLength"
            >Field must have at least {{ $v.venue.name.$params.minLength.min }} characters.</p>
            <label for="name">Description</label>
            <input
              v-model.trim="venue.description"
              type="text"
              placeholder="required field"
              v-model.lazy="$v.venue.description.$model"
            />
            <p class="error" v-if="!$v.venue.description.required"></p>
            <p
              class="error"
              v-if="!$v.venue.description.minLength"
            >Field must have at least {{ $v.venue.description.$params.minLength.min }} characters.</p>
            <label for="name">Location</label>
            <input
              v-model.trim="venue.location"
              type="text"
              placeholder="required field"
              v-model.lazy="$v.venue.location.$model"
            />
            <p class="error" v-if="!$v.venue.location.required"></p>
            <p
              class="error"
              v-if="!$v.venue.location.minLength"
            >Field must have at least {{ $v.venue.location.$params.minLength.min }} characters.</p>
            <button
              @click="createVenue"
              :disabled="venue.name == '' || venue.description == '' || venue.location == ''"
              class="button"
            >Submit</button>
            <p v-if="errors" class="error">
              The form above has errors,
              <br />please get your act together and resubmit!
            </p>
            <p v-else-if="uiState === 'submit clicked'" class="error">
              The form above is empty,
              <br />cmon y'all you can't submit an empty form!
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebase.js");
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "AddVenue",
  data() {
    return {
      venue: {
        name: "",
        description: "",
        location: ""
      },
      uiState: "submit not clicked",
      errors: false,
      empty: true
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "venues"])
  },
  methods: {
    createVenue() {
      this.errors = this.$v.venue.$anyError;
      this.uiState = "submit clicked";
      if (this.errors === false) {
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
          .then(() => {
            this.venue.description = "";
          })
          .catch(err => {
            console.log(err);
          });
        this.$router.push("/venue-list");
      }
      this.uiState = "form submitted";
    }
  },
  validations: {
    venue: {
      name: {
        required,
        minLength: minLength(3)
      },
      description: {
        required,
        minLength: minLength(30)
      },
      location: {
        required,
        minLength: minLength(10)
      }
    }
  }
};
</script>

