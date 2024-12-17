<template>
  <!-- Modal -->
  <div
    class="modal modal-xl fade"
    id="detailInventory"
    tabindex="-1"
    aria-labelledby="detailInventoryLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="detailInventoryLabel">
            Chi Tiết Phiếu Nhập Kho
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="receipt-container">
            <div class="receipt-card">
              <!-- Header -->
              <div class="receipt-header">
                <div class="receipt-info">
                  <p><span>Mã phiếu:</span> {{}}</p>
                  <p>
                    <span>Ngày tạo:</span>
                    {{ formatDate(detailsInventory.CRATED_DATE) }}
                  </p>
                </div>
              </div>

              <!-- Supplier Info -->
              <div class="supplier-info">
                <h2>Thông tin nhà cung cấp</h2>
                <p>
                  <span>Tên NCC:</span> {{ detailsInventory.SUPPLIER_NAME }}
                </p>
              </div>

              <!-- Products List -->
              <div class="products-section">
                <div class="table-container">
                  <table class="products-table">
                    <thead>
                      <tr>
                        <th>Tên sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>

                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in detailsInventory.LIST_PRODUCT_CREATED"
                        :key="item"
                      >
                        <td>{{ item.NAME_PRODUCT }}</td>
                        <td>{{ formatNumber(item.UNIT_PRICE) }}</td>
                        <td>{{ item.QUANTITY }}</td>
                        <td>
                          <div
                            class="product-details"
                            v-for="item in item.DETAILS"
                            :key="item"
                          >
                            <span class="detail-key">{{ item.KEY }}:</span>
                            {{ item.VALUE }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Summary -->
              <div class="receipt-summary">
                <div class="summary-content">
                  <div class="summary-row">
                    <span>Tổng số lượng:</span>
                    <span
                      v-if="
                        detailsInventory.LIST_PRODUCT_CREATED &&
                        detailsInventory.LIST_PRODUCT_CREATED.length > 0
                      "
                    >
                      {{ detailsInventory.LIST_PRODUCT_CREATED[0].QUANTITY }}
                    </span>
                  </div>
                  <div class="summary-row">
                    <span>Tổng tiền:</span>
                    <span
                      v-if="
                        detailsInventory.LIST_PRODUCT_CREATED &&
                        detailsInventory.LIST_PRODUCT_CREATED.length > 0
                      "
                      class="total-amount"
                      >{{
                        formatNumber(
                          totalPriceInventory(
                            detailsInventory.LIST_PRODUCT_CREATED[0].UNIT_PRICE,
                            detailsInventory.LIST_PRODUCT_CREATED[0].QUANTITY
                          )
                        )
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="receipt-footer">
                <p>
                  <span>Người tạo:</span> {{ detailsInventory.ACCOUNT_NAME }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container my-5">
    <div class="overview d-flex justify-content-between">
      <div class="item-overview">
        <span>Tổng giá trị kho </span>
        <span>{{ formatNumber(totalImportCost) }}</span>
      </div>
      <div class="item-overview">
        <span>Số lượng phiếu nhập kho </span>
        <span>{{ dataInventory.length }}</span>
      </div>
    </div>
  </div>
  <div class="container my-5">
    <div class="chart-container">
      <canvas id="inventoryChart"></canvas>
    </div>
  </div>
  <div class="container">
    <h1>Chi tiết nhập kho</h1>
    <div class="filter">
      <div class="search-container">
        <label for="search">Tìm kiếm sản phẩm:</label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Nhập tên sản phẩm..."
          class="search-input"
        />
      </div>
      <label for="start-date">Ngày bắt đầu:</label>
      <input type="date" v-model="startDate" />

      <label for="end-date">Ngày kết thúc:</label>
      <input type="date" v-model="endDate" />

      <button @click="applyFilterDate">Lọc</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tên Sản phẩm</th>
          <th scope="col">Ngày nhập</th>
          <th scope="col">Phân loại</th>
          <th scope="col">Nhà cung cấp</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in filteredDataInventory" :key="item._id">
        <tr
          data-bs-toggle="modal"
          data-bs-target="#detailInventory"
          @click="getInventoryById(item._id)"
          v-for="data in item.LIST_PRODUCT_CREATED"
          :key="data"
        >
          <td scope="row">{{ index + 1 }}</td>
          <td>{{ formatName(data.NAME_PRODUCT) }}</td>
          <td>{{ formatDate(item.CRATED_DATE) }}</td>
          <td>
            <div v-for="item of data.DETAILS" :key="item">
              <span>{{ item.KEY }}</span
              >: <span>{{ item.VALUE }}</span>
            </div>
          </td>
          <td>{{ item.SUPPLIER_NAME }}</td>
        </tr>
      </tbody>
    </table>
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
import userServices from "@/services/user.services";
import supplierServices from "@/services/supplier.services";
import { formatNumber } from "@/utils/formatNumber";
import { formatDate } from "@/utils/formatDate";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, BarController);
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
export default {
  components: {
    VPagination,
  },
  data() {
    return {
      dataInventory: [],
      detailsInventory: {},
      ProductById: {},
      searchQuery: "",
      startDate: "", // Ngày bắt đầu
      endDate: "", // Ngày kết thúc
      totalImportCost: "",
      productQuantityMap: {},
      page: 1,
      limit: 30,
      currentMaxPage: 1,
    };
  },

  async created() {
    await this.getInventory();
    this.calculateTotalImportCost();
    this.renderChart();
  },
  methods: {
    calculateNumberProduct() {
      this.productQuantityMap = {};

      // Duyệt qua từng phiếu nhập kho trong dataInventory
      this.dataInventory.forEach((inventory) => {
        // Duyệt qua từng sản phẩm trong LIST_PRODUCT_CREATED
        inventory.LIST_PRODUCT_CREATED.forEach((product) => {
          const productId = product.ID_PRODUCT;
          const quantity = product.QUANTITY;

          // Kiểm tra xem sản phẩm đã tồn tại trong productQuantityMap chưa
          if (this.productQuantityMap[productId]) {
            // Nếu có rồi, cộng dồn số lượng
            this.productQuantityMap[productId] += quantity;
          } else {
            // Nếu chưa có, khởi tạo với số lượng hiện tại
            this.productQuantityMap[productId] = quantity;
          }
        });
      });

      console.log("Tổng số lượng theo ID_PRODUCT:", this.productQuantityMap);
    },
    renderChart() {
      const chartData = this.aggregateDataByDate();
      const ctx = document.getElementById("inventoryChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.dates,
          datasets: [
            {
              label: "Số tiền nhập kho",
              data: chartData.amounts,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Ngày" } },
            y: { title: { display: true, text: "Số tiền nhập kho (VND)" } },
          },
        },
      });
    },
    aggregateDataByDate() {
      const dateAmountMap = {};

      this.dataInventory.forEach((inventory) => {
        const date = new Date(inventory.CRATED_DATE).toLocaleDateString();
        const totalAmount = inventory.LIST_PRODUCT_CREATED.reduce(
          (sum, product) => sum + product.TOTAL_IMPORT_CONST,
          0
        );

        if (dateAmountMap[date]) {
          dateAmountMap[date] += totalAmount;
        } else {
          dateAmountMap[date] = totalAmount;
        }
      });

      return {
        dates: Object.keys(dateAmountMap),
        amounts: Object.values(dateAmountMap),
      };
    },
    calculateTotalImportCost() {
      let totalImportCost = 0;
      this.dataInventory.forEach((inventory) => {
        inventory.LIST_PRODUCT_CREATED.forEach((product) => {
          totalImportCost += product.TOTAL_IMPORT_CONST;
        });
      });
      return (this.totalImportCost = totalImportCost);
    },
    formatDate(date) {
      return formatDate(date);
    },
    formatName(name) {
      if (!name) return ""; // Kiểm tra nếu name không tồn tại
      return name.length > 25 ? name.substring(0, 25) + "..." : name;
    },
    async getInventoryById(id) {
      try {
        const response = await inventoryServices.getInventoryById(id);
        if (response && response.data) {
          this.detailsInventory = response.data;
          const supplerID = this.detailsInventory.ID_SUPPLIERS;
          const resSupper = await supplierServices.getById(supplerID);
          if (resSupper && resSupper.data) {
            this.detailsInventory.SUPPLIER_NAME = resSupper.data.NAME_SUPPLIERS;
          } else {
            console.error("L��i khi lấy thông tin nhà cung cấp");
          }
          const AccountID = this.detailsInventory.ACCOUNT__ID;
          const resAccount = await userServices.getUserByAccountId(AccountID);
          if (resAccount && resAccount.data) {
            this.detailsInventory.ACCOUNT_NAME =
              resAccount.data[0].user.FULL_NAME;
          }

          for (let item of this.detailsInventory.LIST_PRODUCT_CREATED) {
            const productID = item.ID_PRODUCT;
            const resProduct = await productServices.getById(productID);
            if (resProduct && resProduct.data) {
              item.NAME_PRODUCT = resProduct.data.NAME_PRODUCT;
            } else {
              console.error("L��i khi lấy thông tin sản phẩm");
            }
          }
        } else {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    },
    totalPriceInventory(price, quantity) {
      return price * quantity;
    },
    formatNumber(number) {
      return formatNumber(number);
    },

    async getInventory() {
      try {
        const response = await inventoryServices.getInventory(
          this.page,
          this.limit
        );
        if (response && response.data) {
          this.dataInventory = response.data;

          // sắp xếp ngày hiển thị
          this.dataInventory.sort(
            (a, b) => new Date(b.CRATED_DATE) - new Date(a.CRATED_DATE)
          );
          if (this.dataInventory.length < this.limit) {
            this.hasMorePages = false;
            this.currentMaxPage = this.page;
          }
          // Nếu đang ở trang cuối cùng đã biết và vẫn có đủ số sản phẩm
          else if (this.page >= this.currentMaxPage) {
            this.hasMorePages = true;
            this.currentMaxPage = this.page + 1;
          }
          for (const inventory of this.dataInventory) {
            const supplerID = inventory.ID_SUPPLIERS;
            const resSupper = await supplierServices.getById(supplerID);
            if (resSupper && resSupper.data) {
              inventory.SUPPLIER_NAME = resSupper.data.NAME_SUPPLIERS;
              console.log("sản phẩm detail", this.dataInventory);
            } else {
              console.error("L��i khi lấy tên nhà cung cấp");
            }
            for (const product of inventory.LIST_PRODUCT_CREATED) {
              const productId = product.ID_PRODUCT;
              const resProduct = await productServices.getById(productId);
              if (resProduct && resProduct.data) {
                product.NAME_PRODUCT = resProduct.data.NAME_PRODUCT;
              } else {
                console.error("Lỗi khi lấy tên sản phẩm nhập kho");
              }
            }
          }

          console.log("Dữ liệu nhập kho đã cập nhật:", this.dataInventory);
        } else {
          console.error("lỗi");
        }
      } catch (error) {
        console.error(error);
      }
    },
    applyFilterDate() {
      console.log("Ngày bắt đầu:", this.startDate);
      console.log("Ngày kết thúc:", this.endDate);
      console.log("Kết quả lọc:", this.filteredDataInventory);
    },
    onPageChange(newPage) {
      this.page = newPage;
      this.getInventory();
    },
  },
  computed: {
    filteredDataInventory() {
      let filteredData = this.dataInventory;

      // Lọc theo từ khóa
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((inventory) =>
          inventory.LIST_PRODUCT_CREATED.some((product) =>
            product.NAME_PRODUCT?.toLowerCase().includes(query)
          )
        );
      }

      // Lọc theo ngày
      if (this.startDate || this.endDate) {
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;

        filteredData = filteredData.filter((inventory) => {
          const createdDate = inventory.CRATED_DATE
            ? new Date(inventory.CRATED_DATE)
            : null;
          if (start && end) {
            return createdDate >= start && createdDate <= end;
          } else if (start) {
            return createdDate >= start;
          } else if (end) {
            return createdDate <= end;
          }
          return true;
        });
      }

      console.log("Dữ liệu sau khi lọc:", filteredData);
      console.log("Ngày bắt đầu:", this.startDate);
      console.log("Ngày kết thúc:", this.endDate);
      console.log("Kết quả lọc:", this.filteredDataInventory);
      return filteredData;
    },
  },
};
</script>

<style scoped>
/* Enhanced Container Styles */
.container {
  padding: 2rem;
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  margin: 2rem auto;
  max-width: 1400px;
}

/* Overview Section */
.overview {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

.item-overview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  min-width: 250px;
}

.item-overview span:first-child {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.item-overview span:last-child {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Chart Container */
.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

/* Filter Section */
.filter {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter input[type="date"] {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #1e293b;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.filter input[type="date"]:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter button {
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Table Styles */
.table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table thead {
  background: #f8fafc;
}

.table th {
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.table td {
  padding: 1rem 1.5rem;
  color: #1e293b;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.table tbody tr {
  background: white;
  transition: all 0.2s;
}

.table tbody tr:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Modal Styles */
.modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.modal-title {
  color: #1e293b;
  font-weight: 600;
}

.modal-body {
  padding: 2rem;
}

/* Receipt Card Styles */
.receipt-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  padding: 2rem;
}

.receipt-header {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.receipt-info p {
  color: #64748b;
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.receipt-info span {
  color: #1e293b;
  font-weight: 500;
}

.supplier-info h2 {
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.products-table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: separate;
  border-spacing: 0;
}

.products-table th {
  background: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.products-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 0.875rem;
}

.receipt-summary {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.summary-row span:first-child {
  color: #64748b;
  font-weight: 500;
}

.summary-row .total-amount {
  color: #2563eb;
  font-weight: 600;
  font-size: 1.125rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .filter {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
  }

  .receipt-card {
    padding: 1rem;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  animation: slideIn 0.3s ease-out;
}

.table tbody tr {
  animation: slideIn 0.2s ease-out forwards;
  opacity: 0;
  animation-delay: calc(var(--row-index, 0) * 0.05s);
}
.search-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 250px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
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
