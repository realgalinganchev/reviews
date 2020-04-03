<template>
  <nav>
    <ul>
      <li>
        <router-link to="/venue-list">Home</router-link>
      </li>
      <li v-if="!isAuth">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="!isAuth">
        <router-link to="/sign-up">Sign Up</router-link>
      </li>
      <li v-if="isAuth">
        <a @click="logout" class="logout">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import firebase from "../firebase";

export default {
  props: {
    isAuth: Boolean
  },
  name: "Header",
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
      this.$emit("onAuth", false);
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color:  #9e5e6f;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li a:hover {
  background-color: #111;
}

.logout {
  cursor: pointer;
}
</style>
