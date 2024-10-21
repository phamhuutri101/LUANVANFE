<template>
  <div class="container mt-5">
    <span class="text-title-category mt-5">Danh mục hàng</span>
    <div class="row">
      <div
        v-for="item in categories"
        :key="item._id"
        class="col-2 d-flex border-category flex-column align-items-center justify-content-center text-center category-title"
      >
        <img
          class="img-category"
          src="../../../../public/img/category/687f3967b7c2fe6a134a2c11894eea4b.png"
          alt=""
        />
        <span class="text-category d-block">{{ item.TYPE_PRODUCT }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import typeProductServices from "@/services/typeProduct.services";
export default {
  data() {
    return {
      categories: [],
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    async getCategory() {
      const response = await typeProductServices.getAll();
      this.categories = response.data;
    },
  },
};
</script>

<style scoped>
.text-category {
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
  text-decoration: none;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: 10px; /* Thêm khoảng cách giữa hình và tên */
}
.img-category {
  width: 85px;
  object-fit: cover;
  border-radius: 3px;
}
.category-title {
  min-height: 100px;
}
.text-title-category {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.border-category {
  background: #fff;
  border-radius: 20px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  width: 100px;
}
</style>
