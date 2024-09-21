<template>
  <div class="Background-HomeView">
    <CarouselHome />
    <Category />
    <ProductHome />
  </div>
</template>

<script>
import CarouselHome from "@/components/user/HomeView/Carousel.vue";
import Category from "@/components/user/HomeView/Category.vue";
import ProductHome from "@/components/user/HomeView/ProductHome.vue";
export default {
  components: { CarouselHome, Category, ProductHome },
};
</script>

<style scoped>
.Background-HomeView {
  background-color: #f5f5f5;
}
</style>
