<template>
  <NavBar />
  <router-view />
</template>

<script>
import NavBar from "./components/user/NavBar.vue";
export default {
  components: {
    NavBar,
  },
};
</script>
