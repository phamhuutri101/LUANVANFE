<template>
  <div class="container mt-4">
    <div
      class="modal modal-xl fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Quản lý giá</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancelForm()"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Bảng hiển thị giá -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>STT</th>
                        <th>Giá</th>

                        <th>Thuộc tính</th>
                        <th>Ngày thêm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(price, index) in listPrice" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ formatPrice(price.PRICE_NUMBER) }}</td>
                        <td>
                          <div v-for="item in price.LIST_MATCH_KEY" :key="item">
                            <span>{{ item.KEY }}</span> -
                            <span>{{ item.VALUE }}</span>
                          </div>
                        </td>

                        <td>{{ formatDate(price.FROM_DATE) }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-primary me-2"
                            @click="editPrice(price._id)"
                          >
                            <i class="bi bi-pencil-square"></i> Sửa
                          </button>
                          <button
                            class="btn btn-sm btn-danger"
                            @click="deletePrice(price._id)"
                          >
                            <i class="bi bi-trash"></i> Xóa
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Button thêm mới -->
            <button
              v-if="!showForm"
              class="btn btn-primary mb-4"
              @click="showAddForm"
            >
              <i class="bi bi-plus-circle"></i> Thêm giá mới
            </button>

            <!-- Form thêm/sửa giá -->
            <div class="card" v-if="showForm">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  {{ isEditing ? "Cập nhật giá" : "Thêm giá mới" }}
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitForm">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Giá sản phẩm</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model="priceForm.price_number"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <div class="col-12">
                        <label for="" class="input-group py-2"
                          >Thuộc tính</label
                        >
                        <div v-if="!isEditing">
                          <div
                            v-for="(
                              metadata, index
                            ) in productByID.LIST_PRODUCT_METADATA"
                            :key="index"
                          >
                            <label :for="metadata.KEY" class="form-label">{{
                              metadata.KEY
                            }}</label>
                            <select
                              :id="metadata.KEY"
                              class="form-select w-100"
                              @change="
                                handleSelectChange(
                                  metadata.KEY,
                                  $event.target.value
                                )
                              "
                            >
                              <option>Chọn giá trị</option>
                              <option
                                v-for="value in metadata.VALUE"
                                :key="value"
                                :value="value"
                              >
                                {{ value }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div v-else>
                          <div>
                            <div
                              v-for="item in price_array.LIST_PRICE"
                              :key="item"
                            >
                              <div v-for="KV in item.LIST_MATCH_KEY" :key="KV">
                                <span>{{ KV.KEY }}</span> -
                                <span>{{ KV.VALUE }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="cancelForm"
                    >
                      Hủy
                    </button>
                    <button type="submit" class="btn btn-primary">
                      {{ isEditing ? "Cập nhật" : "Thêm mới" }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid mb-4">
      <div class="row align-items-center bg-white p-4 rounded shadow-sm">
        <div class="col-md-6">
          <h4 class="mb-0 text-primary">
            <i class="fas fa-warehouse me-2"></i>Quản lý giá
          </h4>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-md-end">
            <div class="input-group" style="max-width: 300px">
              <span class="input-group-text bg-white">
                <i class="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0"
                placeholder="Tìm kiếm sản phẩm..."
                v-model="searchQuery"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="card shadow-sm border-0">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="border-0 text-uppercase small fw-bold">STT</th>
                  <th class="border-0 text-uppercase small fw-bold">
                    Tên sản phẩm
                  </th>

                  <th class="border-0 text-uppercase small fw-bold text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filteredProducts" :key="index">
                  <td class="align-middle">
                    <span class="fw-bold text-secondary">{{ index + 1 }}</span>
                  </td>
                  <td class="align-middle d-flex">
                    <img
                      class="img"
                      :src="item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                      alt=""
                    />
                    <span> {{ item.NAME_PRODUCT }}</span>
                  </td>

                  <td class="align-middle text-center">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      class="btn btn-primary btn-sm"
                      @click="getPrices(item._id)"
                    >
                      <i class="fas fa-plus-circle me-1"></i>
                      Mở rộng
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
</template>

<script>
import priceServices from "@/services/price.services";
import productServices from "@/services/product.services";
import Swal from "sweetalert2";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import categoryServices from "@/services/category.services";
export default {
  components: {
    VPagination,
  },
  name: "PriceManagement",
  data() {
    return {
      listPrice: [],
      PriceGet: [],
      productByID: [],
      showForm: false,
      isEditing: false,
      priceForm: {
        price_number: "",
        key: [],
        value: [],
      },
      price_array: [],
      searchQuery: "",
      page: 1,
      limit: 5,
      currentMaxPage: 1,
      products: [],
    };
  },
  created() {
    this.getAllProduct();
  },
  computed: {
    filteredProducts() {
      const query = this.searchQuery.toLowerCase();
      return this.products.filter((product) =>
        product.NAME_PRODUCT.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async getAllProduct() {
      const response = await productServices.getProductShop(
        this.page,
        this.limit
      );
      if (response && response.data) {
        this.products = response.data;
        for (const product of this.products) {
          const categoryResponse = await categoryServices.getById(
            product.CATEGORY_ID
          );
          if (categoryResponse && categoryResponse.data) {
            product.CATEGORY_NAME = categoryResponse.data[0].CATEGORY_NAME; // Gán CATEGORY_NAME cho từng sản phẩm
          }
        }
      }
    },
    async getProductById() {
      console.log(this.PriceGet.ID_PRODUCT);
      const response = await productServices.getById(this.PriceGet.ID_PRODUCT);
      if (response && response.data) {
        this.productByID = response.data;
      }
    },
    async getPrices(id) {
      try {
        const response = await priceServices.getById(id);
        if (response && response.data) {
          this.listPrice = response.data.LIST_PRICE || [];
          this.PriceGet = response.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giá:", error);
      }
    },
    async deletePrice(id_listPrice) {
      const payload = {
        id_array: id_listPrice,
      };
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa giá này không?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`,
      });

      if (result.isConfirmed) {
        const response = await priceServices.deletePrice(
          this.PriceGet.ID_PRODUCT,
          payload
        );
        await this.getPrices(this.PriceGet.ID_PRODUCT);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 800,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "xóa giá thành công",
        });
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price);
    },

    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN");
    },

    async showAddForm() {
      await this.getProductById();
      this.isEditing = false;
      this.showForm = true;
      this.resetForm();
    },

    editPrice(id_array) {
      this.isEditing = true;
      this.showForm = true;
      this.getPriceArray(id_array);
    },

    resetForm() {
      this.priceForm = {
        price_number: "",
        key: [],
        value: [],
      };
    },

    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },
    handleSelectChange(key, value) {
      // Tìm vị trí của thuộc tính (key) trong danh sách
      if (!this.priceForm || !Array.isArray(this.priceForm.key)) {
        console.error("priceForm is not initialized properly.");
        return;
      }
      const index = this.priceForm.key.indexOf(key);

      if (index !== -1) {
        // Nếu key đã tồn tại, cập nhật giá trị của nó
        this.priceForm.value[index] = value;
      } else {
        // Nếu key chưa tồn tại, thêm mới key và value vào danh sách
        this.priceForm.key.push(key);
        this.priceForm.value.push(value);
      }
      console.log("dữ liệu nhập vào", this.priceForm);
    },
    async submitForm() {
      try {
        const payload = {
          price_number: this.priceForm.price_number,
          id_list_price: this.price_array.LIST_PRICE[0]._id,
        };
        if (this.isEditing) {
          await priceServices.updatePrice(this.PriceGet.ID_PRODUCT, payload);
        } else {
          await priceServices.addPriceProduct(
            this.PriceGet.ID_PRODUCT,
            this.priceForm
          );
        }

        await this.getPrices(this.PriceGet.ID_PRODUCT);
        this.showForm = false;
        this.resetForm();
      } catch (error) {
        console.error("Lỗi khi lưu giá:", error);
      }
    },
    async getPriceArray(id_array) {
      const payload = {
        id_array: id_array,
      };
      const response = await priceServices.getPriceArray(
        this.PriceGet.ID_PRODUCT,
        payload
      );
      if (response && response.data) {
        this.price_array = response.data[0];
        this.priceForm.price_number =
          this.price_array.LIST_PRICE[0].PRICE_NUMBER;
      }
    },
  },
};
</script>

<style scoped>
.warehouse-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1.5rem;
}

.avatar-lg {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1055;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

/* Custom Scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Table Hover Effect */
.table tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

/* Input Focus Effect */
.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

/* Button Hover Effects */
.btn {
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .warehouse-page {
    padding: 1rem;
  }

  .card {
    margin: 0 -1rem;
    border-radius: 0;
  }
}
.img {
  width: 80px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
