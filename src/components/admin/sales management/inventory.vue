<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5 mx-auto position-relative">
        <div class="input-group">
          <input
            class="form-control border-end-0 border rounded-pill"
            type="search"
            v-model="searchTerm"
            placeholder="Tìm kiếm hàng hóa theo mã, mã vạch, hoặc tên (F3)"
            @input="handleSearch"
            @focus="showDropdown = true"
          />
          <span class="input-group-append">
            <button
              class="btn btn-outline-secondary bg-white border-bottom-0 border rounded-pill ms-n5"
              type="button"
            >
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="position-absolute w-100 mt-1">
          <div class="bg-white border rounded shadow-sm p-3 text-center">
            <div
              class="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>

        <!-- Dropdown Results -->
        <div
          v-else-if="showDropdown && searchTerm"
          class="position-absolute w-100 mt-1"
        >
          <div class="bg-white border rounded shadow-sm">
            <div v-if="searchResults.length > 0">
              <div
                v-for="item in searchResults"
                :key="item.id"
                class="p-3 border-bottom hover-bg-light cursor-pointer"
                @click="selectItem(item)"
              >
                <div class="fw-bold">{{ item.name }}</div>
                <div class="small text-muted">
                  Tên sản phẩm: {{ item.NAME_PRODUCT }} | SDK: {{ item.sdk }}
                </div>
                <div class="small text-muted" v-if="item.activeIngredient">
                  Hoạt chất: {{ item.activeIngredient }}
                </div>
                <div class="small text-muted" v-if="item.packaging">
                  Quy cách ĐG: {{ item.packaging }} | Hãng SX:
                  {{ item.manufacturer }}
                </div>
              </div>
            </div>
            <div v-else class="p-3 text-center text-muted">
              Không tìm thấy kết quả
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tên sản phẩm</th>
          <th scope="col">Giá nhập</th>
          <th scope="col">Phân loại</th>
          <th scope="col">Tùy chọn</th>
          <th scope="col">Số lượng</th>
          <th scope="col">Nhà cung cấp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in selectedItems" :key="item.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.category }}</td>
          <td>
            <button class="btn btn-sm btn-danger" @click="removeItem(index)">
              Xóa
            </button>
          </td>
          <td>
            <input
              type="number"
              class="form-control form-control-sm"
              v-model="item.quantity"
              min="1"
            />
          </td>
          <td>{{ item.manufacturer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import searchServices from "@/services/search.services";

export default {
  name: "inventoryView",
  data() {
    return {
      searchTerm: "",
      showDropdown: false,
      isLoading: false,
      searchResults: [],
      selectedItems: [],
      searchError: null,
      searchTimeout: null,
    };
  },
  methods: {
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      if (this.searchTerm.trim() === "") {
        this.searchResults = [];
        return;
      }

      // Set new timeout
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },

    async performSearch() {
      try {
        this.isLoading = true;
        this.searchError = null;

        const response = await searchServices.searchByKeyword(this.searchTerm);

        if (response.success) {
          this.searchResults = response.data;
        } else {
          this.searchError = response.message || "Có lỗi xảy ra khi tìm kiếm";
          this.searchResults = [];
        }
      } catch (error) {
        console.error("Search error:", error);
        this.searchError = "Có lỗi xảy ra khi tìm kiếm";
        this.searchResults = [];
      } finally {
        this.isLoading = false;
      }
    },

    selectItem(item) {
      const existingItem = this.selectedItems.find((i) => i.id === item.id);
      if (!existingItem) {
        this.selectedItems.push({
          ...item,
          quantity: 1,
        });
      }
      this.showDropdown = false;
      this.searchTerm = "";
    },

    removeItem(index) {
      this.selectedItems.splice(index, 1);
    },

    handleClickOutside(event) {
      const searchContainer = this.$el.querySelector(".position-relative");
      if (!searchContainer.contains(event.target)) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  z-index: 1000;
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.cursor-pointer {
  cursor: pointer;
}

.dropdown-results {
  max-height: 400px;
  overflow-y: auto;
}
</style>
