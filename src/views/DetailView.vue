<template>
  <Header />
  <div class="container background-component pt-3">
    <div class="row">
      <Carousel :product="product" />
      <InfoProduct :product="product" />
      <Rating :product="product" />
      <relatedProducts :product="product" />
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import Carousel from "@/components/user/DetailView/Carousel.vue";
import InfoProduct from "@/components/user/DetailView/InfoProduct.vue";
import productServices from "@/services/product.services";
import Rating from "@/components/user/DetailView/Rating.vue";
import relatedProducts from "@/components/user/DetailView/relatedProducts.vue";
export default {
  components: {
    Carousel,
    InfoProduct,
    Header,
    Footer,
    Rating,
    relatedProducts,
  },
  data() {
    return {
      product: {},
    };
  },
  async created() {
    const productId = this.$route.params.id;
    await this.getProductById(productId);
    console.log("sản phẩm", this.product);
  },
  methods: {
    async getProductById(productId) {
      try {
        const response = await productServices.getById(productId);
        if (response && response.data) {
          this.product = response.data;
        } else {
          console.log("No product data received");
        }
      } catch (error) {
        console.error("lỗi khi lấy sản phẩm", error);
      }
    },
  },
};
</script>

<style scoped></style>
