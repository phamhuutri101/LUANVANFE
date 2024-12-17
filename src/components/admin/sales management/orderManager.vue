<template>
  <div class="container">
    <!-- modal hủy đơn -->
    <div
      class="modal fade"
      id="cancelOrder"
      tabindex="-1"
      aria-labelledby="cancelOrderLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="cancelOrderLabel">Hủy đơn hàng</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label for="color" class="form-label">Lý do hủy đơn</label>
            <input
              type="text"
              class="form-control"
              placeholder="Viết lý do hủy đơn cho khách hàng"
              v-model="payloadCancelOrder.content_cancel"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
            <button
              @click="cancelOrder()"
              type="button"
              class="btn btn-primary"
            >
              Hủy đơn
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal hủy đơn -->
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý đơn hàng</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="getOrder">
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

              <option value="1">Chờ xác nhận</option>

              <option value="4">đã gửi hàng</option>

              <option value="6">đã nhận hàng</option>
              <option value="7">đã hủy</option>
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
                <th>Lợi nhuận</th>
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
                    <button
                      v-if="getLatestStatus(order) === 7"
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
                    <button
                      v-if="getLatestStatus(order) < 4"
                      class="btn btn-sm btn-status btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#cancelOrder"
                      @click="getIdOrderCancelOrder(order._id)"
                    >
                      Hủy đơn hàng
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
                    <button
                      v-if="getLatestStatus(order) === 7"
                      class="btn btn-sm btn-status btn-success"
                      disabled
                    >
                      Đơn hàng đã hủy
                    </button>
                  </div>
                </td>
                <td v-if="getLatestStatus(order) === 6">
                  {{ formatPrice(order.ORDER_PROFIT) }}
                </td>
                <td v-else>0đ</td>
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
                  <td>
                    {{ productNames[item.ID_PRODUCT] || "Loading..." }}
                    <div v-for="KV in item.LIST_MATCH_KEY" :key="KV">
                      <span>{{ KV.KEY }}</span> - <span>{{ KV.VALUE }}</span>
                    </div>
                  </td>
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
      payloadCancelOrder: {
        id_order: "",
        content_cancel: "",
      },
      orders: [],
      originalOrders: [],
      selectedOrder: null,
      page: 1,
      limit: 20,
      currentMaxPage: 1, // Số trang tối đa đã biết
      orderDetailModal: null,
      totalOrderProfit: "",
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
    this.getTotalOrderProfit();
  },

  methods: {
    async getOrder() {
      const response = await orderServices.getShopOrder(this.page, this.limit);
      this.orders = response.data;
      this.orders.sort(
        (a, b) => new Date(b.TIME_PAYMENT) - new Date(a.TIME_PAYMENT)
      );
      // Determine if we are on the last page by checking if we received fewer items than `limit`
      if (this.orders.length < this.limit) {
        this.currentMaxPage = this.page;
      } else {
        // Set currentMaxPage to allow for another page
        this.currentMaxPage = this.page + 1;
      }
      for (const item of this.orders) {
        const response = await userServices.getUserByAccountId(
          item.ACCOUNT__ID
        );
        if (response && response.data) {
          const user = response.data[0];
          item.FULL_NAME = user.user.FULL_NAME;
        }
        const OrderProfit = await orderServices.calculateOrderProfit(item._id);
        if (OrderProfit && OrderProfit.success == true) {
          item.ORDER_PROFIT = OrderProfit.data.profit;
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
        6: "Hoàn thành ",
        7: "Đã hủy",
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
      if (this.filters.startDate || this.filters.endDate) {
        const startDate = this.filters.startDate
          ? new Date(this.filters.startDate).setHours(0, 0, 0, 0)
          : null;
        const endDate = this.filters.endDate
          ? new Date(this.filters.endDate).setHours(23, 59, 59, 999)
          : null;

        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.LIST_STATUS?.[0]?.FROM_DATE); // Dùng ngày từ trạng thái đầu tiên
          if (startDate && endDate) {
            return orderDate >= startDate && orderDate <= endDate;
          } else if (startDate) {
            return orderDate >= startDate;
          } else if (endDate) {
            return orderDate <= endDate;
          }
          return true; // Không lọc nếu không có ngày
        });
      }

      // Cập nhật danh sách hiển thị
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

    onPageChange(newPage) {
      this.page = newPage;
      this.getOrder();
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
    async getTotalOrderProfit() {
      const result = await orderServices.getTotalOrderProfit();
      if (result && result.data) {
        this.totalOrderProfit = result.data.totalProfit;
      }
    },
    getIdOrderCancelOrder(id) {
      this.payloadCancelOrder.id_order = id;
      console.log(this.payloadCancelOrder);
    },
    async cancelOrder() {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn hủy đơn hàng ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`,
      });
      if (result.isConfirmed) {
        await orderServices.cancelOrder(this.payloadCancelOrder);
        this.getOrder();
      }
    },
  },
};
</script>

<style scoped>
.totalProfit {
  padding: 20px;
  border: 1px solid black;
}
/* Main container styles */
.container {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Header styles */
.mb-4 h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2:before {
  content: "";
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-radius: 4px;
  margin-right: 0.5rem;
}

/* Button styles */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(99, 102, 241, 0.3);
}

/* Card styles */
.card {
  background: white;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

/* Form controls */
.form-control,
.form-select {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: #f8fafc;
}

.form-control:focus,
.form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

/* Table styles */
.table {
  width: 100%;
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 2px solid #e2e8f0;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
  color: #1a202c;
  border-bottom: 1px solid #e2e8f0;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
}

/* Status badges */
.badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.bg-warning {
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  color: white;
}

.bg-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.bg-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.bg-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

/* Action buttons */
.btn-group {
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-status {
  min-width: 120px;
  text-align: center;
  justify-content: center;
  font-weight: 500;
}

/* Modal styles */
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem 1rem 0 0;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 0 0 1rem 1rem;
}

.modal-title {
  color: #1a202c;
  font-weight: 600;
}

/* Pagination styles */
.VPagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.VPagination button {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s ease;
}

.VPagination button:hover {
  background: #f8fafc;
  border-color: #6366f1;
}

.VPagination button.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

/* Animation classes */
.animate__animated {
  animation-duration: 0.5s;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .table thead {
    display: none;
  }

  .table tbody td {
    display: block;
    text-align: right;
    padding: 0.75rem;
    border: none;
  }

  .table tbody td:before {
    content: attr(data-label);
    float: left;
    font-weight: 600;
    color: #4a5568;
  }

  .btn-group {
    justify-content: flex-end;
  }
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
