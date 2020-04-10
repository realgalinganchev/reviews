
<template>
  <footer>Night Life Sofia - Reviews System {{getYear}}   ®</footer>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    getYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style>
footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #9e5e6f;
  color: white;
  text-align:center;
}
</style>
