# WarehouseInput.vue
<template>
  <div class="warehouse-page">
    <!-- Header Section -->
    <div class="container-fluid mb-4">
      <div class="row align-items-center bg-white p-4 rounded shadow-sm">
        <div class="col-md-6">
          <h4 class="mb-0 text-primary">
            <i class="fas fa-warehouse me-2"></i>Quản lý nhập kho
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

    <!-- Table Section -->
    <div class="container-fluid">
      <div class="card shadow-sm border-0">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="border-0 text-uppercase small fw-bold">Mã SP</th>
                  <th class="border-0 text-uppercase small fw-bold">
                    Tên sản phẩm
                  </th>
                  <th class="border-0 text-uppercase small fw-bold">
                    Danh mục
                  </th>
                  <th class="border-0 text-uppercase small fw-bold">Tồn kho</th>
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
                  <td class="align-middle">
                    <span class="badge bg-info bg-opacity-10 text-info">
                      {{ item.CATEGORY_NAME }}
                    </span>
                  </td>
                  <td class="align-middle">
                    <span
                      class="badge"
                      :class="
                        item.NUMBER_INVENTORY_PRODUCT < 50
                          ? 'bg-danger'
                          : 'bg-success'
                      "
                    >
                      {{ item.NUMBER_INVENTORY_PRODUCT }}
                    </span>
                  </td>
                  <td class="align-middle text-center">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      @click="getProductById(item._id)"
                      class="btn btn-primary btn-sm"
                    >
                      <i class="fas fa-plus-circle me-1"></i>
                      Nhập kho
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title">
              <i class="fas fa-box-open me-2 text-primary"></i>
              Nhập kho sản phẩm
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Product Info -->
            <div class="d-flex align-items-center p-3 bg-light rounded mb-3">
              <div class="flex-shrink-0">
                <div class="avatar-lg bg-primary bg-opacity-10 rounded p-2">
                  <i class="fas fa-box fa-2x text-primary"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="fw-bold mb-1">{{ productByID.NAME_PRODUCT }}</h6>
                <p class="text-muted small mb-0">
                  Tồn kho: {{ productByID.NUMBER_INVENTORY_PRODUCT }}
                </p>
              </div>
            </div>

            <!-- Import Form -->
            <form @submit.prevent>
              <!-- Dynamic Attributes -->
              <div class="mb-3">
                <div class="col-12">
                  <label for="" class="input-group py-2">Thuộc tính</label>
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
                        handleSelectChange(metadata.KEY, $event.target.value)
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
              </div>
              <div class="mb-3">
                <label class="form-label">Số lượng nhập</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-sort-numeric-up"></i>
                  </span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="payloadInventory.quantity"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Giá nhập</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-dollar-sign"></i>
                  </span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="payloadInventory.price"
                    required
                  />
                </div>
              </div>
              <div class="mb-3">
                <div class="col-12">
                  <label for="" class="input-group py-2">Nhà cung cấp</label>
                  <div v-for="(metadata, index) in suppliers" :key="index">
                    <select
                      :id="metadata.KEY"
                      class="form-select w-100"
                      @change="handleSelectChangeSupplier($event.target.value)"
                    >
                      <option>Chọn giá trị</option>
                      <option
                        v-for="item in suppliers"
                        :key="item._id"
                        :value="item._id"
                      >
                        {{ item.NAME_SUPPLIERS }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              @click="createInventory()"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
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
import inventoryServices from "@/services/inventory.services";
import productServices from "@/services/product.services";
import categoryServices from "@/services/category.services";
import Swal from "sweetalert2";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import supplierServices from "@/services/supplier.services";
export default {
  components: {
    VPagination,
  },
  name: "WarehouseInput",
  data() {
    return {
      searchQuery: "",

      suppliers: [],
      productByID: [],
      page: 1,
      limit: 5,
      currentMaxPage: 1,

      // Products data
      products: [],

      // Import form data
      payloadInventory: {
        price: "",
        quantity: "",
        key: [],
        value: [],
        id_supplier: "",
      },

      productKeyValue: [],
    };
  },

  computed: {
    filteredProducts() {
      const query = this.searchQuery.toLowerCase();
      return this.products.filter((product) =>
        product.NAME_PRODUCT.toLowerCase().includes(query)
      );
    },
  },
  created() {
    this.getAllProduct();
  },
  methods: {
    async getAllProduct() {
      const response = await productServices.getAll(this.page, this.limit);
      if (response && response.data) {
        this.products = response.data;
        for (const product of this.products) {
          try {
            const categoryResponse = await categoryServices.getById(
              product.CATEGORY_ID
            );

            // Kiểm tra kỹ càng trước khi gán giá trị
            if (
              categoryResponse &&
              categoryResponse.data &&
              Array.isArray(categoryResponse.data) &&
              categoryResponse.data.length > 0
            ) {
              product.CATEGORY_NAME =
                categoryResponse.data[0].CATEGORY_NAME ||
                "Không có tên danh mục"; // Giá trị mặc định nếu CATEGORY_NAME rỗng
            } else {
              product.CATEGORY_NAME = "Chưa xác định"; // Giá trị mặc định nếu không có dữ liệu
            }
          } catch (error) {
            console.error(
              `Không thể lấy danh mục cho sản phẩm ${product.NAME_PRODUCT}:`,
              error
            );
            product.CATEGORY_NAME = "Lỗi lấy danh mục"; // Gán giá trị khi có lỗi xảy ra
          }
        }
        console.log(this.products);
      }
    },
    async getAllSupplier() {
      const response = await supplierServices.getAllSuppliers();
      if (response && response.data) {
        this.suppliers = response.data;
      }
    },
    closeModal() {
      this.resetForm();
    },
    async getProductById(id) {
      const response = await productServices.getById(id);
      this.getAllSupplier();
      if (response && response.data) {
        this.productByID = response.data;
      }
    },
    onPageChange(newPage) {
      this.page = newPage;
      this.getProduct();
    },
    async createInventory() {
      try {
        if (this.productByID) {
          const response = await inventoryServices.create(
            this.productByID._id,
            this.payloadInventory
          );

          if (response && response.data) {
            this.getAllProduct();
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
              title: "Nhập kho sản phẩm thành công",
            });
          }
          this.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.payloadInventory = {
        price: "",
        quantity: "",
        key: [],
        value: [],
        id_supplier: "",
      };
      this.productKeyValue = [];
    },
    handleSelectChange(key, value) {
      // Tìm vị trí của thuộc tính (key) trong danh sách
      const index = this.payloadInventory.key.indexOf(key);

      if (index !== -1) {
        // Nếu key đã tồn tại, cập nhật giá trị của nó
        this.payloadInventory.value[index] = value;
      } else {
        // Nếu key chưa tồn tại, thêm mới key và value vào danh sách
        this.payloadInventory.key.push(key);
        this.payloadInventory.value.push(value);
      }
      console.log("dữ liệu nhập vào", this.payloadInventory);
    },
    handleSelectChangeSupplier(id) {
      this.payloadInventory.id_supplier = id;
      console.log("dữ liệu nhập vào", this.payloadInventory);
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
