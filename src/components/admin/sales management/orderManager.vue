<template>
  <div class="container">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý đơn hàng</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-success" @click="exportOrders">
          <i class="bi bi-file-earmark-excel me-2"></i>Xuất Excel
        </button>
        <button class="btn btn-primary" @click="refreshOrders">
          <i class="bi bi-arrow-clockwise me-2"></i>Làm mới
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Mã đơn hàng</label>
            <input
              v-model="filters.orderCode"
              type="text"
              class="form-control"
              placeholder="Nhập mã đơn hàng"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Trạng thái</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Tất cả</option>
              <option value="0">Chờ thanh toán</option>
              <option value="1">Chờ xác nhận</option>
              <option value="2">Chưa hoàn thành thanh toán</option>
              <option value="3">Đã xác nhận</option>
              <option value="4">đã gửi hàng</option>
              <option value="5">Đã thanh toán Online</option>
              <option value="6">đã nhận hàng</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Từ ngày</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Đến ngày</label>
            <input v-model="filters.endDate" type="date" class="form-control" />
          </div>
          <div class="col-12">
            <button class="btn btn-primary" @click="searchOrders">
              <i class="bi bi-search me-2"></i>Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
                <th>cập nhật trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.ORDER_CODE }}</td>
                <td>{{ order.FULL_NAME }}</td>
                <td>{{ formatDate(order.LIST_STATUS[0].FROM_DATE) }}</td>
                <td>{{ formatPrice(order.ORDER_PRICE) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(getLatestStatus(order))">
                    {{ getStatusText(getLatestStatus(order)) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button
                      class="btn btn-sm btn-info"
                      @click="viewOrderDetail(order._id)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>

                    <button
                      v-if="getLatestStatus(order) === 6"
                      class="btn btn-sm btn-danger"
                      @click="deleteOrder(order._id, order.ORDER_CODE)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
                <td>
                  <div class="btn-group">
                    <!-- Nút xác nhận đơn hàng -->
                    <button
                      v-if="getLatestStatus(order) === 1"
                      class="btn btn-sm btn-status btn-warning"
                      @click="confirmOrder(order._id, order.ACCOUNT__ID)"
                    >
                      Xác nhận đơn hàng
                    </button>

                    <!-- Nút gửi hàng -->
                    <button
                      v-if="getLatestStatus(order) === 3"
                      class="btn btn-sm btn-status btn-primary"
                      @click="shipOrder(order._id, order.ACCOUNT__ID)"
                    >
                      Gửi hàng
                    </button>

                    <!-- Nút nhận hàng -->
                    <button
                      v-if="getLatestStatus(order) === 4"
                      class="btn btn-sm btn-status btn-success"
                      @click="receiveOrder(order._id, order.ACCOUNT__ID)"
                    >
                      Đã nhận hàng
                    </button>
                    <button
                      v-if="getLatestStatus(order) === 6"
                      class="btn btn-sm btn-status btn-success"
                      disabled
                    >
                      Đơn hàng hoàn thành
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <VPagination
          v-model="page"
          :pages="currentMaxPage"
          :range-size="5"
          active-color="#DCEDFF"
          @update:modelValue="onPageChange"
        />
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Chi tiết đơn hàng # {{ detailOrder.ORDER_CODE }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <p>
                  <strong>Khách hàng:</strong>
                  {{ dataUserByAccountId.FULL_NAME }}
                </p>
                <p>
                  <strong>Email:</strong> {{ dataUserByAccountId.EMAIL_USER }}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>
                  {{ dataUserByAccountId.PHONE_NUMBER }}
                </p>
              </div>
              <div class="col-md-6">
                <p>
                  <strong>Ngày đặt:</strong>
                  {{
                    formatDate(detailOrder.LIST_STATUS?.[0]?.FROM_DATE || "N/A")
                  }}
                </p>
                <p>
                  <strong>Trạng thái:</strong>
                  {{ getStatusText(getLatestStatus(detailOrder)) }}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>
                  COD
                </p>
              </div>
            </div>

            <h6>Sản phẩm</h6>
            <table class="table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailOrder.LIST_PRODUCT" :key="item._id">
                  <td>{{ productNames[item.ID_PRODUCT] || "Loading..." }}</td>
                  <td>{{ item.QLT }}</td>
                  <td>{{ formatPrice(item.UNITPRICES) }}</td>
                  <td>{{ formatPrice(item.QLT * item.UNITPRICES) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end">
                    <strong>Phí vận chuyển:</strong>
                  </td>
                  <td>{{ formatPrice(detailOrder.SHIPPING_FEE) }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-end">
                    <strong>Giá giảm:</strong>
                  </td>
                  <td>{{ formatPrice(detailOrder.PRICE_REDUCED) }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-end">
                    <strong>Tổng cộng:</strong>
                  </td>
                  <td>
                    <strong>{{ formatPrice(detailOrder.ORDER_PRICE) }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
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
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import orderServices from "@/services/order.services";
import userServices from "@/services/user.services";
import productServices from "@/services/product.services";
import { formatDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import Swal from "sweetalert2";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
export default {
  name: "OrderManagement",
  components: {
    VPagination,
  },
  data() {
    return {
      orders: [],
      originalOrders: [],
      selectedOrder: null,
      page: 1,
      limit: 5,
      currentMaxPage: 1, // Số trang tối đa đã biết
      orderDetailModal: null,

      filters: {
        orderCode: "",
        status: "",
        startDate: "",
        endDate: "",
      },
      detailOrder: {},
      dataUserByAccountId: {},
      productNames: {},
    };
  },

  mounted() {
    this.orderDetailModal = new Modal(
      document.getElementById("orderDetailModal")
    );
    this.originalOrders = [...this.orders];
  },

  created() {
    this.getOrder();
  },

  methods: {
    async getOrder() {
      const response = await orderServices.getOrderUser(this.page, this.limit);
      this.orders = response.data;
      for (const item of this.orders) {
        const response = await userServices.getUserByAccountId(
          item.ACCOUNT__ID
        );
        if (response && response.data) {
          const user = response.data[0];
          item.FULL_NAME = user.user.FULL_NAME;
        }
      }
      console.log("dữ liệu order sau khi chạy vòng lặp", this.orders);
      this.originalOrders = [...this.orders];
    },

    getLatestStatus(order) {
      if (order.LIST_STATUS && order.LIST_STATUS.length > 0) {
        const latestStatus = order.LIST_STATUS[order.LIST_STATUS.length - 1];
        return latestStatus.STATUS_CODE;
      }
      return null; // Trả về null nếu LIST_STATUS không tồn tại hoặc rỗng
    },

    getStatusText(statusCode) {
      const statusMap = {
        0: "Chờ thanh toán",
        1: "Chờ xác nhận",
        2: "Chưa hoàn thành thanh toán",
        3: "Đã xác nhận",
        4: "Đã gửi hàng",
        5: "Đã thanh toán Online",
        6: "Đã nhận hàng",
      };
      return statusMap[statusCode] || "Chưa xác nhận";
    },

    searchOrders() {
      let filteredOrders = [...this.originalOrders];

      // Filter by order code
      if (this.filters.orderCode.trim()) {
        filteredOrders = filteredOrders.filter((order) =>
          order.ORDER_CODE.toLowerCase().includes(
            this.filters.orderCode.toLowerCase().trim()
          )
        );
      }

      // Filter by status using the latest STATUS_CODE
      if (this.filters.status) {
        filteredOrders = filteredOrders.filter(
          (order) => this.getLatestStatus(order) === Number(this.filters.status)
        );
      }

      // Filter by date range
      if (this.filters.startDate && this.filters.endDate) {
        const startDate = new Date(this.filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(this.filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      } else if (this.filters.startDate) {
        const startDate = new Date(this.filters.startDate);
        startDate.setHours(0, 0, 0, 0);

        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate;
        });
      } else if (this.filters.endDate) {
        const endDate = new Date(this.filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate <= endDate;
        });
      }

      this.orders = filteredOrders;
    },

    refreshOrders() {
      this.filters = {
        orderCode: "",
        status: "",
        startDate: "",
        endDate: "",
      };
      this.orders = [...this.originalOrders];
    },

    exportOrders() {
      console.log("Exporting orders...");
    },
    formatDate(date) {
      return formatDate(date);
    },
    formatPrice(price) {
      const Price = Number(price);
      return formatNumber(Price);
    },

    editOrder(orderId) {
      console.log("Editing order:", orderId);
    },

    async viewOrderDetail(id) {
      const response = await orderServices.getOrderById(id);
      if (response && response.data) {
        this.detailOrder = response.data;

        // Lấy thông tin người dùng
        const result = await userServices.getUserByAccountId(
          this.detailOrder.ACCOUNT__ID
        );
        if (result && result.data) {
          this.dataUserByAccountId = result.data[0].user;
        } else {
          this.dataUserByAccountId = {};
        }

        // Lấy tên sản phẩm
        for (const item of this.detailOrder.LIST_PRODUCT) {
          if (!this.productNames[item.ID_PRODUCT]) {
            const productResponse = await productServices.getById(
              item.ID_PRODUCT
            );
            if (productResponse && productResponse.data) {
              this.productNames[item.ID_PRODUCT] =
                productResponse.data.NAME_PRODUCT;
            }
          }
        }
      }
      this.orderDetailModal.show();
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    getStatusBadgeClass(status) {
      const classMap = {
        0: "badge bg-warning",
        1: "badge bg-info",
        2: "badge bg-success",
        3: "badge bg-danger",
        4: "badge bg-danger",
        5: "badge bg-danger",
        6: "badge bg-danger",
      };
      return classMap[status] || "badge bg-secondary";
    },
    async confirmOrder(orderId, id_account) {
      try {
        const payload = {
          id_order: orderId,
        };
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });
        if (result.isConfirmed) {
          await orderServices.confirmedOrder(id_account, payload); // Chuyển trạng thái thành "Đã xác nhận"
          this.getOrder(); // Làm mới danh sách đơn hàng
        }
      } catch (error) {
        console.error("Lỗi khi xác nhận đơn hàng:", error);
      }
    },

    // Hàm gửi hàng
    async shipOrder(orderId, id_account) {
      const payload = {
        id_order: orderId,
      };
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });
        if (result.isConfirmed) {
          await orderServices.sendOrder(id_account, payload); // Chuyển trạng thái thành "Đã gửi hàng"
          this.getOrder();
        }
      } catch (error) {
        console.error("Lỗi khi gửi hàng:", error);
      }
    },

    // Hàm nhận hàng
    async receiveOrder(orderId, id_account) {
      const payload = {
        id_order: orderId,
      };
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });
        if (result.isConfirmed) {
          await orderServices.successOrder(id_account, payload); // Chuyển trạng thái thành "Đã xác nhận"
          this.getOrder(); // Làm mới danh sách đơn hàng
        }
      } catch (error) {
        console.error("Lỗi khi nhận hàng:", error);
      }
    },
    async deleteOrder(orderId, orderCode) {
      try {
        const result = await Swal.fire({
          title: `Bạn có chắc chắn muốn xóa đơn hàng ${orderCode} ?`,
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });
        if (result.isConfirmed) {
          await orderServices.deleteOrder(orderId);
          this.getOrder(); // Làm mới danh sách đơn hàng
        }
      } catch (error) {}
    },
  },
};
</script>

<style scoped>
/* Container styles */
.container-fluid {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.btn-status {
  width: 100px;
  height: 47px;
}

/* Header styles */
h2 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0;
}

/* Button styles */
.btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  border: none;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
}

.btn-success:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-primary {
  background-color: #007bff;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.btn-primary:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

/* Card styles */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  background-color: #ffffff;
}

.card-body {
  padding: 24px;
}

/* Form styles */
.form-label {
  color: #495057;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Table styles */
.table {
  margin-bottom: 0;
}

.table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  padding: 12px 16px;
}

.table td {
  padding: 12px 16px;
  vertical-align: middle;
  color: #2c3e50;
}

.table tbody tr {
  transition: all 0.3s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Badge styles */
.badge {
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #000;
}

.bg-info {
  background-color: #17a2b8 !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-link {
  color: #007bff;
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #0056b3;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
}

/* Modal styles */
.modal-content {
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 20px 24px;
}

.modal-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 16px 24px;
}

/* Action button styles */
.btn-group .btn {
  margin: 0 2px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 14px;
}

.btn-info {
  background-color: #17a2b8;
  border: none;
  color: #fff;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Order detail specific styles */
.modal-xl {
  max-width: 1140px;
}

.modal-body strong {
  color: #495057;
}

/* Custom scrollbar for table responsive */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
