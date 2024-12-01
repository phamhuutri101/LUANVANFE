<template>
  <div class="dashboard-container">
    <div class="d-flex justify-content-end">
      <h5 class="dashboard-title-shop">
        <span class="title-icon"></span>
        Xin chào {{ shopName }}
      </h5>
    </div>
    <h1 class="dashboard-title">
      <span class="title-icon"><i class="fas fa-chart-pie"></i></span>
      Tổng quan cửa hàng
    </h1>
    <div class="dashboard-charts pb-5">
      <!-- Bar Chart -->
      <div class="chart-container">
        <canvas id="statsBarChart"></canvas>
      </div>

      <!-- Line Chart -->
      <div class="chart-container">
        <canvas id="revenueLineChart"></canvas>
      </div>
    </div>
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
      <div
        class="dashboard-box monthly-box animate__animated animate__fadeIn animate__delay-3s"
      >
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Lợi nhuận trong ngày</h3>
            <p class="box-value">{{ formatPrice(orderProfitInDay) }}</p>
          </div>
        </div>
      </div>
      <div
        class="dashboard-box monthly-box animate__animated animate__fadeIn animate__delay-3s"
      >
        <div class="box-content">
          <div class="box-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="box-info">
            <h3 class="box-label">Tổng Lợi nhuận</h3>
            <p class="box-value">{{ formatPrice(TotalOrderProfit) }}</p>
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
// Script section
// Cập nhật phần script
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import shopServices from "@/services/shop.services";
import Chart from "chart.js/auto";
import { formatNumber } from "@/utils/formatNumber";

export default {
  name: "DashboardOverview",
  data() {
    return {
      orderInDay: [],
      priceInDay: 0,
      priceInMonth: 0,
      totalProduct: 0,
      shopName: "",
      orderProfitInDay: 0,
      TotalOrderProfit: 0,
      barChart: null,
      lineChart: null,
      chartData: {
        loaded: false,
        error: null,
      },
    };
  },

  methods: {
    formatPrice(price) {
      return formatNumber(Number(price) || 0);
    },

    async fetchData() {
      try {
        // Fetch all data
        const [
          orderResponse,
          priceInDayResponse,
          totalProductResponse,
          priceInMonthResponse,
          shopNameResponse,
          profitInDayResponse,
          totalProfitResponse,
        ] = await Promise.all([
          orderServices.getOrderInDay(),
          orderServices.getOrderPriceInDay(),
          productServices.getTotalProductShopper(),
          orderServices.getOrderPriceInMonth(),
          shopServices.getNameShopByAccountIdShopper(),
          orderServices.getOrderProfitInDay(),
          orderServices.getTotalOrderProfit(),
        ]);

        // Update state
        this.orderInDay = orderResponse.data || [];
        this.priceInDay = Number(priceInDayResponse.data) || 0;
        this.totalProduct = Number(totalProductResponse.data) || 0;
        this.priceInMonth =
          Number(priceInMonthResponse.data?.totalOrderPrice) || 0;
        this.shopName = shopNameResponse.data || "";
        this.orderProfitInDay =
          Number(profitInDayResponse.data?.totalProfit) || 0;
        this.TotalOrderProfit =
          Number(totalProfitResponse.data?.totalProfit) || 0;

        this.chartData.loaded = true;

        // Initialize charts after data is loaded and DOM is updated
        this.$nextTick(() => {
          this.initializeCharts();
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        this.chartData.error = error;
      }
    },

    initializeCharts() {
      if (!this.chartData.loaded) return;

      this.initBarChart();
      this.initLineChart();
    },

    initBarChart() {
      const canvas = document.getElementById("statsBarChart");
      if (!canvas) {
        console.error("Bar chart canvas not found");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get 2d context for bar chart");
        return;
      }

      if (this.barChart) {
        this.barChart.destroy();
      }

      const data = [this.orderProfitInDay, this.TotalOrderProfit];

      this.barChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Lợi nhuận ngày", "Tổng lợi nhuận"],
          datasets: [
            {
              label: "Thống kê cửa hàng",
              data: data,
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(59, 130, 246, 0.8)",
              ],
              borderColor: [
                "rgb(99, 102, 241)",
                "rgb(245, 158, 11)",
                "rgb(16, 185, 129)",
                "rgb(59, 130, 246)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Thống kê tổng quan cửa hàng",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return formatNumber(value);
                },
              },
            },
          },
        },
      });
    },

    initLineChart() {
      const canvas = document.getElementById("revenueLineChart");
      if (!canvas) {
        console.error("Line chart canvas not found");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get 2d context for line chart");
        return;
      }

      if (this.lineChart) {
        this.lineChart.destroy();
      }

      this.lineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Doanh thu ngày", "Doanh thu tháng"],
          datasets: [
            {
              label: "Doanh thu",
              data: [this.priceInDay, this.priceInMonth],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Biểu đồ doanh thu",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return formatNumber(value);
                },
              },
            },
          },
        },
      });
    },
  },

  mounted() {
    this.fetchData();
  },

  beforeUnmount() {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
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
.dashboard-title-shop {
  font-size: 22px;
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
/* chart */
.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.chart-container {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 400px;
}

@media (min-width: 1024px) {
  .dashboard-charts {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
