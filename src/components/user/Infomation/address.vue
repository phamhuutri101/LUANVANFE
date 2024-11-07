<template>
  <div class="col-md-9 background-component background-height p-4">
    <div
      class="header-address d-flex justify-content-between border-bottom py-3"
    >
      <div class="title">Địa chỉ của tôi</div>
      <button
        class="button-address"
        data-bs-toggle="modal"
        data-bs-target="#AddAddressModal"
        @click="resetForm()"
      >
        <i class="fa-solid fa-plus"></i> Thêm địa chỉ mới
      </button>
    </div>
    <div class="body-address py-3">
      <div class="title">Địa chỉ</div>
      <div
        class="content-address d-flex justify-content-between border-bottom py-3"
        v-for="item in addresses"
        :key="item._id"
      >
        <div class="address-main">
          <div class="name-number d-flex py-3">
            <div class="name">{{ item.FULL_NAME }}</div>
            <div class="number border-start">{{ item.PHONE_NUMBER }}</div>
          </div>
          <div class="address">
            <div class="commune">{{ item.DESC }}</div>
            <div class="province">
              {{ item.DISTRICT + " " + item.COMMUNE + " " + item.PROVINCE }}
            </div>
            <div class="default-address" v-if="item.IS_DEFAULT == true">
              Mặc định
            </div>
          </div>
        </div>

        <div class="operation">
          <div class="update-delete d-flex justify-content-end">
            <button
              class="update"
              data-bs-toggle="modal"
              data-bs-target="#UpdateAddressModal"
              @click="getAddressById(item._id)"
            >
              Cập nhật
            </button>
            <div
              class="delete"
              v-if="item.IS_DEFAULT == false"
              @click="deleteAddress(item._id)"
            >
              Xóa
            </div>
          </div>

          <div
            class="is-default"
            @click="setDefaultAddress(item._id)"
            v-if="item.IS_DEFAULT == false"
          >
            Thiết lập mặc định
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- AddAddress Modal -->
  <div
    class="modal fade"
    id="AddAddressModal"
    tabindex="-1"
    aria-labelledby="AddAddressModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="AddAddressModalLabel">
            Địa chỉ mới
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-6 p-3">
              <input type="text" v-model="full_name" placeholder="Họ và tên" />
            </div>
            <div class="col-6 p-3">
              <input
                type="text"
                v-model="phone_number"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Tỉnh/Thành Phố</label>
              <!-- Dropdown chọn tỉnh -->

              <select
                class="form-select country"
                aria-label="Chọn tỉnh"
                v-model="selectedProvince"
                @change="onProvinceChange"
              >
                <option
                  v-for="province in addressAPIProvince"
                  :key="province.code"
                  :value="province.code"
                >
                  {{ province.name }}
                </option>
              </select>
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Quận/Huyện</label>
              <!-- Dropdown chọn huyện -->
              <select
                class="form-select country"
                aria-label="Chọn huyện"
                v-model="selectedDistrict"
                @change="onDistrictChange"
                :disabled="!addressAPIDistrict.length"
              >
                <option
                  v-for="district in addressAPIDistrict"
                  :key="district.code"
                  :value="district.code"
                >
                  {{ district.name }}
                </option>
              </select>
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Xã/Phường</label>
              <!-- Dropdown chọn xã -->
              <select
                class="form-select country"
                aria-label="Chọn xã"
                v-model="selectedCommune"
                :disabled="!addressAPICommune.length"
              >
                <option
                  v-for="commune in addressAPICommune"
                  :key="commune.code"
                  :value="commune.code"
                >
                  {{ commune.name }}
                </option>
              </select>
            </div>
            <div class="col-12 p-3">
              <input
                class="w-100"
                type="text"
                placeholder="Địa chỉ cụ thể"
                v-model="desc"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-success w-100"
            @click="saveAddress()"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- UpdateAddressModal -->
  <div
    class="modal fade"
    id="UpdateAddressModal"
    tabindex="-1"
    aria-labelledby="UpdateAddressModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="UpdateAddressModalLabel">
            Cập nhật chỉ
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-6 p-3">
              <input type="text" v-model="full_name" placeholder="Họ và tên" />
            </div>
            <div class="col-6 p-3">
              <input
                type="text"
                v-model="phone_number"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Tỉnh/Thành Phố</label>
              <!-- Dropdown chọn tỉnh -->

              <select
                class="form-select country"
                aria-label="Chọn tỉnh"
                v-model="selectedProvince"
                @change="onProvinceChange"
              >
                <option
                  v-for="province in addressAPIProvince"
                  :key="province.code"
                  :value="province.code"
                >
                  {{ province.name }}
                </option>
              </select>
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Quận/Huyện</label>
              <!-- Dropdown chọn huyện -->
              <select
                class="form-select country"
                aria-label="Chọn huyện"
                v-model="selectedDistrict"
                @change="onDistrictChange"
                :disabled="!addressAPIDistrict.length"
              >
                <option
                  v-for="district in addressAPIDistrict"
                  :key="district.code"
                  :value="district.code"
                >
                  {{ district.name }}
                </option>
              </select>
            </div>
            <div class="col-4 p-3">
              <label for="form-control">Xã/Phường</label>
              <!-- Dropdown chọn xã -->
              <select
                class="form-select country"
                aria-label="Chọn xã"
                v-model="selectedCommune"
                :disabled="!addressAPICommune.length"
              >
                <option
                  v-for="commune in addressAPICommune"
                  :key="commune.code"
                  :value="commune.code"
                >
                  {{ commune.name }}
                </option>
              </select>
            </div>
            <div class="col-12 p-3">
              <input
                class="w-100"
                type="text"
                placeholder="Địa chỉ cụ thể"
                v-model="desc"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-success w-100"
            @click="saveAddressUpdate()"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addressServices from "@/services/address.services";
