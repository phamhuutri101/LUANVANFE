<template>
  <div class="shop-registration-form">
    <h2 class="form-title">Trở thành người bán</h2>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="shop-name" class="label">Tên shop</label>
        <input
          type="text"
          id="shop-name"
          v-model="shopName"
          required
          class="input"
        />

        <label for="shop-type" class="label">Bạn muốn bán ngành hàng nào</label>
        <select id="shop-type" v-model="shopType" class="select" required>
          <option disabled value="">Chọn ngành hàng</option>
          <option
            v-for="type in listType"
            :key="type._id"
            :value="type.TYPE_PRODUCT"
          >
            {{ type.TYPE_PRODUCT }}
          </option>
        </select>
      </div>
      <button type="submit" class="submit-btn">Đăng ký bán hàng</button>
    </form>
  </div>
</template>

<script>
import shopServices from "@/services/shop.services";
import typeProductServices from "@/services/typeProduct.services";
import Swal from "sweetalert2";
shopServices;
export default {
  name: "CreateShopView",
  data() {
    return {
      shopName: "",
      shopType: "",
      listType: [],
    };
  },
  async created() {
    await this.checkShopActive();
    await this.getListType();
  },
  methods: {
    async getListType() {
      const response = await typeProductServices.getAll();
      if (response && response.data) {
        this.listType = response.data;
      }
    },
    async checkShopActive() {
      try {
        const response = await shopServices.checkActiveShop();

        if (response.data === "active") {
          this.$router.push("/admin/ProductManagement");
        } else if (response.data === "nonActive") {
          const result = await Swal.fire({
            title: "Tài khoản đang đợi xác nhận từ Admin",
            icon: "error",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            this.$router.push("/");
          }
        } else if (response.data === "undefined") {
          this.$router.push("/create-shop");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async submitForm() {
      try {
        const response = await shopServices.checkTimeActive({
          name_shop: this.shopName,
          desc_shop: this.shopType,
        });
        console.log(this.shopType);
        if (response.success === true) {
          const result = await Swal.fire({
            title: "Bạn đã gửi đăng ký mở tài khoản người bán thành công ",

            icon: "success",

            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            this.$router.push("/create-shop");
            this.checkShopActive();
          }
        } else {
          Swal.fire({
            icon: "error",
            title: response.message, // Lấy thông báo lỗi từ API
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title:
            "Tài khoản phải kích hoạt ít nhất 1 ngày mới được đăng ký người bán.",
        });
      }
    },
  },
};
</script>

<style scoped>
.shop-registration-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: 100vh;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input,
.textarea,
.select {
  padding: 14px 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus,
.textarea:focus,
.select:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 16px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}
</style>
