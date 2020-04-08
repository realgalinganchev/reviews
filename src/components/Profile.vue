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
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />
        <label for="surname">Surname</label>
        <input v-model.trim="surname" type="text" :placeholder="userProfile.surname" id="surname" />
        <label for="phoneNumber">Phone number</label>
        <input
          v-model.trim="phoneNumber"
          type="text"
          :placeholder="userProfile.phoneNumber"
          id="phone-number"
        />
        <button @click="updateProfile" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      name: "",
      surname: "",
      phoneNumber: "",
      showSuccess: false
    };
  },
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch("updateProfile", {
        name: this.name !== "" ? this.name : this.userProfile.name,
        surname: this.surname !== "" ? this.surname : this.userProfile.surname,
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
  }
};
</script>
