<template>
  <div id="app">
    <Header @onAuth="isAuth = $event" :isAuth="isAuth" />
    <router-view @onAuth="isAuth = $event" :isAuth="isAuth"></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import firebase from "./firebase";

export default {
  name: "app",
  data: function() {
    return {
      isAuth: firebase.auth().currentUser !== null
    }
  },
  components: {
    Header,
    Footer
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #9e5e6f;
}
</style>