<template>
  <button type="button" class="mt-5 btn btn-primary position-relative">
    <i class="fa-solid fa-cart-shopping"></i>
    <span
      class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
    >
      {{ count }}
    </span>
  </button>
  <div class="row">
    <div class="col-6">
      <img :src="details.image" alt="" />
    </div>
    <div class="col-6">
      <p>Name:{{ details.name }}</p>
      <p>Price: {{ details.price }}</p>
      <p>description: {{ details.description }}</p>
      <p>Rating {{ details.rating }}</p>
      <button v-on:click="addToCart" class="btn btn-primary">
        Add to Cart
      </button>
      <button class="btn btn-success" @click="gotoCart">Cart</button>
      <button class="btn btn-danger" v-on:click="removeItem">RemoveItem</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "test-food-detail",
  data() {
    return {
      details: this.$route.params,
    };
  },
  created() {
    if (this.$route.params.id !== undefined) {
      localStorage.setItem("details", JSON.stringify(this.$route.params));
    }
  },
  mounted() {
    this.details = JSON.parse(localStorage.getItem("details"));
  },
  computed: {
    count() {
      const count = this.$store.state.cartItems;
      return count.length;
    },
  },
  methods: {
    addToCart() {
      this.$store.dispatch("addToCart", this.details);
    },
    removeItem() {
      this.$store.dispatch("removeItem", this.details);
    },
    gotoCart() {
      this.$router.push("/cart");
    },
  },
};
</script>

<style></style>
