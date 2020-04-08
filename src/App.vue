<template>
  <div id="app">
    <Header v-if="currentUser"></Header>
    <router-view />
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "./shared/Header.vue";
import Footer from "./shared/Footer"

export default {
  components: { Header , Footer},
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>
