<template>
  <div class="container">
    <div class="product">
      <div class="header pb-4 d-flex justify-content-between">
        <h4>Quản lý sản phẩm</h4>
      </div>

      <div class="top-product">
        <div class="row">
          <div class="col-3 text-center">Thông tin sản phẩm</div>
          <div class="col-3 text-center">Giá</div>
          <div class="col-3 text-center">Kho</div>
          <div class="col-3 text-center">Thao tác</div>
        </div>
      </div>
      <div class="bottom-product">
        <div
          class="row border-bottom py-3"
          v-for="item in products"
          :key="item._id"
        >
          <div class="col-3 text-start">
            <img
              :src="item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
              alt=""
              class="img-product"
            />

            <span class="px-2">{{ truncateName(item.NAME_PRODUCT) }}</span>
          </div>
          <div class="col-3 text-center">
            {{
              getPrice(item._id).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }}
          </div>
          <div class="col-3 text-center">
            {{ item.NUMBER_INVENTORY_PRODUCT }}
          </div>
          <div class="col-3 text-center">
            <i class="fa-solid fa-pen-to-square"></i> |
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
import PriceService from "@/services/price.services";
import productServices from "@/services/product.services";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
export default {
  components: {
    VPagination,
  },
  data() {
    return {
      prices: [],
      products: [],
      page: 1,
      limit: 5,
      currentMaxPage: 1, // Số trang tối đa đã biết
      hasMorePages: true, // Flag kiểm tra còn trang tiếp không
    };
  },
  created() {
    this.getProduct();
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
          await this.getPriceProduct();
        }
      } catch (error) {
        console.error(error);
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
    async getPriceProduct() {
      try {
        // Kiểm tra nếu this.products là một mảng
        if (Array.isArray(this.products)) {
          const prices = {};
          for (const product of this.products) {
            const response = await PriceService.getDefaultPrice(product._id);
            if (response && response.data && response.data[0]) {
              prices[product._id] = response.data[0].PRICE_NUMBER;
            } else {
              console.error("Unexpected response structure:", response);
            }
          }
          this.prices = prices; // Cập nhật trạng thái `prices`
        } else {
          console.error("products is not an array:", this.products);
        }
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    getPrice(productId) {
      const price = this.prices[productId];
      if (price) {
        return price;
      } else {
        return "Đang cập nhật giá";
      }
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
        await productServices.deleteProduct(productId);
        // Nếu xóa sản phẩm cuối cùng của trang
        if (this.products.length === 1 && this.page > 1) {
          this.page--; // Quay lại trang trước
        }
        await this.getProduct();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
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
</style>
