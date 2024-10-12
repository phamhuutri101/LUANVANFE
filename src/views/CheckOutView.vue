<template>
  <Header />
  <div class="container">
    <checkOut />
  </div>
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import checkOut from "@/components/user/checkOut/checkOut.vue";
export default {
  components: { Header, Footer, checkOut },
};
</script>

<style scoped></style>