import axios from "axios";

export default {
  data() {
    return {
      addresses: [],
      addressAPIProvince: [],
      addressAPIDistrict: [],
      addressAPICommune: [],
      selectedProvince: null,
      selectedDistrict: null,
      selectedCommune: null,
      full_name: "",
      phone_number: "",
      desc: "",
      id: "",
    };
  },
  async created() {
    await this.fetchAddresses();
    await this.getProvinces();
  },
  methods: {
    async fetchAddresses() {
      try {
        const response = await addressServices.getAddress();
        this.addresses = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async setDefaultAddress(address) {
      try {
        await addressServices.updateIs_DefaultAddress(address);
        this.fetchAddresses();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteAddress(address) {
      try {
        await addressServices.deleteAddress(address);
        this.fetchAddresses();
      } catch (error) {
        console.error(error);
      }
    },
    async getProvinces() {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        this.addressAPIProvince = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    },

    // Khi người dùng chọn tỉnh, gọi API để lấy danh sách huyện
    async onProvinceChange() {
      if (!this.selectedProvince) return;
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${this.selectedProvince}?depth=2`
        );
        this.addressAPIDistrict = response.data.districts;
        this.addressAPICommune = []; // Reset danh sách xã khi thay đổi tỉnh
        this.selectedDistrict = null;
        this.selectedCommune = null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách huyện:", error);
      }
    },

    // Khi người dùng chọn huyện, gọi API để lấy danh sách xã
    async onDistrictChange() {
      if (!this.selectedDistrict) return;
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${this.selectedDistrict}?depth=2`
        );
        this.addressAPICommune = response.data.wards;
        this.selectedCommune = null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xã:", error);
      }
    },
    getProvinceName(code) {
      const province = this.addressAPIProvince.find((p) => p.code === code);
      return province ? province.name : "Không tìm thấy";
    },

    getDistrictName(code) {
      const district = this.addressAPIDistrict.find((d) => d.code === code);
      return district ? district.name : "Không tìm thấy";
    },

    getCommuneName(code) {
      const commune = this.addressAPICommune.find((c) => c.code === code);
      return commune ? commune.name : "Không tìm thấy";
    },
    async saveAddress() {
      const payload = {
        provide: this.getProvinceName(this.selectedProvince),
        district: this.getDistrictName(this.selectedDistrict),
        commune: this.getCommuneName(this.selectedCommune),
        full_name: this.full_name,
        phone_number: this.phone_number,
        desc: this.desc,
      };
      await addressServices.createAddress(payload);
      this.fetchAddresses();
    },
    async getAddressById(id) {
      const response = await addressServices.getAddressById(id);
      this.selectedProvince = response.data.LIST_ADDRESS[0].PROVINCE;
      this.selectedDistrict = response.data.LIST_ADDRESS[0].DISTRICT;
      this.selectedCommune = response.data.LIST_ADDRESS[0].COMMUNE;
      this.full_name = response.data.LIST_ADDRESS[0].FULL_NAME;
      this.phone_number = response.data.LIST_ADDRESS[0].PHONE_NUMBER;
      this.desc = response.data.LIST_ADDRESS[0].DESC;
      this.id = response.data.LIST_ADDRESS[0]._id;
    },
    async saveAddressUpdate() {
      const payload = {
        PROVIDE: this.getProvinceName(this.selectedProvince),
        DISTRICT: this.getDistrictName(this.selectedDistrict),
        COMMUNE: this.getCommuneName(this.selectedCommune),
        FULL_NAME: this.full_name,
        PHONE_NUMBER: this.phone_number,
        DESC: this.desc,
      };
      await addressServices.updateAddress(this.id, payload);
      this.fetchAddresses();
    },
    resetForm() {
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedCommune = null;
      this.full_name = "";
      this.phone_number = "";
      this.desc = "";
    },
  },
};
</script>

<style scoped>
.background-component {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Header Section */
.header-address {
  padding: 20px 0;
  border-bottom: 2px solid #f0f2f5;
}

.title {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5rem;
  position: relative;
}

.button-address {
  background: #09884d;
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(9, 136, 77, 0.2);
}

.button-address:hover {
  background: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.3);
}

.button-address i {
  font-size: 14px;
}

/* Address Content */
.body-address {
  padding: 20px 0;
}

.content-address {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 15px 0;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.3s ease;
}

.content-address:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* User Info */
.name-number {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  padding-right: 15px;
}

.number {
  font-size: 14px;
  color: #666;
  padding-left: 15px;
  border-left: 2px solid #f0f2f5;
}

/* Address Details */
.address {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.commune {
  margin-bottom: 5px;
  color: #2c3e50;
}

.province {
  margin-bottom: 10px;
}

.default-address {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid #09884d;
  color: #09884d;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(9, 136, 77, 0.1);
}

/* Operation Buttons */
.update-delete {
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
}

.update,
.delete {
  color: #09884d;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.update:hover,
.delete:hover {
  background: rgba(9, 136, 77, 0.1);
  color: #076d3d;
}

.delete {
  color: #dc3545;
}

.delete:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #bd2130;
}

.is-default {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #2c3e50;
  font-size: 13px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  cursor: pointer;
}

.is-default:hover {
  border-color: #09884d;
  color: #09884d;
  background: rgba(9, 136, 77, 0.1);
}

/* Modal Styling */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: #f8f9fa;
  border-bottom: 2px solid #f0f2f5;
  padding: 15px 20px;
}

.modal-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal-body {
  padding: 20px;
}

/* Form Controls */
input[type="text"],
.form-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.3s ease;
}

input[type="text"]:focus,
.form-select:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 3px rgba(9, 136, 77, 0.1);
  outline: none;
}

label {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.form-select {
  background-color: #fff;
  cursor: pointer;
}

.form-select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

/* Modal Footer */
.modal-footer {
  border-top: none;
  padding: 15px 20px;
}

.btn-success {
  background: #09884d;
  border: none;
  padding: 12px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.2);
}

/* Animation */
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

.content-address {
  animation: fadeIn 0.3s ease;
}
</style>
