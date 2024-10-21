<template>
  <div class="container">
    <div class="row py-3">
      <div class="col-4 voucher" v-for="item in voucher" :key="item._id">
        <img
          class="img-voucher"
          src="../../../../public/img/vouccher/layer.a5197a75187403484ba2.png"
          alt=""
        />
        <div class="voucher-text">
          <span v-if="item.DISCOUNT_AMOUNT" class="fw-bold"
            >VOUCHER {{ formatNumber(item.DISCOUNT_AMOUNT) }}</span
          >
          <span v-if="item.DISCOUNT_PERCENTAGE" class="fw-bold"
            >VOUCHER {{ item.DISCOUNT_PERCENTAGE }}%</span
          >
          <br />
          <span>cho đơn từ {{ formatNumber(item.MIN_PURCHASE) }}</span> <br />
          <button
            @click="copyToClipboard(item.CODE)"
            class="button-copy-code mt-2"
          >
            Copy mã
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import voucherServices from "@/services/voucher.services";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      voucher: [],
    };
  },
  async created() {
    await this.getVoucher();
  },
  methods: {
    async getVoucher() {
      try {
        const response = await voucherServices.getAllVouchers();
        this.voucher = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    copyToClipboard(code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          Swal.fire({
            title: "Lưu voucher thành công!",
            icon: "success",
          });
        })
        .catch((err) => {
          console.error("Lỗi khi sao chép mã: ", err);
        });
    },
    formatNumber(number) {
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
  },
};
</script>

<style scoped>
.voucher {
  position: relative;
}

.img-voucher {
  width: 90%;
  height: auto;
  object-fit: cover;
  display: block;
}

.voucher-text {
  position: absolute;
  top: 50%; /* Canh giữa theo chiều dọc */
  left: 55%; /* Canh giữa theo chiều ngang */
  transform: translate(-50%, -50%); /* Đảm bảo text nằm chính giữa */
  width: 100%; /* Đảm bảo chiều rộng là 100% của phần tử cha */
  text-align: center; /* Căn giữa text */
  color: white; /* Đổi màu text để dễ nhìn hơn trên nền */

  padding: 10px; /* Khoảng cách giữa text và các cạnh */
  box-sizing: border-box;
}
.button-copy-code {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 700;
}
.button-copy-code:hover {
  background: #000;
  color: #fff;
  transition: background 0.7s ease-in-out;
}
</style>
