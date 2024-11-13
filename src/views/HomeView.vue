<template>
  <Header />
  <div class="Background-HomeView">
    <CarouselHome />

    <Category />
    <ProductHome />
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import CarouselHome from "@/components/user/HomeView/Carousel.vue";
import Category from "@/components/user/HomeView/Category.vue";
import ProductHome from "@/components/user/HomeView/ProductHome.vue";

export default {
  components: { CarouselHome, Category, ProductHome, Header, Footer },
  data() {},

  methods: {},
};
</script>

<style scoped>
.Background-HomeView {
  background-color: #f5f5f5;
}
</style>
