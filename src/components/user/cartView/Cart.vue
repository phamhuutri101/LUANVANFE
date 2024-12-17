<template>
  <div class="container pt-3">
    <div class="row" v-if="cart.length > 0">
      <div class="col-9 height-cart">
        <div class="detail-product" v-for="item in cart" :key="item._id">
          <div class="name-shop">
            <p>
              {{ item.shopName }}
            </p>
          </div>
          <div
            class="product d-flex justify-content-between align-items-center"
          >
            <div class="img-product">
              <img
                :src="
                  item.ITEM.PRODUCT_DETAILS.LIST_FILE_ATTACHMENT_DEFAULT[0]
                    .FILE_URL
                "
                alt="Product Image"
              />
            </div>
            <div class="name-product">
              <span>{{ item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT }}</span>
            </div>
            <div class="key-value">
              <div
                v-for="detail in item.ITEM.LIST_MATCH_KEY"
                :key="detail._id"
                class="d-flex"
              >
                <div class="key">
                  <span>{{ detail.KEY }}:</span>
                </div>
                <div class="value">
                  <span>{{ detail.VALUE }}</span>
                </div>
              </div>
            </div>

            <div class="price">
              <span>{{ formatPriceCart(item.ITEM.PRICE) }}</span>
            </div>
            <div class="number">
              <button
                class="number-reduce"
                @click="
                  updateNumberCartMinus(
                    item.ITEM.ID_PRODUCT,
                    item.ITEM._id,
                    item.ITEM.QUANTITY - 1,
                    item.ITEM._id
                  )
                "
              >
                -
              </button>
              <span class="number-product"
                ><input type="text" :value="item.ITEM.QUANTITY"
              /></span>
              <button
                class="number-increase"
                @click="
                  updateNumberCartPlus(
                    item.ITEM.ID_PRODUCT,
                    item.ITEM._id,
                    item.ITEM.QUANTITY + 1,
                    item.ITEM._id
                  )
                "
              >
                +
              </button>
            </div>
            <div class="total">
              <span
                >{{
                  formatPriceCart(
                    totalPriceCart(item.ITEM.PRICE, item.ITEM.QUANTITY)
                  )
                }}
              </span>
            </div>
            <button
              @click="deleteCart(item.ITEM._id)"
              class="bg-danger text-white"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="bill">
          <div class="title-bill">
            <span class="title">Giỏ Hàng</span>
            <div class="row title-body">
              <div class="col-6">
                <span class="title-body-text">Số lượng</span>
              </div>
              <div class="col-6 text-end">
                <span>{{ calculateTotalNumber() }}</span>
              </div>
            </div>
            <div class="row pb-3">
              <div class="col-6">
                <span class="title-body-text">Tạm tính</span>
              </div>
              <div class="col-6 text-end">
                <span>{{ formatPriceCart(calculateTotalPrice()) }}</span>
              </div>
            </div>
          </div>
          <div class="body-bill">
            <div class="discount">
              <input
                type="text"
                class="input-discount w-100"
                placeholder="Nhập mã giảm giá"
                v-model="promoCode"
              />
              <button
                @click="applyPromoCode"
                class="btn discount-bottom mt-2 w-100"
              >
                Áp dụng mã
              </button>
              <div class="row py-3">
                <div class="col-6">
                  <span class="discount-text">Tổng giảm giá</span>
                </div>
                <div class="col-6 text-end">
                  <span>{{ formatPriceCart(payloadUpdate.priceReduce) }}</span>
                </div>
              </div>
              <div class="row py-3">
                <div class="col-6">
                  <span class="discount-text">Phí vận chuyển</span>
                </div>
                <div class="col-6 text-end">
                  <span>{{ formatPriceCart(calculateShipping()) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-bill">
            <div class="row py-3">
              <div class="col-6">
                <span class="footer-bill-text">Tổng tiền</span>
              </div>
              <div class="col-6 text-end">
                <span class="footer-bill-price">{{
                  formatPriceCart(finalTotalPrice())
                }}</span>
              </div>
            </div>

            <button @click="SwitchToOrder()" class="buy" type="submit">
              Mua hàng
            </button>
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
    <div class="img_empty" v-else>
      <img src="../../../../public/img/empty_shop/cart-empty.png" alt="" />
      <p class="text-center">Không có sản phẩm nào trong giỏ hàng</p>
    </div>
  </div>
</template>

<script>
import cartServices from "@/services/cart.services";
import Swal from "sweetalert2";
import { formatNumber } from "@/utils/formatNumber";
import promoServices from "@/services/promoServices";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import shopServices from "@/services/shop.services";
export default {
  components: {
    VPagination,
  },
  data() {
    return {
      cart: [],
      promoCode: "", // Biến lưu mã giảm giá
      page: 1,
      limit: 10,
      currentMaxPage: 1,
      payloadUpdate: {
        priceReduce: 0,
        shipping: 0,
      },
    };
  },
  async created() {
    await this.getCart();
  },
  methods: {
    async getNameShopByAccountId(id_account) {
      const response = await shopServices.getNameShopByAccountId(id_account);
      if (response && response.data) {
        // Lưu tên shop vào biến tương ứng trong cart
        return response.data;
      }
      return ""; // Trả về chuỗi rỗng nếu không có kết quả
    },
    async getCart() {
      const response = await cartServices.getCart(this.page, this.limit);
      if (response && response.data.length > 0) {
        this.cart = response.data;
        if (this.cart.length < this.limit) {
          this.hasMorePages = false;
          this.currentMaxPage = this.page;
        }
        // Nếu đang ở trang cuối cùng đã biết và vẫn có đủ số sản phẩm
        else if (this.page >= this.currentMaxPage) {
          this.hasMorePages = true;
          this.currentMaxPage = this.page + 1;
        }
        this.updateCartCount();
        // Gọi getNameShopByAccountId cho mỗi sản phẩm trong giỏ hàng và lưu tên shop vào cart
        for (let item of this.cart) {
          item.shopName = await this.getNameShopByAccountId(
            item.ITEM.PRODUCT_DETAILS.ACCOUNT__ID
          );
        }
      } else {
        console.error("không có sản phẩm nào trong giỏ hàng");
      }
    },
    updateCartCount() {
      // Hàm cập nhật sessionStorage cho số lượng sản phẩm trong giỏ
      sessionStorage.setItem("NumberCart", this.cart.length);
    },
    totalPriceCart(price, quantity) {
      let total = 0;

      total += price * quantity;

      return total;
    },
    async updateNumberCartPlus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = this.cart.findIndex(
          (item) => item.ITEM._id === item_id
        );
        if (itemIndex !== -1) {
          const productInCart = this.cart[itemIndex];

          // Kiểm tra nếu số lượng mới vượt quá số lượng sản phẩm trong kho
          if (newNumber > productInCart.ITEM.NUMBER_PRODUCT) {
            Swal.fire({
              icon: "error",
              title: "Số lượng vượt quá số lượng trong kho",
              text: `Sản phẩm này chỉ còn ${productInCart.ITEM.NUMBER_PRODUCT} trong kho.`,
            });
            return;
          }

          const response = await cartServices.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });

          if (response && response.success) {
            // Cập nhật số lượng trong giỏ hàng cục bộ
            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartServices.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
                this.updateCartCount();
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updateNumberCartMinus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        if (newNumber >= 0) {
          const response = await cartServices.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });
          this.updateCartCount();
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === item_id
            );

            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartServices.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
                await this.$store.dispatch("fetchCartItemCount"); // Cập nhật số lượng sản phẩm trong giỏ hàng
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCart(id) {
      try {
        const result = await Swal.fire({
          title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });

        if (result.isConfirmed) {
          const response = await cartServices.deleteCart(id);
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === id
            );
            if (itemIndex !== -1) {
              this.cart.splice(itemIndex, 1);
              await this.$store.dispatch("fetchCartItemCount");
            }
            this.updateCartCount();
          } else {
            console.error("Xóa giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async applyPromoCode() {
      try {
        if (this.promoCode.trim() === "") {
          Swal.fire("Vui lòng nhập mã giảm giá", "", "warning");
          return;
        }

        const response = await promoServices.checkPromoCode({
          code: this.promoCode,
          orderTotal: this.calculateTotalPrice(),
        });

        if (response && response.success) {
          this.payloadUpdate.priceReduce = response.discount; // Cập nhật số tiền giảm giá
          Swal.fire("Áp dụng mã thành công!", "", "success");
        } else {
          this.payloadUpdate.priceReduce = 0;
          Swal.fire("Mã giảm giá không hợp lệ hoặc đã hết hạn", "", "error");
        }
      } catch (error) {
        console.error("Lỗi khi áp dụng mã giảm giá:", error);
        Swal.fire("Có lỗi xảy ra", "", "error");
      }
    },
    finalTotalPrice() {
      // Tổng giá sau khi áp dụng giảm giá
      const total =
        this.calculateTotalPrice() -
        this.payloadUpdate.priceReduce +
        this.payloadUpdate.shipping;
      sessionStorage.setItem("priceTotalCart", total);
      sessionStorage.setItem("priceReduce", this.payloadUpdate.priceReduce);
      return total;
    },
    calculateTotalPrice() {
      const total = this.cart.reduce((total, item) => {
        return total + item.ITEM.PRICE * item.ITEM.QUANTITY; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
      sessionStorage.setItem("totalNumberPrice", total);
      return total;
    },
    calculateShipping() {
      const totalPrice = this.calculateTotalPrice(); // Thay vì gọi this.calculateShipping()

      if (totalPrice > 500000) {
        this.payloadUpdate.shipping = (totalPrice * 5) / 100; // Chỉ trả về phí ship
        sessionStorage.setItem("shipping", this.payloadUpdate.shipping);
        return this.payloadUpdate.shipping;
      } else {
        this.payloadUpdate.shipping = (totalPrice * 10) / 100; // Chỉ trả về phí ship
        sessionStorage.setItem("shipping", this.payloadUpdate.shipping);
        return this.payloadUpdate.shipping;
      }
    },
    calculateTotalNumber() {
      const total = this.cart.reduce((total, item) => {
        return total + item.ITEM.QUANTITY;
      }, 0);
      sessionStorage.setItem("totalNumberProduct", total);
      return total;
    },
    formatPriceCart(price) {
      return formatNumber(price);
    },
    async SwitchToOrder() {
      await cartServices.updatePriceReducedAndShipping(this.payloadUpdate);
      this.$router.push("/checkout");
    },
    async onPageChange(newPage) {
      this.page = newPage;
      await this.getCart();
    },
  },
};
</script>

<style scoped>
/* Styles cũ giữ nguyên */
.background {
  background-color: #f5f5f5;
}
.container {
  min-height: 100vh;
  padding-bottom: 2rem;
}
.img-product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.img-product img:hover {
  transform: scale(1.05);
}

.name-shop {
  font-size: 18px;
  border-bottom: solid 1px #ededed;
  padding: 12px 0;
  font-weight: 600;
  color: #2c3e50;
}

.name-product {
  width: 200px;
  overflow: hidden;
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.87);
}

.product {
  padding: 15px 0;
  transition: background-color 0.3s;
}

.product:hover {
  background-color: #f8f9fa;
}

.number {
  display: flex;
  align-items: center;
  gap: 5px;
}

.number button {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  width: 32px;
  height: 32px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.number button:hover {
  background-color: #09884d;
  color: white;
}

.number-product input {
  width: 50px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.detail-product {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.detail-product:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.bill {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 20px;
}

.title-bill,
.discount {
  border-bottom: 2px dashed #e0e0e0;
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.title-bill .title {
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.title-body {
  padding: 12px 0;
}

.title-body-text,
.discount-text {
  color: #666;
  font-size: 16px;
  font-weight: 400;
}

.input-discount {
  border: 2px dashed #e78438;
  background: #fdf2eb;
  height: 40px;
  border-radius: 6px;
  padding: 0 15px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-discount:hover {
  border-color: #d97326;
}

.input-discount::placeholder {
  color: #e88438;
  font-size: 14px;
}

.input-discount:focus {
  outline: none;
  border: 2px dashed #d97326;
  box-shadow: 0 0 0 3px rgba(231, 132, 56, 0.1);
}

.discount-bottom {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #e78438;
  font-weight: 600;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s;
}

.discount-bottom:hover {
  background: #e78438;
  color: white;
  border-color: #e78438;
}

.footer-bill-text {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  height: 100%;
}

.footer-bill-price {
  font-size: 24px;
  font-weight: 700;
  color: #09884d;
}

.buy {
  background-color: #09884d;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.buy:hover {
  background-color: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.2);
}

.buy:active {
  transform: translateY(0);
}

.img_empty {
  min-height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.img_empty img {
  max-width: 500px;
  width: 100%;
  height: auto;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.img_empty img:hover {
  opacity: 1;
}

.img_empty p {
  margin-top: 20px;
  color: #666;
  font-size: 18px;
  font-weight: 500;
}

.price,
.total {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.key-value {
  padding: 0 15px;
}

.key-value .key {
  color: #666;
  margin-right: 8px;
  font-weight: 500;
}

.key-value .value {
  color: #2c3e50;
  font-weight: 600;
}

.height-cart {
  min-height: 400px;
}

/* Thêm animation cho các thay đổi số lượng */
@keyframes quantityChange {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.number-product input:focus {
  animation: quantityChange 0.3s ease;
}
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
</style>
