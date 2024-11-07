<template>
  <div class="discount-management">
    <h2 class="text-2xl font-bold mb-4">Quản lý mã giảm giá</h2>

    <!-- Form thêm mã giảm giá -->
    <div class="bg-white p-6 rounded-lg p-4 shadow mb-4">
      <h3 class="text-lg font-semibold mb-4">Thêm mã giảm giá mới</h3>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Mã giảm giá</label>
          <input
            v-model="newDiscount.code"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Nhập mã giảm giá"
          />
        </div>

        <!-- Loại giảm giá -->
        <div>
          <label class="block text-sm font-medium mb-1">Loại giảm giá</label>
          <div class="flex gap-4 mt-2">
            <label class="flex items-center">
              <input
                v-model="newDiscount.discountType"
                type="radio"
                value="percentage"
                class="mr-2"
              />
              <span>Theo phần trăm</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="newDiscount.discountType"
                type="radio"
                value="fixed"
                class="mr-2"
              />
              <span>Số tiền cố định</span>
            </label>
          </div>
        </div>

        <!-- Giá trị giảm (thay đổi label và placeholder theo loại) -->
        <div>
          <label class="block text-sm font-medium mb-1">
            {{
              newDiscount.discountType === "percentage"
                ? "Phần trăm giảm"
                : "Số tiền giảm"
            }}
          </label>
          <div class="relative" v-if="newDiscount.discountType === 'fixed'">
            <input
              v-model="newDiscount.discountAmount"
              type="number"
              :min="newDiscount.discountType === 'percentage' ? 0 : 1000"
              :max="newDiscount.discountType === 'percentage' ? 100 : null"
              class="w-full p-2 border rounded"
              :placeholder="
                newDiscount.discountType === 'percentage'
                  ? 'Nhập phần trăm giảm (1-100)'
                  : 'Nhập số tiền giảm'
              "
            />
          </div>
          <div class="relative" v-else>
            <input
              v-model="newDiscount.discountPercentage"
              type="number"
              :min="newDiscount.discountType === 'percentage' ? 0 : 1000"
              :max="newDiscount.discountType === 'percentage' ? 100 : null"
              class="w-full p-2 border rounded"
              :placeholder="
                newDiscount.discountType === 'percentage'
                  ? 'Nhập phần trăm giảm (1-100)'
                  : 'Nhập số tiền giảm'
              "
            />
            <span
              v-if="newDiscount.discountType === 'percentage'"
              class="absolute right-3 top-2"
            >
              %
            </span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Ngày hết hạn</label>
          <input
            v-model="newDiscount.to_date"
            type="date"
            class="w-full p-2 border rounded"
            placeholder="Tháng/Ngày/Năm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1"
            >Giá trị đơn tối thiểu</label
          >
          <input
            v-model="newDiscount.minPurchase"
            type="number"
            class="w-full p-2 border rounded"
            placeholder="Nhập giá trị đơn tối thiểu"
          />
        </div>
      </div>

      <button
        @click="addDiscount"
        class="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Thêm mã giảm giá
      </button>
    </div>

    <!-- Danh sách mã giảm giá -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Mã giảm giá</th>
            <th class="px-4 py-3 text-left">Loại giảm giá</th>
            <th class="px-4 py-3 text-left">Giá trị giảm</th>

            <th class="px-4 py-3 text-left">Ngày hết hạn</th>
            <th class="px-4 py-3 text-left">Đơn tối thiểu</th>
            <th class="px-4 py-3 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(discount, index) in discounts"
            :key="index"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-3">{{ discount.CODE }}</td>
            <td class="px-4 py-3" v-if="discount.DISCOUNT_PERCENTAGE">
              Theo %
            </td>
            <td class="px-4 py-3" v-else-if="discount.DISCOUNT_AMOUNT">
              Cố định
            </td>
            <td class="px-4 py-3" v-if="discount.DISCOUNT_PERCENTAGE">
              {{ discount.DISCOUNT_PERCENTAGE }}
            </td>
            <td class="px-4 py-3" v-else-if="discount.DISCOUNT_AMOUNT">
              {{ discount.DISCOUNT_AMOUNT }}
            </td>

            <td class="px-4 py-3">{{ formatDate(discount.TO_DATE) }}</td>
            <td class="px-4 py-3">
              {{ discount.MIN_PURCHASE }}
            </td>
            <td class="px-4 py-3">
              <button
                @click="deletePromo(discount._id)"
                class="text-red-500 hover:text-red-700 transition duration-200"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import promoServices from "@/services/promoServices";
