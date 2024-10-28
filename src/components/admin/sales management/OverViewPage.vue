<template>
  <div class="container">
    <div class="row">
      <div class="col-3">
        <div
          class="box-over-view-product d-flex align-items-center justify-content-center"
        >
          sản phẩm trong shop {{ products.length }}
        </div>
      </div>
      <div class="col-3">
        <div
          class="box-over-view-type d-flex align-items-center justify-content-center"
        >
          Danh mục sản phẩm {{ category.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productServices from "@/services/product.services";
import categoryServices from "@/services/category.services";
export default {
  name: "ProductOverview",
  data() {
    return {
      products: [],
      category: [],
    };
  },
  created() {
    this.getAllProduct();
    this.getAllCategory();
  },
  methods: {
    async getAllProduct() {
      const response = await productServices.getAllProduct();
      if (response && response.data) {
        this.products = response.data;
      }
    },
    async getAllCategory() {
      const response = await categoryServices.getAll();
      if (response && response.data) {
        this.category = response.data;
      }
    },
  },
};
</script>

<style scoped>
.box-over-view-product {
  background-color: #3899ff;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 10px;
  margin-bottom: 10px;
  width: 270px;
  height: 100px;
}
.box-over-view-type {
  background-color: #e55353;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 10px;
  margin-bottom: 10px;
  width: 270px;
  height: 100px;
}
.container {
  height: 100vh;
}
</style>
