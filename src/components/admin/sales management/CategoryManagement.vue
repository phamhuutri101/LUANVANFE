<template>
  <div>
    <h2>Quản lý sản phẩm</h2>
    <button class="btn btn-primary mb-3" @click="showAddModal = true">
      Thêm sản phẩm
    </button>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>
            <button
              class="btn btn-sm btn-info me-2"
              @click="editProduct(product)"
            >
              Sửa
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteProduct(product.id)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for adding/editing product -->
    <div class="modal" tabindex="-1" v-show="showAddModal || showEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showAddModal ? "Thêm sản phẩm" : "Sửa sản phẩm" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="productName" class="form-label">Tên sản phẩm</label>
                <input
                  type="text"
                  class="form-control"
                  id="productName"
                  v-model="currentProduct.name"
                />
              </div>
              <div class="mb-3">
                <label for="productPrice" class="form-label">Giá</label>
                <input
                  type="number"
                  class="form-control"
                  id="productPrice"
                  v-model="currentProduct.price"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
            <button type="button" class="btn btn-primary" @click="saveProduct">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductManagement",
  data() {
    return {
      products: [
        { id: 1, name: "Sản phẩm 1", price: 100000 },
        { id: 2, name: "Sản phẩm 2", price: 200000 },
      ],
      showAddModal: false,
      showEditModal: false,
      currentProduct: { name: "", price: 0 },
    };
  },
  methods: {
    editProduct(product) {
      this.currentProduct = { ...product };
      this.showEditModal = true;
    },
    deleteProduct(id) {
      this.products = this.products.filter((p) => p.id !== id);
    },
    saveProduct() {
      if (this.showAddModal) {
        this.products.push({
          id: this.products.length + 1,
          ...this.currentProduct,
        });
      } else {
        const index = this.products.findIndex(
          (p) => p.id === this.currentProduct.id
        );
        this.products[index] = { ...this.currentProduct };
      }
      this.closeModal();
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.currentProduct = { name: "", price: 0 };
    },
  },
};
</script>
