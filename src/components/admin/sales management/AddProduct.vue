<template>
  <div class="add-product-form">
    <form @submit.prevent>
      <div class="card mb-3">
        <div class="card-header">
          <h5 class="title-text">Thông tin cơ bản</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="">Ảnh bìa sản phẩm</label>
            <label for="avt" class="label-avt">
              <i class="fa-solid fa-upload"></i>
            </label>
            <div class="d-flex align-items-center img-avt">
              <input
                id="avt"
                type="file"
                @change="uploadFile('avatar', $event)"
              />
            </div>
            <div v-if="product.file_attachmentsdefault.length > 0">
              <h6>Ảnh đại diện đã tải lên:</h6>
              <img
                v-for="(attachment, index) in product.file_attachmentsdefault"
                :key="index"
                :src="attachment.file_url"
                alt="Ảnh đại diện"
                class="img-thumbnail"
                style="width: 100px; height: auto; margin-right: 10px"
              />
            </div>
          </div>

          <div class="mb-3">
            <label for="">Ảnh sản phẩm</label>
            <label for="img-product" class="label-product">
              <i class="fa-solid fa-upload"></i
            ></label>
            <div class="d-flex align-items-center img-product">
              <input
                id="img-product"
                type="file"
                @change="handleFiles($event)"
                multiple
              />
            </div>
            <div v-if="product.file_attachments.length > 0">
              <h6>Ảnh sản phẩm đã tải lên:</h6>
              <img
                v-for="(attachment, index) in product.file_attachments"
                :key="index"
                :src="attachment.file_url"
                alt="Ảnh sản phẩm"
                class="img-thumbnail"
                style="width: 100px; height: auto; margin-right: 10px"
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="productName" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              id="productName"
              v-model="product.name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Danh mục ngành hàng</label>
            <select class="form-select" id="category" v-model="type_product_id">
              <option value="">Chọn danh mục ngành hàng</option>
              <option
                v-for="item in type_product"
                :key="item._id"
                :value="item._id"
              >
                {{ item.TYPE_PRODUCT }}
              </option>
            </select>
          </div>
          <div class="mb-3" v-if="category.length > 0">
            <label for="category" class="form-label">Danh mục sản phẩm</label>
            <select
              class="form-select"
              id="category"
              v-model="product.category_id"
            >
              <option value="">Chọn danh mục sản phẩm</option>
              <option
                v-for="item in category"
                :key="item._id"
                :value="item._id"
              >
                {{ item.CATEGORY_NAME }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Phân loại hàng</h5>
        </div>
        <div class="card-body">
          <div class="mb-3" v-for="(item, index) in metadata" :key="index">
            <label for="attributeKey" class="form-label">Phân loại</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ví dụ: Màu Sắc"
              v-model="item.key"
              required
            />
            <label for="attributeValue" class="form-label"
              >Tùy chọn (ngăn cách bởi dấu phẩy)</label
            >
            <input
              type="text"
              class="form-control"
              v-model="item.rawValue"
              placeholder="Ví dụ: Đỏ, Xanh, Vàng"
              required
            />
          </div>
          <!-- Hiển thị nút thêm chỉ khi số lượng metadata nhỏ hơn 2 -->
          <button
            type="button"
            @click="addMetadata"
            class="btn btn-outline-primary"
            v-if="metadata.length < 2"
          >
            Thêm Nhóm phân loại
          </button>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Mô tả sản phẩm</h5>
        </div>
        <label for="" class="form-label">Mô tả ngắn</label>
        <div class="card-body">
          <textarea
            type="text"
            class="form-control"
            rows="5"
            v-model="product.short_desc"
          >
          </textarea>
        </div>
        <label for="" class="form-label">Mô tả chi tiết</label>
        <div class="card-body">
          <textarea
            class="editor form-control"
            rows="10"
            v-model="product.desc_product"
          >
          </textarea>
        </div>
        <div class="p-3 text-end">
          <button @click="submitForm()" class="btn btn-success mx-3">
            Tạo mới
          </button>
          <button type="reset" class="btn btn-secondary ml-2">Làm mới</button>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Nhập kho</h5>
        </div>
        <div class="row p-2">
          <div class="col-4">
            <label for="" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              v-model="resultSubmit.NAME_PRODUCT"
              disabled
            />
          </div>
          <div class="col-4">
            <label for="" class="form-label">Giá nhập</label>
            <input
              type="text"
              class="form-control"
              v-model="payloadInventory.price"
            />
          </div>
          <div class="col-4">
            <label for="" class="form-label">Số lượng nhập</label>
            <input
              type="text"
              class="form-control"
              v-model="payloadInventory.quantity"
            />
          </div>
          <div class="col-6">
            <label for="" class="form-label">Thuộc tính</label>
            <div
              v-for="(metadata, index) in resultSubmit.LIST_PRODUCT_METADATA"
              :key="index"
            >
              <label :for="metadata.KEY" class="form-label">{{
                metadata.KEY
              }}</label>
              <select
                :id="metadata.KEY"
                class="form-select"
                @change="handleSelectChange(metadata.KEY, $event.target.value)"
              >
                <option value="">Chọn giá trị</option>
                <option
                  v-for="value in metadata.VALUE"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-end px-3">
            <button @click="createInventory()" class="btn btn-success my-3">
              nhập kho
            </button>
          </div>
        </div>
        <table class="table" v-if="dataViewInventory.length > 0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Thuộc tính</th>
              <th scope="col">Giá nhập kho</th>
              <th scope="col">số lượng nhập kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody v-for="(item, index) in dataViewInventory" :key="index">
            <tr>
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <div
                  v-for="(detail, detailIndex) in item.details"
                  :key="detailIndex"
                >
                  <span>{{ detail.key }}: {{ detail.value }}</span>
                </div>
              </td>
              <td>{{ formatNumber(item.price) }}</td>
              <td>{{ item.quantity }}</td>
              <td><i class="fa-solid fa-trash"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card mb-3">
        <div class="card-header">
          <h5>Thêm giá sản phẩm</h5>
        </div>
        <div class="row p-2">
          <div class="col-4">
            <label for="" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              v-model="resultSubmit.NAME_PRODUCT"
              disabled
            />
          </div>
          <div class="col-4">
            <label for="" class="form-label">Giá bán</label>
            <input
              type="text"
              class="form-control"
              v-model="payloadAddPrice.price_number"
            />
          </div>
          <div class="col-4">
            <label for="">thuộc tính</label>
            <div
              v-for="(metadata, index) in productKeyValue.LIST_PRODUCT_METADATA"
              :key="index"
            >
              <label :for="metadata.KEY" class="form-label">{{
                metadata.KEY
              }}</label>
              <select
                :id="metadata.KEY"
                class="form-select"
                @change="
                  handleSelectChangePrice(metadata.KEY, $event.target.value)
                "
              >
                <option value="">Chọn giá trị</option>
                <option
                  v-for="value in metadata.VALUE"
                  :key="value"
                  :value="value[0]"
                >
                  {{ value[0] }}
                </option>
              </select>
            </div>
          </div>

          <div class="text-end px-3">
            <button @click="addPrice()" class="btn btn-success my-3">
              Thêm giá bán
            </button>
          </div>
        </div>
        <table class="table" v-if="dataKeyValueInPrice.length > 0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Thuộc tính</th>
              <th scope="col">Giá nhập kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in dataKeyValueInPrice.LIST_PRICE"
            :key="index"
          >
            <tr>
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <div
                  v-for="(detail, detailIndex) in item.LIST_MATCH_KEY"
                  :key="detailIndex"
                >
                  <span>{{ detail.KEY }}: {{ detail.VALUE }}</span>
                </div>
              </td>
              <td>{{ formatNumber(item.PRICE_NUMBER) }}</td>

              <td><i class="fa-solid fa-trash"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  </div>
</template>

<script>
import { formatNumber } from "@/utils/formatNumber";
import productServices from "@/services/product.services";
import uploadServices from "@/services/upload.services";
import typeProductServices from "@/services/typeProduct.services";
import inventoryServices from "@/services/inventory.services";
import priceServices from "@/services/price.services";
import Swal from "sweetalert2";

export default {
  name: "AddProductForm",

  data() {
    return {
      category: [],
      type_product: [],
      type_product_id: "",
      product: {
        name: "",
        category_id: "",
        short_desc: "",
        desc_product: "",
        file_attachments: [],
        file_attachmentsdefault: [],
        metadata: [],
      },
      resultSubmit: [], // data trả về của submit
      payloadInventory: {
        price: "",
        quantity: "",
        key: [],
        value: [],
      },
      payloadAddPrice: {
        price_number: "",
        key: [],
        value: [],
      },
      productKeyValue: [],
      dataViewInventory: [],
      dataKeyValueInPrice: [],
      metadata: [
        {
          key: "",
          rawValue: "", // lưu giá trị gốc trước khi tách thành mảng
          value: [], // giá trị đã tách thành mảng
        },
      ],
    };
  },
  async created() {
    await this.getTypeProduct();
  },
  watch: {
    type_product_id(newVal) {
      if (newVal) {
        this.getCategory();
      } else {
        this.category = []; // Xóa danh mục sản phẩm khi không có danh mục ngành hàng
      }
    },
  },

  methods: {
    async uploadFile(type, event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        console.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
        return;
      }

      try {
        const response = await uploadServices.uploadFile(file);
        const attachment = {
          file_url: response.data.url, // Đảm bảo rằng đây là URL đúng từ phản hồi
          file_type: response.data.type, // Đảm bảo rằng đây là loại tệp đúng từ phản hồi
        };
        this.product.file_attachmentsdefault.push(attachment);
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    },

    async handleFiles(event) {
      const files = Array.from(event.target.files); // Lấy tất cả file đã chọn
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("imgs", file); // 'imgs' là tên trường file gửi đi
        });

        const response = await uploadServices.uploadFiles(formData);
        this.product.file_attachments = response.data.map((file) => ({
          file_url: file.url,
          file_type: file.type,
        }));
      } catch (error) {
        console.error("Failed to upload files:", error);
      }
    },
    async getTypeProduct() {
      try {
        const response = await typeProductServices.getAll();
        if (response && response.data) {
          this.type_product = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getCategory() {
      if (!this.type_product_id) return;
      try {
        const response = await typeProductServices.getCategoryByTypeProduct(
          this.type_product_id
        );
        this.category = response.data;
      } catch (error) {
        console.error("Failed to get category:", error);
      }
    },
    // Tách chuỗi giá trị biến thể thành mảng
    splitValues(index) {
      this.metadata[index].value = this.metadata[index].rawValue
        .split(",")
        .map((v) => v.trim());
    },

    // Thêm thuộc tính mới
    addMetadata() {
      if (this.metadata.length < 2) {
        this.metadata.push({ key: "", rawValue: "", value: [] });
      }
    },

    async submitForm() {
      // Tách chuỗi rawValue thành mảng value cho mỗi thuộc tính trong metadata
      this.product.metadata = this.metadata.map((item) => ({
        key: item.key,
        value: item.rawValue.split(",").map((v) => v.trim()), // Tách chuỗi và loại bỏ khoảng trắng
      }));

      try {
        const response = await productServices.create(this.product);
        this.resultSubmit = response.product;

        if (response) {
          const result = await Swal.fire({
            title: "Đăng tải sản phẩm thành công",

            icon: "success",

            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
          } else {
            Swal.fire({
              icon: "error",
              title: response.message, // Lấy thông báo lỗi từ API
            });
          }
        }
      } catch (error) {
        console.error("Failed to create product:", error);
      }
    },
    handleSelectChange(key, value) {
      // Tìm vị trí của thuộc tính (key) trong danh sách
      const index = this.payloadInventory.key.indexOf(key);

      if (index !== -1) {
        // Nếu key đã tồn tại, cập nhật giá trị của nó
        this.payloadInventory.value[index] = value;
      } else {
        // Nếu key chưa tồn tại, thêm mới key và value vào danh sách
        this.payloadInventory.key.push(key);
        this.payloadInventory.value.push(value);
      }
      console.log("dữ liệu nhập vào", this.payloadInventory);
    },
    handleSelectChangePrice(key, value) {
      // Tìm vị trí của thuộc tính (key) trong danh sách
      const index = this.payloadAddPrice.key.indexOf(key);

      if (index !== -1) {
        // Nếu key đã tồn tại, cập nhật giá trị của nó
        this.payloadAddPrice.value[index] = value;
      } else {
        // Nếu key chưa tồn tại, thêm mới key và value vào danh sách
        this.payloadAddPrice.key.push(key);
        this.payloadAddPrice.value.push(value);
      }
      console.log("dữ liệu nhận vào thêm giá", this.payloadAddPrice);
    },
    async createInventory() {
      try {
        if (this.resultSubmit) {
          const response = await inventoryServices.create(
            this.resultSubmit._id,
            this.payloadInventory
          );

          if (response && response.data && response.success) {
            const inventoryData = response.data;

            // Lặp qua từng sản phẩm trong danh sách LIST_PRODUCT_CREATED
            inventoryData.LIST_PRODUCT_CREATED.forEach((product) => {
              // Tạo một đối tượng nhập kho mới cho từng sản phẩm
              const newInventoryEntry = {
                price: product.UNIT_PRICE,
                quantity: product.QUANTITY,
                details: product.DETAILS.map((detail) => ({
                  key: detail.KEY,
                  value: detail.VALUE,
                })),
              };

              // Thêm đối tượng mới vào mảng dataViewInventory
              this.dataViewInventory.push(newInventoryEntry);
            });
            console.log(
              "Phiếu nhập kho đã được thêm vào dataViewInventory:",
              this.dataViewInventory
            );
          }
          this.getProductKeyValue();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addPrice() {
      try {
        const response = await priceServices.addPriceProduct(
          this.resultSubmit._id,
          this.payloadAddPrice
        );
        if (response) {
          Swal.fire({
            icon: "success",
            title: "Thêm giá thành công",
          });

          await this.getPriceKeyValueById();
          console.log("dữ liệu thêm giá sản phẩm", this.dataKeyValueInPrice);
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatNumber(number) {
      return formatNumber(number);
    },
    async getProductKeyValue() {
      try {
        const response = await productServices.getProductKeyValue(
          this.resultSubmit._id
        );
        if (response && response.data) {
          this.productKeyValue = response.data;
        }
        console.log("dữ liệu trả về của getProductKV", this.productKeyValue);
      } catch (error) {
        console.log(error);
      }
    },
    async getPriceKeyValueById() {
      try {
        const response = await priceServices.getById(this.resultSubmit._id);
        if (response && response.data) {
          this.dataKeyValueInPrice = response.data;
          console.log("Dữ liệu từ API:", this.dataKeyValueInPrice);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.add-product-form {
  max-width: 800px;
  margin: 0 auto;
}
.title-text {
  font-size: 20px;
  color: #333333;
  font-weight: 700;
}
.img-avt input[type="file"] {
  display: none;
}
.label-avt {
  display: inline-block;
  text-transform: uppercase;
  color: #000;

  text-align: center;
  padding: 10px 10px;
  font-size: 15px;

  letter-spacing: 1.5px;
  cursor: pointer;
  user-select: none;
  box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  border: 1px dashed #000;
  margin-left: 20px;
  padding: 23px;
}
.label-avt:active {
  transform: scale(0.9);
}
.img-product input[type="file"] {
  display: none;
}
.label-product {
  display: inline-block;
  text-transform: uppercase;
  color: #000;

  text-align: center;
  padding: 20px 20px;
  font-size: 15px;
  letter-spacing: 1.5px;
  cursor: pointer;
  user-select: none;
  box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  border: 1px dashed #000;
  margin-left: 47px;
  padding: 23px;
  border-radius: 3px;
}
</style>
