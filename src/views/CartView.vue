<template>
  <Header />
  <Cart />
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import Cart from "@/components/user/cartView/Cart.vue";
export default {
  name: "CartView",
  components: {
    Header,
    Footer,
    Cart,
  },
};
</script>

<style scoped></style>
