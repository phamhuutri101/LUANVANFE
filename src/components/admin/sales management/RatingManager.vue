<template>
  <div>
    <!-- Danh sách đánh giá -->
    <div class="review-list">
      <h2>Danh sách đánh giá</h2>
      <!-- Bộ lọc -->
      <div class="filters">
        <select v-model="filterRating">
          <option value="">Tất cả sao</option>
          <option value="1">1 sao</option>
          <option value="2">2 sao</option>
          <option value="3">3 sao</option>
          <option value="4">4 sao</option>
          <option value="5">5 sao</option>
        </select>

        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên..."
        />
      </div>

      <!-- Bảng danh sách -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>

            <th>Nội dung</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, index) in filteredReviews" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="d-flex align-item-center">
                <div class="avt p-0 m-0">
                  <img
                    :src="review.user.AVT_URL"
                    class="rounded-circle"
                    style="width: 35px"
                    alt="Avatar"
                  />
                </div>
                <div class="review p-0 m-0">
                  {{ review.user.FULL_NAME }}
                  <div class="star-rating">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="bi"
                      :class="
                        n <= review.NUMBER_OF_START ? 'bi-star-fill' : 'bi-star'
                      "
                    ></i>
                  </div>
                  <div
                    class="img-rating"
                    v-for="img in review.IMG_URL"
                    :key="img"
                  >
                    <img :src="img.FILE_URL" alt="Ảnh" style="width: 80px" />
                  </div>
                  <div class="name-product">
                    <span>{{ review.product.NAME_PRODUCT }}</span>
                    <span> phân loại:</span> <span>{{ review.CLASSIFY }}</span>
                  </div>
                </div>
              </div>
            </td>

            <td>{{ review.REVIEW_CONTENT }}</td>
            <td>{{ formatDate(review.REVIEW_DATE) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">
          Trước
        </button>
        <span>Trang {{ currentPage }}/{{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import reviewServices from "@/services/review.services";
export default {
  data() {
    return {
      // Danh sách đánh giá
      reviews: [],

      // Bộ lọc và tìm kiếm
      filterRating: "",
      searchQuery: "",

      // Phân trang
      currentPage: 1,
      itemsPerPage: 10,

      // Modal chỉnh sửa
      showEditModal: false,
      editingReview: null,
    };
  },

  computed: {
    // Lọc đánh giá theo điều kiện
    filteredReviews() {
      let result = [...this.reviews];

      // Lọc theo số sao
      if (this.filterRating) {
        result = result.filter(
          (review) => review.NUMBER_OF_START === parseInt(this.filterRating)
        );
      }

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter((review) =>
          review.product.NAME_PRODUCT.toLowerCase().includes(query)
        );
      }

      // Phân trang
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      return result.slice(start, end);
    },

    // Tổng số trang
    totalPages() {
      return Math.ceil(this.reviews.length / this.itemsPerPage);
    },
  },

  methods: {
    // Xóa đánh giá
    deleteReview(id) {
      if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
        this.reviews = this.reviews.filter((review) => review.id !== id);
      }
    },

    // Mở modal chỉnh sửa
    editReview(review) {
      this.editingReview = { ...review };
      this.showEditModal = true;
    },

    // Cập nhật đánh giá
    updateReview() {
      const index = this.reviews.findIndex(
        (r) => r.id === this.editingReview.id
      );
      if (index !== -1) {
        this.reviews[index] = { ...this.editingReview };
      }

      this.showEditModal = false;
      this.editingReview = null;
    },

    // Format ngày tháng
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    async getAllReview() {
      const response = await reviewServices.getAllReview(1, 10);
      if (response && response.data) {
        this.reviews = response.data;
        console.log(this.reviews);
      } else {
        console.error("L��i lấy dữ liệu đánh giá:", response);
      }
    },
  },

  // Giả lập load dữ liệu khi mounted
  mounted() {
    this.getAllReview();
  },
};
</script>
<style scoped>
/* Styles cho review list container */
.review-list {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin: 20px 0;
}

.review-list h2 {
  color: #222222;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

/* Styles cho bộ lọc */
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filters select {
  min-width: 150px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  background-color: #fff;
  font-size: 14px;
}

.filters input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.filters input::placeholder {
  color: #9ca3af;
}

/* Styles cho bảng */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0;
}

th {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}

/* Style cho phần user info và avatar */
.d-flex {
  display: flex;
  gap: 16px;
}

.align-item-center {
  align-items: flex-start;
}

.avt {
  flex-shrink: 0;
}

.avt img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.review {
  flex: 1;
}

/* Style cho star rating */
.star-rating {
  color: #fbbf24;
  font-size: 16px;
  margin: 8px 0;
}

.bi-star-fill {
  color: #fbbf24;
}

.bi-star {
  color: #d1d5db;
}

/* Style cho product images */
.img-rating {
  display: inline-block;
  margin: 8px 8px 8px 0;
}

.img-rating img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* Style cho product info */
.name-product {
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

.name-product span {
  margin-right: 4px;
}

.name-product span:first-child {
  color: #374151;
  font-weight: 500;
}

/* Style cho review content */
td:nth-child(3) {
  color: #374151;
  line-height: 1.5;
}

/* Style cho date */
td:nth-child(4) {
  color: #6b7280;
  font-size: 14px;
  white-space: nowrap;
}

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination button {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.pagination button:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.pagination span {
  color: #374151;
  font-size: 14px;
}

/* Hover effect cho table rows */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .filters select,
  .filters input {
    width: 100%;
  }

  .d-flex {
    flex-direction: column;
    gap: 12px;
  }

  .img-rating {
    margin: 4px;
  }

  .img-rating img {
    width: 60px;
    height: 60px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    display: none;
  }

  .pagination {
    flex-wrap: wrap;
  }
}

/* Animation cho loading states nếu cần */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
