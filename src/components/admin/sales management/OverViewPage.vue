<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">
      <span class="title-icon"><i class="fas fa-chart-pie"></i></span>
      Tổng quan cửa hàng
    </h1>

    <div class="dashboard-grid">
      <!-- Sản phẩm -->
      <div class="dashboard-box product-box animate__animated animate__fadeIn">
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Tổng sản phẩm</h3>
            <p class="box-value">{{ totalProduct || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Doanh thu ngày -->
      <div
        class="dashboard-box revenue-box animate__animated animate__fadeIn animate__delay-1s"
      >
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Số tiền giao dịch trong ngày</h3>
            <p class="box-value">{{ formatPrice(priceInDay) }}</p>
          </div>
        </div>
      </div>

      <!-- Đơn hàng -->
      <div
        class="dashboard-box order-box animate__animated animate__fadeIn animate__delay-2s"
      >
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Đơn hàng mới</h3>
            <p class="box-value">{{ orderInDay.length }}</p>
          </div>
        </div>
      </div>

      <!-- Doanh thu tháng -->
      <div
        class="dashboard-box monthly-box animate__animated animate__fadeIn animate__delay-3s"
      >
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Số tiền giao dịch trong tháng</h3>
            <p class="box-value">{{ formatPrice(priceInMonth) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="statistics-section">
   
      <div class="recent-orders-section animate__animated animate__fadeInUp">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-clock"></i> Đơn hàng gần đây
          </h3>
          <div class="section-actions">
            <button class="btn-action">
              <i class="fas fa-filter"></i> Lọc
            </button>
            <button class="btn-action">
              <i class="fas fa-download"></i> Xuất
            </button>
          </div>
        </div>
        <div class="orders-table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in recentOrders"
                :key="index"
                class="order-row"
              >
                <td>
                  <span class="order-code">#{{ order.code }}</span>
                </td>
                <td>
                  <div class="customer-info">
                    <div class="customer-avatar">{{ order.customer[0] }}</div>
                    <span>{{ order.customer }}</span>
                  </div>
                </td>
                <td>{{ order.items }}</td>
                <td class="price-column">{{ order.total }}</td>
                <td>
                  <span :class="['status-badge', order.status]">
                    {{ order.statusText }}
                  </span>
                </td>
                <td>{{ order.time }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="Xem chi tiết">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Chỉnh sửa">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

   
    </div> -->
  </div>
</template>

<script>
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import { formatNumber } from "@/utils/formatNumber";
export default {
  name: "DashboardOverview",
  data() {
    return {
      orderInDay: [],
      priceInDay: "",
      priceInMonth: "",
      totalProduct: "",
      recentOrders: [
        {
          code: "ORD001",
          customer: "Nguyễn Văn A",
          items: "iPhone 14 Pro Max",
          total: "30,990,000₫",
          status: "pending",
          statusText: "Chờ xử lý",
          time: "10:30 AM",
        },
        {
          code: "ORD002",
          customer: "Trần Thị B",
          items: "MacBook Air M2",
          total: "28,990,000₫",
          status: "completed",
          statusText: "Hoàn thành",
          time: "09:15 AM",
        },
        {
          code: "ORD003",
          customer: "Lê Văn C",
          items: "iPad Pro 12.9",
          total: "25,990,000₫",
          status: "processing",
          statusText: "Đang xử lý",
          time: "Yesterday",
        },
        {
          code: "ORD004",
          customer: "Phạm Thị D",
          items: "AirPods Pro 2",
          total: "6,790,000₫",
          status: "completed",
          statusText: "Hoàn thành",
          time: "Yesterday",
        },
      ],
      topProducts: [
        {
          name: "iPhone 14 Pro Max",
          price: "26,990,000₫",
          sold: 150,
          image: "https://placeholder.com/300x300",
        },
        {
          name: "MacBook Pro M2",
          price: "35,990,000₫",
          sold: 89,
          image: "https://placeholder.com/300x300",
        },
        {
          name: "iPad Air 5",
          price: "15,990,000₫",
          sold: 76,
          image: "https://placeholder.com/300x300",
        },
        {
          name: "Apple Watch Series 8",
          price: "10,990,000₫",
          sold: 65,
          image: "https://placeholder.com/300x300",
        },
      ],
    };
  },
  created() {
    this.getOrderInDay();
    this.getPriceInDay();
    this.getTotalProduct();
    this.getPriceInMonth();
  },
  methods: {
    async getOrderInDay() {
      try {
        const response = await orderServices.getOrderInDay();
        if (response && response.data) {
          this.orderInDay = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPriceInDay() {
      try {
        const response = await orderServices.getOrderPriceInDay();
        if (response && response.data) {
          this.priceInDay = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPriceInMonth() {
      try {
        const response = await orderServices.getOrderPriceInMonth();
        if (response && response.data) {
          this.priceInMonth = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getTotalProduct() {
      try {
        const response = await productServices.getTotalProductShopper();
        if (response && response.data) {
          this.totalProduct = response.data;
          console.log(this.totalProduct);
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatPrice(price) {
      const Price = new Number(price);
      return formatNumber(Price);
    },
  },
};
</script>

<style scoped>
dashboard-container {
  padding: 2rem;
  height: 100vh;
  background-color: #f8fafc;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.5rem;
  border-radius: 1rem;
  color: white;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-box {
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.dashboard-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.box-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1.5rem;
}

.box-icon {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.box-icon i {
  font-size: 1.8rem;
  color: white;
}

.box-info {
  flex: 1;
}

.box-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.box-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
}

.box-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.box-trend.positive {
  color: #4ade80;
}

.box-trend.negative {
  color: #f87171;
}

.product-box {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.revenue-box {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.order-box {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.monthly-box {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Thống kê chi tiết */
.statistics-section {
  display: grid;
  gap: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #6366f1;
}

.section-actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  background-color: white;
  color: #4b5563;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-action:hover {
  background-color: #f9fafb;
  color: #1a202c;
}

/* Bảng đơn hàng */
.recent-orders-section {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.orders-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.orders-table th {
  background-color: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #4b5563;
  text-align: left;
}

.order-row {
  background-color: white;
  transition: all 0.2s;
}

.order-row:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
}

.order-row td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.order-code {
  font-weight: 600;
  color: #6366f1;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.price-column {
  font-weight: 600;
  color: #10b981;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.processing {
  background-color: #dbeafe;
  color: #1e40af;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: none;
  background-color: #f8fafc;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #6366f1;
  color: white;
}
</style>