export default {
  name: "DiscountManagement",
  data() {
    return {
      discounts: [],
      newDiscount: {
        code: "",
        discountType: "fixed",
        discountAmount: null,
        discountPercentage: null,
        to_date: "",
        minPurchase: "",
      },
    };
  },
  async created() {
    await this.getAllPromo();
  },
  methods: {
    async getAllPromo() {
      const response = await promoServices.getAllPromo();
      if (response && response.data) {
        this.discounts = response.data;
      }
    },
    async deletePromo(id) {
      const response = await promoServices.deletePromoCode(id);
      if (response && response.data) {
        this.getAllPromo();
      } else {
        alert("Xóa mã giảm giá thất bại");
      }
    },
    async addDiscount() {
      const response = await promoServices.addDiscount(this.newDiscount);
      this.resetForm();
      this.getAllPromo();
    },

    resetForm() {
      this.newDiscount = {
        code: "",
        discountType: "fixed",
        discountValue: "",
        maxDiscountAmount: "",
        to_date: "",
        minPurchase: "",
      };
    },
    validateDiscount() {
      if (!this.newDiscount.code) {
        alert("Vui lòng nhập mã giảm giá");
        return false;
      }
      if (
        !this.newDiscount.discountValue ||
        this.newDiscount.discountValue <= 0
      ) {
        alert("Vui lòng nhập giá trị giảm hợp lệ");
        return false;
      }
      if (
        this.newDiscount.discountType === "percentage" &&
        (this.newDiscount.discountValue > 100 ||
          this.newDiscount.discountValue < 0)
      ) {
        alert("Phần trăm giảm giá phải từ 0-100%");
        return false;
      }
      if (
        this.newDiscount.discountType === "percentage" &&
        (!this.newDiscount.maxDiscountAmount ||
          this.newDiscount.maxDiscountAmount <= 0)
      ) {
        alert("Vui lòng nhập giới hạn số tiền giảm tối đa");
        return false;
      }
      if (!this.newDiscount.to_date) {
        alert("Vui lòng chọn ngày hết hạn");
        return false;
      }
      if (!this.newDiscount.minPurchase || this.newDiscount.minPurchase <= 0) {
        alert("Vui lòng nhập giá trị đơn tối thiểu hợp lệ");
        return false;
      }
      return true;
    },
    formatCurrency(value) {
      if (!value) return "-";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDiscountValue(discount) {
      if (discount.discountType === "percentage") {
        return `${discount.discountValue}%`;
      }
      return this.formatCurrency(discount.discountValue);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
/* Main container with glass morphism effect */
.discount-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(120deg, #f0f7ff 0%, #ffffff 100%);
  min-height: 100vh;
  font-family: "Inter", system-ui, sans-serif;
  position: relative;
  overflow: hidden;
}

.discount-management::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.1),
      transparent 60%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(99, 102, 241, 0.1),
      transparent 60%
    );
  pointer-events: none;
}

/* Modern header styling */
.text-2xl {
  color: #1a237e;
  font-weight: 800;
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.5px;
}

.text-2xl::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6 30%, #818cf8 100%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* Glass morphism card effect */
.bg-white {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.08),
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Improved input fields with neumorphic style */
input[type="text"],
input[type="number"],
input[type="date"] {
  width: 100%;
  padding: 0.875rem 1.125rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.25s ease;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05),
    inset -2px -2px 5px rgba(255, 255, 255, 0.9);
}

input[type="text"]:hover,
input[type="number"]:hover,
input[type="date"]:hover {
  background: #f1f5f9;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="date"]:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1),
    inset 2px 2px 5px rgba(0, 0, 0, 0.02),
    inset -2px -2px 5px rgba(255, 255, 255, 0.9);
}

/* Modern radio button design */
.flex.gap-4 {
  gap: 2.5rem;
}

input[type="radio"] {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  margin-right: 0.75rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

input[type="radio"]:checked {
  border-color: #3b82f6;
  background: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

input[type="radio"]::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 0.5rem;
  height: 0.5rem;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

input[type="radio"]:checked::after {
  transform: translate(-50%, -50%) scale(1);
}

/* Stylish labels */
label.block {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.625rem;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

label.block:hover {
  color: #1e293b;
}

/* Beautiful gradient button */
button.bg-blue-500 {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  letter-spacing: 0.025em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2),
    0 2px 4px -1px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

button.bg-blue-500:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.3),
    0 4px 6px -1px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

button.bg-blue-500:active {
  transform: translateY(0);
}

/* Ripple effect for buttons */
button.bg-blue-500::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(100, 100);
    opacity: 0;
  }
}

button.bg-blue-500:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

/* Modern delete button */
button.text-red-500 {
  color: #dc2626;
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  background: transparent;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

button.text-red-500:hover {
  color: #ffffff;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

/* Enhanced table design */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
}

thead {
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  position: relative;
}

th {
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
  transition: all 0.2s ease;
}

th:hover {
  color: #1e293b;
  background: rgba(241, 245, 249, 0.8);
}

td {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

/* Row animations and hover effects */
tbody tr {
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease forwards;
  position: relative;
}

tbody tr::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

tbody tr:hover::after {
  opacity: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modern form grid layout */
.grid.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

/* Percentage input enhancement */
.relative {
  position: relative;
}

.relative span {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 500;
  pointer-events: none;
}

/* Custom placeholder styling */
input::placeholder {
  color: #94a3b8;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Error and success states with animation */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

input.error {
  border-color: #ef4444;
  animation: shake 0.3s ease;
}

.success-message {
  transform: translateY(-10px);
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
  }
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .discount-management {
    padding: 1.5rem;
  }

  button.bg-blue-500 {
    width: 100%;
    padding: 0.875rem;
  }

  th,
  td {
    padding: 1rem;
  }
}

/* Advanced table features */
tbody tr:hover {
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(4px);
}

tbody tr:hover td {
  color: #1e293b;
  transform: scale(1.01);
}

/* Loading state for button */
button.bg-blue-500.loading {
  position: relative;
  pointer-events: none;
  opacity: 0.8;
}

button.bg-blue-500.loading::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
