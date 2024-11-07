<template>
  <div class="order-history">
    <h2 class="page-title">Lịch sử đơn hàng</h2>

    <div class="filter-section">
      <select v-model="statusFilter" class="filter-select">
        <option value="">Tất cả trạng thái</option>
        <option
          v-for="status in orderStatuses"
          :key="status.value"
          :value="status.value"
        >
          {{ status.label }}
        </option>
      </select>
    </div>

    <div class="table-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="order-id">#{{ order.id }}</td>
            <td>{{ formatDate(order.date) }}</td>
            <td>
              <div class="product-list">
                <div
                  v-for="product in order.products"
                  :key="product.id"
                  class="product-item"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="product-image"
                  />
                  <div class="product-details">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-quantity"
                      >x{{ product.quantity }}</span
                    >
                  </div>
                </div>
              </div>
            </td>
            <td class="order-total">{{ formatPrice(order.total) }}đ</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td>
              <button class="view-btn" @click="viewOrderDetails(order.id)">
                <i class="fas fa-eye"></i> Chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusFilter: "",
      orderStatuses: [
        { value: "pending", label: "Chờ xác nhận" },
        { value: "confirmed", label: "Đã xác nhận" },
        { value: "shipping", label: "Đang giao hàng" },
        { value: "delivered", label: "Đã giao hàng" },
        { value: "cancelled", label: "Đã hủy" },
      ],
      orders: [
        {
          id: "1001",
          date: "2024-03-20",
          products: [
            {
              id: 1,
              name: "Áo thun nam",
              quantity: 2,
              image: "/api/placeholder/50/50",
            },
          ],
          total: 500000,
          status: "delivered",
        },
        {
          id: "1002",
          date: "2024-03-21",
          products: [
            {
              id: 2,
              name: "Quần jean",
              quantity: 1,
              image: "/api/placeholder/50/50",
            },
          ],
          total: 750000,
          status: "shipping",
        },
      ],
    };
  },
  computed: {
    filteredOrders() {
      return this.statusFilter
        ? this.orders.filter((order) => order.status === this.statusFilter)
        : this.orders;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    formatPrice(price) {
      return price.toLocaleString("vi-VN");
    },
    getStatusLabel(status) {
      const statusObj = this.orderStatuses.find((s) => s.value === status);
      return statusObj ? statusObj.label : status;
    },
    viewOrderDetails(orderId) {
      console.log("Viewing order:", orderId);
      // Implement navigation to order details
    },
  },
};
</script>

<style scoped>
.order-history {
  padding: 2rem;
}

.page-title {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.order-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
}

.product-quantity {
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #cce5ff;
  color: #004085;
}

.status-badge.shipping {
  background: #d4edda;
  color: #155724;
}

.status-badge.delivered {
  background: #d1e7dd;
  color: #0f5132;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-btn:hover {
  background: #2980b9;
}

.order-total {
  font-weight: 600;
  color: #2c3e50;
}

.order-id {
  font-family: monospace;
  font-weight: 600;
}

@media (max-width: 768px) {
  .order-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
