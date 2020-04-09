<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="venue-list">
          <h3>Reviews System</h3>
        </router-link>
        <ul class="inline">
          <li>
            <router-link to="/venue-list">Venue List</router-link>
          </li>
          <li>
            <router-link to="/add-venue">Add venue</router-link>
          </li>
          <li>
            <router-link to="/profile">Profile</router-link>
          </li>

          <li>
            <a @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
const fb = require("../firebase.js");

export default {
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
