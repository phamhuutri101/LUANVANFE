<template>
  <div class="col-md-9 background-component p-4">
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
.title {
  color: #333;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5rem;
}
.name {
  padding-right: 10px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.number {
  padding-left: 10px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(0, 0, 0, 0.54);
}
.commune,
.province {
  color: rgba(0, 0, 0, 0.54);
}
.default-address {
  padding: 5px;
  border: 1px solid #44ba69;
  color: #44ba69;
  width: 80px;
}
.update,
.delete {
  background: none;
  border: 0px;
  color: rgb(0, 136, 255);
  outline: none;
  padding: 4px;
  white-space: nowrap;
  cursor: pointer;
}
.is-default {
  border: 1px solid rgba(0, 0, 0, 0.26);
  box-shadow: rgba(0, 0, 0, 0.03) 0px 1px 1px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.875rem;
  height: 28px;
  line-height: 1.25rem;
  min-width: 0px;
  padding: 4px 12px;
  white-space: nowrap;
  cursor: pointer;
}
.button-address {
  background: #44ba69;
  border: 0px;
  border-radius: 5px;
  color: #fff;
  outline: none;
  padding: 8px;
  white-space: nowrap;
  cursor: pointer;
}
</style>
