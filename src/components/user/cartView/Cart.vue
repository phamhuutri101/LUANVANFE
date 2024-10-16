<template>
  <div class="container pt-3">
    <div class="row" v-if="cart.length > 0">
      <div class="col-9">
        <div class="detail-product" v-for="item in cart" :key="item._id">
          <div class="name-shop">
            <p>Tên shop</p>
          </div>
          <div
            class="product d-flex justify-content-between align-items-center"
          >
            <div class="info-product d-flex">
              <div class="img-product">
                <img src="" alt="" />
              </div>
              <!-- Lặp qua LIST_FILE_ATTACHMENT_DEFAULT để hiển thị hình ảnh -->
              <div
                class="img-product"
                v-for="img in item.ITEM.LIST_FILE_ATTACHMENT_DEFAULT"
                :key="img._id"
              >
                <img :src="img.FILE_URL" alt="Product Image" />
              </div>
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
              <span>{{
                formatPriceCart(
                  totalPriceCart(item.ITEM.PRICE, item.ITEM.QUANTITY)
                )
              }}</span>
            </div>
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
                  <span>{{ formatPriceCart(discountAmount) }}</span>
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
export default {
  data() {
    return {
      cart: [],
      promoCode: "", // Biến lưu mã giảm giá
      discountAmount: 0, // Biến lưu tổng tiền giảm
    };
  },
  async created() {
    await this.getCart();
  },
  methods: {
    async getCart() {
      const response = await cartServices.getCart();
      if (response && response.data.length > 0) {
        this.cart = response.data;
      } else {
        console.error("không có sản phẩm nào trong giỏ hàng");
      }
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
            }
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
        console.log("mã giảm giá trả về", response);
        if (response && response.success) {
          this.discountAmount = response.discount; // Cập nhật số tiền giảm giá
          Swal.fire("Áp dụng mã thành công!", "", "success");
        } else {
          this.discountAmount = 0;
          Swal.fire("Mã giảm giá không hợp lệ", "", "error");
        }
      } catch (error) {
        console.error("Lỗi khi áp dụng mã giảm giá:", error);
        Swal.fire("Có lỗi xảy ra", "", "error");
      }
    },
    finalTotalPrice() {
      // Tổng giá sau khi áp dụng giảm giá
      return this.calculateTotalPrice() - this.discountAmount;
    },
    calculateTotalPrice() {
      return this.cart.reduce((total, item) => {
        return total + item.ITEM.PRICE * item.ITEM.QUANTITY; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
    },
    calculateTotalNumber() {
      return this.cart.reduce((total, item) => {
        return total + item.ITEM.QUANTITY;
      }, 0);
    },
    formatPriceCart(price) {
      return formatNumber(price);
    },
    SwitchToOrder() {
      this.$router.push("/checkout");
    },
  },
};
</script>

<style scoped>
.background {
  background-color: #f5f5f5;
}
.img-product img {
  width: 80px;
  height: 80px;
}
.name-shop {
  font-size: 18px;

  border-bottom: solid 1px #ededed;
}
.name-product {
  width: 200px;
  overflow: hidden;
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.87);
}
.product {
  padding-top: 10px;
}
.number {
  display: flex;
  align-items: center;
}

.number button {
  background-color: #ddd;
  border: none;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.number button:hover {
  background-color: #ccc;
}

.number-product input {
  width: 50px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #ddd;
}
.detail-product {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}
.bill {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
.title-bill,
.discount {
  border-bottom: dashed 1px #c0c0c0;
  margin-bottom: 20px;
}

.title-bill .title {
  font-size: 18px;
  text-transform: capitalize;

  font-weight: 700;
}
.title-body {
  padding: 10px 0;
}
.title-body-text,
.discount-text {
  color: #797979;
  font-size: 16px;
  font-weight: 300;
}

.input-discount {
  border: 1px dashed #e78438;
  background: #fdf2eb;
  height: 35px;
}
.input-discount::placeholder {
  color: #e88438;
  font-size: 14px;
}
.input-discount:focus {
  outline: none;
  border: 1px dashed #e78438;
}
.footer-bill-text {
  font-size: 16px;
  color: #000;
  font-weight: 600;
}
.footer-bill-price {
  font-size: 22px;
  font-weight: 600;
  color: #09884d;
}
.footer-bill-text {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  height: 100%; /* Đảm bảo phần tử có chiều cao đầy đủ của parent */
}
.buy {
  background-color: #09884d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}
.img_empty img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 500px;
}
.discount-bottom:hover {
  background: #f1f1f1;
}
</style>
