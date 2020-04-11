<template>
  <section id="profile">
    <div class="col1">
      <h3>Profile</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Name</label>
        <input
          v-model.trim="name"
          type="text"
          :placeholder="userProfile.name"
          id="name"
          v-model.lazy="$v.name.$model"
        />
        <p class="error" v-if="!$v.name.required"></p>
        <p
          class="error"
          v-if="!$v.name.minLength"
        >Field must have at least {{ $v.name.$params.minLength.min }} characters.</p>

        <label for="surname">Surname</label>
        <input
          v-model.trim="surname"
          type="text"
          :placeholder="userProfile.surname"
          id="surname"
          v-model.lazy="$v.surname.$model"
        />
        <p class="error" v-if="!$v.surname.required"></p>
        <p
          class="error"
          v-if="!$v.name.minLength"
        >Field must have at least {{ $v.surname.$params.minLength.min }} characters.</p>

        <label for="phoneNumber">Phone number</label>
        <input
          v-model.trim="phoneNumber"
          type="text"
          :placeholder="userProfile.phoneNumber"
          id="phone-number"
          v-model.lazy="$v.phoneNumber.$model"
        />
        <p class="error" v-if="!$v.phoneNumber.required"></p>
        <p
          class="error"
          v-if="!$v.name.minLength"
        >Field must have at least {{ $v.phoneNumber.$params.minLength.min }} characters.</p>
        <button @click="updateProfile" class="button">Update Profile</button>
        <p v-if="errors" class="error">
          The form above has errors,
          <br />please get your act together and resubmit
        </p>
        <p v-else-if="uiState === 'submit clicked'" class="error">
          The form above is empty,
          <br />cmon y'all you can't submit an empty form!
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      surname: "",
      phoneNumber: "",
      showSuccess: false,
      uiState: "submit not clicked",
      errors: false,
      empty: true
    };
  },
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    updateProfile() {
      this.errors = this.$v.$anyError;
      this.uiState = "submit clicked";
      if (this.errors === false) {
        this.$store.dispatch("updateProfile", {
          name: this.name !== "" ? this.name : this.userProfile.name,
          surname:
            this.surname !== "" ? this.surname : this.userProfile.surname,
          phoneNumber:
            this.phoneNumber !== ""
              ? this.phoneNumber
              : this.userProfile.phoneNumber
        });

        this.name = "";
        this.surname = "";
        this.phoneNumber = "";

        this.showSuccess = true;

        setTimeout(() => {
          this.showSuccess = false;
        }, 2000);
      }
      this.uiState = "form submitted";
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(2)
    },
    surname: {
      required,
      minLength: minLength(2)
    },
    phoneNumber: {
      required,
      minLength: minLength(6)
    }
  }
};
</script>
