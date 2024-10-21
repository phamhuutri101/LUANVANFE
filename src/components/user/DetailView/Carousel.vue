<template>
  <div class="col-5 rounded-1  p-3">
    <!-- Gallery Carousel -->
    <Carousel
      id="gallery"
      :items-to-show="1"
      :wrap-around="false"
      v-model="currentSlide"
    >
      <Slide v-for="(image, index) in images" :key="index">
        <img :src="image" class="img-detail-product" alt="Product Image" />
      </Slide>
    </Carousel>

    <!-- Thumbnails Carousel -->
    <Carousel
      id="thumbnails"
      :items-to-show="4"
      :wrap-around="true"
      v-model="currentSlide"
      ref="carousel"
    >
      <Slide v-for="(image, index) in images" :key="index">
        <img
          :src="image"
          class="img-thumbnail-product"
          alt="Thumbnail Image"
          @click="slideTo(index)"
        />
      </Slide>
    </Carousel>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
export default defineComponent({
  name: "DetailView",
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log("hình ảnh carousel", this.product);
  },
  data() {
    return {
      currentSlide: 0,
      // Array of images

      images: [],
    };
  },
  mounted() {
    if (this.product.LIST_FILE_ATTACHMENT) {
      this.images = this.product.LIST_FILE_ATTACHMENT.map(
        (file) => file.FILE_URL
      );
    }
  },
  watch: {
    product: {
      immediate: true,
      handler(newValue) {
        this.images = newValue.LIST_FILE_ATTACHMENT
          ? newValue.LIST_FILE_ATTACHMENT.map((file) => file.FILE_URL)
          : [];
      },
    },
  },
  methods: {
    slideTo(val) {
      this.currentSlide = val;
    },
  },
});
</script>

<style scoped>
.img-detail-product {
  width: 530px;
  height: 530px;
  object-fit: cover;
}

.img-thumbnail-product {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
}
</style>
