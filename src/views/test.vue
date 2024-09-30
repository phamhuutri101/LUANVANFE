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
    <div
      v-on:click="foodDetail(items)"
      v-for="items in topRated"
      :key="items.id"
      class="col-4"
    >
      <div class="card" style="width: 18rem">
        <img class="card-img-top" :src="items.image" alt="Card image cap" />
        <div class="card-body">
          <h5 class="card-title">{{ items.name }}</h5>
          <p class="card-text">
            {{ items.description }}
          </p>
          <p class="card-text">
            <small class="text-muted">Rated {{ items.rating }}</small>
          </p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: "test",
  computed: {
    topRated() {
      return this.$store.state.topRated;
    },

    count() {
      return this.$store.state.count;
    },
  },
  methods: {
    increment() {
      this.$store.commit("increment");
    },

    foodDetail(items) {
      localStorage.setItem("details", JSON.stringify(items));
      this.$router.push({
        name: "test-food-detail",
        params: items,
      });
    },
  },
};
</script>

<style></style>
