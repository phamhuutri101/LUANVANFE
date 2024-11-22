<template>
  <router-view />
</template>

<script>
export default {
  components: {},
  mounted() {
    // Đồng bộ số lượng sản phẩm trong giỏ hàng từ server
    this.$store.dispatch("fetchCartItemCount");
  },
};
</script>
<style>
.background-component {
  background: #fff;
}
</style>
