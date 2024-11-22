<template>
  <div class="container">
    <!-- modal sửa sp -->
    <div
      class="modal fade"
      id="updateProductModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Sửa sản phẩm
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="row">
                <!-- Cột trái -->
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="name" class="form-label">Tên sản phẩm:</label>
                    <input
                      type="text"
                      id="name"
                      v-model="productDetail.NAME_PRODUCT"
                      class="form-control"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="short_desc" class="form-label"
                      >Mô tả ngắn:</label
                    >
                    <textarea
                      id="desc_product"
                      v-model="productDetail.SHORT_DESC"
                      class="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="desc_product" class="form-label"
                      >Mô tả chi tiết:</label
                    >
                    <textarea
                      id="desc_product"
                      v-model="productDetail.DESC_PRODUCT"
                      class="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <!-- <div class="mb-3">
                    <label for="category_id" class="form-label"
                      >Danh mục:</label
                    >
                    <select
                      id="category_id"
                      v-model="product.category_id"
                      class="form-select"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div> -->
                </div>

                <!-- Cột phải -->
                <div class="col-md-6">
                  <!-- Metadata -->
                  <fieldset class="mb-3">
                    <legend>
                      Thuộc tính sản phẩm (Ngăn cách bởi dấu phẩy ","):
                    </legend>
                    <div
                      v-for="(
                        item, index
                      ) in productDetail.LIST_PRODUCT_METADATA"
                      :key="index"
                      class="row mb-2"
                    >
                      <div class="col-5">
                        <input
                          type="text"
                          v-model="item.KEY"
                          class="form-control"
                          placeholder="Key"
                          required
                        />
                      </div>
                      <div class="col-5">
                        <input
                          type="text"
                          v-model="item.VALUE"
                          class="form-control"
                          placeholder="Value"
                          required
                        />
                      </div>
                    </div>
                  </fieldset>

                  <!-- Ảnh mặc định -->
                  <fieldset class="mb-3">
                    <legend>Ảnh mặc định:</legend>
                    <div class="image-container">
                      <div
                        class="image-wrapper"
                        v-for="(
                          attachment, index
                        ) in productDetail.LIST_FILE_ATTACHMENT_DEFAULT"
                        :key="index"
                      >
                        <img
                          :src="attachment.FILE_URL"
                          alt="Ảnh sản phẩm"
                          class="img-thumbnail"
                        />
                        <button
                          class="delete-btn"
                          @click="removeDefaultImage(attachment._id)"
                          type="button"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <!-- Nút thêm ảnh -->
                      <label class="add-image-btn">
                        <input
                          type="file"
                          class="file-input"
                          accept="image/*"
                          @change="uploadFileProductDefault($event)"
                        />
                        <i class="fas fa-plus"></i>
                      </label>
                    </div>
                  </fieldset>

                  <!-- Ảnh sản phẩm -->
                  <fieldset class="mb-3">
                    <legend>Ảnh sản phẩm</legend>
                    <div class="image-container">
                      <div
                        class="image-wrapper"
                        v-for="(
                          attachment, index
                        ) in productDetail.LIST_FILE_ATTACHMENT"
                        :key="index"
                      >
                        <img
                          :src="attachment.FILE_URL"
                          alt="Ảnh sản phẩm"
                          class="img-thumbnail"
                        />
                        <button
                          class="delete-btn"
                          @click="removeImage(attachment._id)"
                          type="button"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <!-- Nút thêm ảnh -->
                      <label class="add-image-btn">
                        <input
                          type="file"
                          class="file-input"
                          @change="uploadFileProduct($event)"
                          accept="image/*"
                        />
                        <i class="fas fa-plus"></i>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>

              <!-- Nút lưu -->
              <div class="text-end">
                <button
                  type="submit"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- modal sửa sp -->
    <div class="product">
      <div class="header pb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4>Quản lý sản phẩm</h4>
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Tìm kiếm sản phẩm..."
              class="search-input"
            />
          </div>
        </div>
      </div>

      <div class="top-product">
        <div class="row">
          <div class="col-3 text-center">Thông tin sản phẩm</div>
          <div class="col-3 text-center">Giá</div>
          <div class="col-2 text-center">Kho</div>
          <div class="col-2 text-center">Danh mục</div>
          <div class="col-2 text-center">Thao tác</div>
        </div>
      </div>
      <div class="bottom-product">
        <div
          class="row border-bottom py-3"
          v-for="item in filteredProducts"
          :key="item._id"
        >
          <div class="col-3 text-start">
            <img
              v-if="
                item.LIST_FILE_ATTACHMENT_DEFAULT[0] &&
                item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL
              "
              :src="item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
              alt=""
              class="img-product"
            />
            <img
              v-else
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCgo52p_E8Rkv7gnTxyVLKSnyScgLohtSBYQ&s"
              alt=""
              class="img-product"
            />

            <span class="px-2">{{ truncateName(item.NAME_PRODUCT) }}</span>
          </div>
          <div class="col-3 text-center">
            {{ item.Price }}
          </div>
          <div class="col-2 text-center">
            {{ item.NUMBER_INVENTORY_PRODUCT }}
          </div>
          <div class="col-2 text-center">
            {{ item.CATEGORY_NAME }}
          </div>
          <div class="col-2 text-center">
            <i
              class="fa-solid fa-pen-to-square"
              data-bs-toggle="modal"
              data-bs-target="#updateProductModal"
              @click="getProductById(item._id)"
            ></i>
            |
            <i class="fa-solid fa-trash" @click="removeProduct(item._id)"></i>
          </div>
        </div>
      </div>
      <VPagination
        v-model="page"
        :pages="currentMaxPage"
        :range-size="5"
        active-color="#DCEDFF"
        @update:modelValue="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import categoryServices from "@/services/category.services";
