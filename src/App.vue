<template>
  <NavBar />
  <LoginModal />
  <RegsiterModal />
  <router-view />
</template>

<script>
import NavBar from "./components/user/NavBar.vue";
import RegsiterModal from "./components/user/RegsiterModal.vue";
import LoginModal from "./components/user/LoginModal.vue";
export default {
  components: {
    RegsiterModal,
    LoginModal,
    NavBar,
  },
};
</script>
