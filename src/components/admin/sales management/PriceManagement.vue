<template>
  <div class="add-product-form">
    <h2>Thêm sản phẩm</h2>
    <form @submit.prevent="submitForm">
      <div class="card mb-3">
        <div class="card-header">
          <h5>Thông tin cơ bản</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="productName" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              id="productName"
              v-model="product.name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Danh mục ngành hàng</label>
            <select
              class="form-select"
              id="category"
              v-model="product.category"
            >
              <option value="">Chọn danh mục</option>
              <option value="clothes">Quần áo</option>
              <!-- Thêm các option khác -->
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Ảnh sản phẩm</label>
            <div class="d-flex align-items-center">
              <button type="button" class="btn btn-outline-primary me-2">
                <i class="bi bi-plus"></i> Thêm ảnh
              </button>
              <small class="text-muted">Tối đa 9 ảnh</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Video</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="videoSource"
                id="uploadVideo"
                value="upload"
                v-model="videoSource"
              />
              <label class="form-check-label" for="uploadVideo">
                Tải lên video
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="videoSource"
                id="mediaCenter"
                value="mediaCenter"
                v-model="videoSource"
              />
              <label class="form-check-label" for="mediaCenter">
                Media Center
              </label>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary mt-2"
              v-if="videoSource === 'upload'"
            >
              <i class="bi bi-plus"></i> Thêm video
            </button>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Đặc tính sản phẩm</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="brand" class="form-label">Thương hiệu</label>
            <select class="form-select" id="brand" v-model="product.brand">
              <option value="">Chọn thương hiệu</option>
              <!-- Thêm các option -->
            </select>
          </div>
          <div class="mb-3">
            <label for="material" class="form-label">Chất liệu</label>
            <select
              class="form-select"
              id="material"
              v-model="product.material"
            >
              <option value="">Chọn chất liệu</option>
              <!-- Thêm các option -->
            </select>
          </div>
          <!-- Thêm các trường khác cho đặc tính sản phẩm -->
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Giá bán, Kho hàng và Biến thể</h5>
        </div>
        <div class="card-body">
          <button type="button" class="btn btn-outline-primary mb-3">
            <i class="bi bi-plus"></i> Thêm sản phẩm(0/2)
          </button>
          <div class="mb-3">
            <label for="price" class="form-label">Giá</label>
            <input
              type="number"
              class="form-control"
              id="price"
              v-model="product.price"
            />
          </div>
          <div class="mb-3">
            <label for="stock" class="form-label">Kho hàng</label>
            <input
              type="number"
              class="form-control"
              id="stock"
              v-model="product.stock"
            />
          </div>
          <div class="mb-3">
            <label for="sku" class="form-label">SKU</label>
            <input
              type="text"
              class="form-control"
              id="sku"
              v-model="product.sku"
            />
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Mô tả sản phẩm</h5>
        </div>
        <div class="card-body">
          <textarea
            class="form-control"
            rows="5"
            v-model="product.description"
          ></textarea>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Vận chuyển và Bảo hành</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="weight" class="form-label">Khối lượng</label>
            <div class="input-group">
              <input
                type="number"
                class="form-control"
                id="weight"
                v-model="product.weight"
              />
              <span class="input-group-text">kg</span>
            </div>
          </div>
          <!-- Thêm các trường khác cho vận chuyển và bảo hành -->
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-outline-secondary me-2">
          Lưu bản nháp
        </button>
        <button type="submit" class="btn btn-primary">Đăng bán</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddProductForm",
  data() {
    return {
      product: {
        name: "",
        category: "",
        brand: "",
        material: "",
        price: null,
        stock: null,
        sku: "",
        description: "",
        weight: null,
      },
      videoSource: "upload",
    };
  },
  methods: {
    submitForm() {
      // Xử lý gửi form
      console.log("Submitting product:", this.product);
      // Thêm logic để gửi dữ liệu đến API
    },
  },
};
</script>

<style scoped>
.add-product-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