import PriceService from "@/services/price.services";
import productServices from "@/services/product.services";
import uploadServices from "@/services/upload.services";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import Swal from "sweetalert2";

export default {
  components: {
    VPagination,
  },
  data() {
    return {
      searchQuery: "",
      productDetail: {},
      prices: [],
      products: [],
      page: 1,
      limit: 10,
      currentMaxPage: 1, // Số trang tối đa đã biết
      hasMorePages: true, // Flag kiểm tra còn trang tiếp không
      metadata: [
        {
          key: "",
          rawValue: "", // lưu giá trị gốc trước khi tách thành mảng
        },
      ],
      fileProduct: {
        file_url: "",
        file_type: "",
      },
      fileProductDefault: {
        file_url: "",
        file_type: "",
      },
    };
  },

  created() {
    this.getProduct();
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(
        (product) =>
          product.NAME_PRODUCT?.toLowerCase().includes(query) ||
          product.CATEGORY_NAME?.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async getProduct() {
      try {
        const response = await productServices.getProductShop(
          this.page,
          this.limit
        );
        if (response && response.data) {
          this.products = response.data;
          // Nếu số sản phẩm trả về ít hơn limit, đây là trang cuối
          if (this.products.length < this.limit) {
            this.hasMorePages = false;
            this.currentMaxPage = this.page;
          }
          // Nếu đang ở trang cuối cùng đã biết và vẫn có đủ số sản phẩm
          else if (this.page >= this.currentMaxPage) {
            this.hasMorePages = true;
            this.currentMaxPage = this.page + 1;
          }
          for (const item of this.products) {
            const priceRange = await PriceService.getPriceRange(item._id);
            const categoryId = await categoryServices.getById(item.CATEGORY_ID);
            if (priceRange && priceRange.data) {
              this.priceRange = priceRange.data;
              this.priceMin = Math.min(
                ...this.priceRange.map((priceMin) => priceMin.PRICE_NUMBER)
              );
              this.priceMax = Math.max(
                ...this.priceRange.map((price) => price.PRICE_NUMBER)
              );
              item.Price = `${this.priceMin.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })} - ${this.priceMax.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}`;
            }
            if (categoryId && categoryId.data && categoryId.data.length > 0) {
              item.CATEGORY_NAME =
                categoryId.data[0].CATEGORY_NAME || "chưa thêm danh mục";
            } else {
              item.CATEGORY_NAME = "chưa thêm danh mục";
            }
          }
          console.log(this.products);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getProductById(id) {
      try {
        const response = await productServices.getById(id);
        if (response && response.data) {
          this.productDetail = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeImage(id_array) {
      const payload = {
        id_array: id_array,
      };
      const result = await Swal.fire({
        title: "Bạn có muốn chắc chắn xóa ảnh sản phẩm?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`,
      });

      if (result.isConfirmed) {
        const response = await productServices.deleteImgProduct(
          this.productDetail._id,
          payload
        );
        if (response && response.success == true) {
          this.getProductById(this.productDetail._id);
        }
      }
    },
    async removeDefaultImage(id_array) {
      const payload = {
        id_array: id_array,
      };
      const result = await Swal.fire({
        title: "Bạn có muốn chắc chắn xóa ảnh bìa sản phẩm?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`,
      });

      if (result.isConfirmed) {
        const response = await productServices.deleteImgProductDefault(
          this.productDetail._id,
          payload
        );
        if (response && response.success == true) {
          this.getProductById(this.productDetail._id);
        }
      }
    },
    truncateName(name) {
      if (name.length > 25) {
        return name.substring(0, 25) + "...";
      }
      return name;
    },
    onPageChange(newPage) {
      this.page = newPage;
      this.getProduct();
    },

    async removeProduct(productId) {
      this.products = this.products.filter(
        (product) => product._id !== productId
      );
      try {
        await productServices.deleteProduct(productId);
      } catch (error) {
        console.error(error);
      }
    },
    async removeProduct(productId) {
      try {
        const result = await Swal.fire({
          title: "Bạn có muốn chắc chắn xóa sản phẩm này không?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });

        if (result.isConfirmed) {
          await productServices.deleteProduct(productId);
          // Nếu xóa sản phẩm cuối cùng của trang
          if (this.products.length === 1 && this.page > 1) {
            this.page--; // Quay lại trang trước
          }
          await this.getProduct();
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    },

    async saveProduct() {
      const metadata = this.productDetail.LIST_PRODUCT_METADATA.map((item) => ({
        KEY: item.KEY,
        VALUE: Array.isArray(item.VALUE)
          ? item.VALUE // Nếu đã là mảng thì giữ nguyên
          : item.VALUE.split(",").map((value) => value.trim()), // Tách bằng dấu phẩy và loại bỏ khoảng trắng
      }));

      const payload = {
        name: this.productDetail.NAME_PRODUCT,
        short_desc: this.productDetail.SHORT_DESC,
        desc_product: this.productDetail.DESC_PRODUCT,
        metadata: metadata,
      };

      const response = await productServices.updateProduct(
        this.productDetail._id,
        payload
      );
      if (response && response.success == true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Cập nhật thông tin sản phẩm thành công",
        });
        this.getProduct();
      }
    },

    async uploadFileProductDefault(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        console.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
        return;
      }

      try {
        const response = await uploadServices.uploadFile(file);
        this.fileProductDefault = {
          file_url: response.data.url, // Đảm bảo rằng đây là URL đúng từ phản hồi
          file_type: response.data.type, // Đảm bảo rằng đây là loại tệp đúng từ phản hồi
        };
        await productServices.uploadImgProductDefault(
          this.productDetail._id,
          this.fileProductDefault
        );
        await this.getProductById(this.productDetail._id);
        if (response && response.success == true) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Tải ảnh thành công",
          });
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    },
    async uploadFileProduct(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        console.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
        return;
      }

      try {
        const response = await uploadServices.uploadFile(file);
        this.fileProduct = {
          file_url: response.data.url, // Đảm bảo rằng đây là URL đúng từ phản hồi
          file_type: response.data.type, // Đảm bảo rằng đây là loại tệp đúng từ phản hồi
        };
        const updateImgProduct = productServices.uploadImgProduct(
          this.productDetail._id,
          this.fileProduct
        );
        await this.getProductById(this.productDetail._id);
        if (response && response.success == true) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Tải ảnh thành công",
          });
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Container styles */
.container {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Product wrapper */
.product {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  height: 100vh;
  transition: all 0.3s ease;
}

/* Header styles */
.header {
  margin-bottom: 2rem;
}

.header h4 {
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  position: relative;
  padding-bottom: 0.5rem;
}

.header h4::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 3px;
}

/* Top product section */
.top-product {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px 12px 0 0;
  padding: 1.25rem;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
}

/* Bottom product section */
.bottom-product {
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Product row styles */
.bottom-product .row {
  padding: 1rem;
  margin: 0;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e5e7eb;
}

.bottom-product .row:last-child {
  border-bottom: none;
}

.bottom-product .row:hover {
  background-color: #f8fafc;
  transform: translateX(5px);
}

/* Product image */
.img-product {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.img-product:hover {
  transform: scale(1.1);
}

/* Product name */
.px-2 {
  color: #4b5563;
  font-weight: 500;
  margin-left: 1rem;
}

/* Action icons */
.fa-solid {
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  color: #6b7280;
}

.fa-pen-to-square:hover {
  color: #6366f1;
  transform: translateY(-2px);
}

.fa-trash:hover {
  color: #ef4444;
  transform: translateY(-2px);
}

/* Price and inventory text */
.col-3 {
  display: flex;
  align-items: center;
}

.col-3.text-center {
  justify-content: center;
  font-weight: 500;
  color: #4b5563;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product {
    padding: 1rem;
  }

  .header h4 {
    font-size: 1.25rem;
  }

  .top-product,
  .bottom-product {
    padding: 0.75rem;
  }

  .img-product {
    width: 40px;
    height: 40px;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}

/* Empty state */
.bottom-product:empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.bottom-product:empty::after {
  content: "Không có sản phẩm nào";
  display: block;
  font-weight: 500;
}
.img-thumbnail {
  border-radius: 8px;
  margin: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.img-thumbnail:hover {
  transform: scale(1.05);
}
/* Image container styles */
.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

/* Image wrapper styles */
.image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}

/* Thumbnail image styles */
.image-wrapper .img-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin: 0;
}

/* Delete button styles */
.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 1;
}

.delete-btn:hover {
  background-color: #ff7875;
  transform: scale(1.1);
}

/* Add image button styles */
.add-image-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.3s ease;
}

.add-image-btn:hover {
  border-color: #40a9ff;
  background: #f0f5ff;
}

.add-image-btn i {
  font-size: 24px;
  color: #8c8c8c;
}

.add-image-btn:hover i {
  color: #40a9ff;
}

/* Hidden file input */
.file-input {
  display: none;
}

/* Image upload progress */
.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.upload-progress-bar {
  height: 100%;
  background: #1890ff;
  transition: width 0.3s ease;
}

/* Error state */
.upload-error {
  border-color: #ff4d4f;
}

.upload-error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}
/* Modal styling */
.modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  border: none;
}

.modal-title {
  font-weight: 600;
  font-size: 1.5rem !important;
}

.modal-body {
  padding: 2rem;
  background: #f8f9fa;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
  background: white;
  border-radius: 0 0 16px 16px;
}

/* Form controls */
.form-control,
.form-select {
  border: 2px solid #e9ecef;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

/* Labels */
.form-label {
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

/* Buttons */
.btn-success {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-close {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 0.5rem;
}

/* Fieldset styling */
fieldset {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

legend {
  font-weight: 600;
  color: #4b5563;
  padding: 0 0.5rem;
  margin-bottom: 1rem;
}

/* Textarea */
textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

/* Input group spacing */
.mb-3 {
  margin-bottom: 1.5rem !important;
}

/* Modal size */
.modal-xl {
  max-width: 1140px;
}

@media (max-width: 992px) {
  .modal-xl {
    max-width: 90%;
  }
}

/* Animation */
.modal.fade .modal-dialog {
  transform: scale(0.95);
  transition: transform 0.3s ease-out;
}

.modal.show .modal-dialog {
  transform: scale(1);
}
.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.search-input::placeholder {
  color: #9ca3af;
}
.search-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  padding-left: 40px;
}
/* css phân trang */
/* CSS cho phân trang */
.Pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
}

.PaginationControl {
  display: flex;
  align-items: center;
}

.Control {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.Control:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.Control svg {
  width: 20px;
  height: 20px;
  fill: #374151;
}

.Page {
  min-width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  color: #374151;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
}

.Page:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.Page-active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
}

.Page-active:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

/* Style cho nút disable */
.Control[disabled],
.Page[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 640px) {
  .Control,
  .Page {
    min-width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .Control svg {
    width: 16px;
    height: 16px;
  }

  .Pagination {
    gap: 0.25rem;
  }
}
</style>
