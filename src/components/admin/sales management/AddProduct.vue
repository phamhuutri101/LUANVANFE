<template>
  <div class="add-product-form">
    <h2>Thêm sản phẩm</h2>
    <form @submit.prevent="submitForm">
      <div class="card mb-3">
        <div class="card-header">
          <h5>Thông tin cơ bản</h5>
        </div>
        <div class="card-body">
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

            <select
              class="form-select"
              id="category"
              v-model="product.category_id"
            >
              <option value="">Chọn danh mục</option>
              <option
                v-for="item in category"
                :key="item._id"
                :value="item._id"
              >
                {{ item.CATEGORY_NAME }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Ảnh đại diện sản phẩm</label>
            <div class="d-flex align-items-center">
              <input type="file" @change="uploadFile('avatar', $event)" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Ảnh sản phẩm</label>
            <div class="d-flex align-items-center">
              <input type="file" @change="handleFiles($event)" multiple />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Biến thể</h5>
        </div>
        <div class="card-body">
          <div class="mb-3" v-for="(item, index) in metadata" :key="index">
            <label for="attributeKey" class="form-label">Tên biến thể</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ví dụ: Màu Sắc"
              v-model="item.key"
              required
            />
            <label for="attributeValue" class="form-label"
              >Giá trị biến thể (ngăn cách bởi dấu phẩy)</label
            >
            <input
              type="text"
              class="form-control"
              v-model="item.rawValue"
              placeholder="Ví dụ: Đỏ, Xanh, Vàng"
              required
            />
          </div>
          <button
            type="button"
            @click="addMetadata"
            class="btn btn-outline-primary"
          >
            Thêm biến thể
          </button>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h5>Mô tả sản phẩm</h5>
        </div>
        <label for="" class="form-label">Mô tả ngắn</label>
        <div class="card-body">
          <input
            type="text"
            class="form-control"
            v-model="product.short_desc"
          />
        </div>
        <label for="" class="form-label">Mô tả chi tiết</label>
        <div class="card-body">
          <textarea
            class="form-control"
            rows="5"
            v-model="product.desc_product"
          ></textarea>
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary">Đăng bán</button>
      </div>
    </form>
  </div>
</template>

<script>
import productServices from "@/services/product.services";
import uploadServices from "@/services/upload.services";
import categoryServices from "@/services/category.services";
export default {
  name: "AddProductForm",
  data() {
    return {
      category: [],
      product: {
        name: "",
        category_id: "",
        short_desc: "",
        desc_product: "",
        file_attachments: [],
        file_attachmentsdefault: [],
        metadata: [],
      },
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
    console.log("file ", this.product);
    await this.getCategory();
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
        console.log(response);

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
        console.log(response);
      } catch (error) {
        console.error("Failed to upload files:", error);
      }
    },
    async getCategory() {
      try {
        const response = await categoryServices.getAll();
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
      this.metadata.push({ key: "", rawValue: "", value: [] });
    },

    async submitForm() {
      // Tách chuỗi rawValue thành mảng value cho mỗi thuộc tính trong metadata
      this.product.metadata = this.metadata.map((item) => ({
        key: item.key,
        value: item.rawValue.split(",").map((v) => v.trim()), // Tách chuỗi và loại bỏ khoảng trắng
      }));

      try {
        const response = await productServices.create(this.product);
        console.log("Product created successfully:", response);
      } catch (error) {
        console.error("Failed to create product:", error);
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
</style>
