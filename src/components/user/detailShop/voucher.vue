<template>
  <h5 class="mb-3">VOUCHER</h5>
  <div class="row">
    <div class="col-md-3" v-for="item in vouchers" :key="item">
      <div
        class="voucher-card p-3 border rounded"
        v-if="item.ACTIVE && item.QUANTITY > 0"
      >
        <div
          class="d-flex justify-content-between align-items-center position-relative"
        >
          <div>
            <h6 class="text-danger mb-1" v-if="item.DISCOUNT_AMOUNT">
              Giảm {{ formatNumber(item.DISCOUNT_AMOUNT) }}
            </h6>
            <h6 class="text-danger mb-1" v-if="item.DISCOUNT_PERCENTAGE">
              Giảm {{ item.DISCOUNT_PERCENTAGE }}%
            </h6>
            <div class="d-flex">
              <small v-if="item.DISCOUNT_PERCENTAGE"
                >Giảm tối đa {{ formatNumber(item.MAX_DISCOUNT_AMOUNT) }}
              </small>
              <small>Đơn Tối Thiểu {{ formatNumber(item.MIN_PURCHASE) }}</small>
            </div>
          </div>
          <button
            class="btn btn-danger btn-sm"
            @click="copyToClipboard(item.CODE)"
          >
            Lưu
          </button>
        </div>
        <small class="text-muted">HSD: {{ formatDate(item.TO_DATE) }}</small>
        <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          x{{ item.QUANTITY }}
          <span class="visually-hidden">unread messages</span>
        </span>
      </div>
    </div>
  </div>
  <VPagination
    v-model="page"
    :pages="currentMaxPage"
    :range-size="4"
    active-color="#DCEDFF"
    @update:modelValue="onPageChange"
  />
</template>

<script>
import promoServices from "@/services/promoServices";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { formatDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import Swal from "sweetalert2";

export default {
  components: {
    VPagination,
  },
  props: {
    ID_ACCOUNT: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      vouchers: [],
      page: 1,
      limit: 4,
      currentMaxPage: 1,
    };
  },
  async created() {
    await this.getVoucher();
  },
  methods: {
    async getVoucher() {
      const response = await promoServices.getAllPromoUserPage(
        this.ID_ACCOUNT,
        this.page,
        this.limit
      );
      if (response && response.data) {
        this.vouchers = response.data;

        // Determine if we are on the last page by checking if we received fewer items than `limit`
        if (this.vouchers.length < this.limit) {
          this.currentMaxPage = this.page;
        } else {
          // Set currentMaxPage to allow for another page
          this.currentMaxPage = this.page + 1;
        }
      } else {
        // If no data is returned, reset vouchers array
        this.vouchers = [];
      }
    },
    async onPageChange(newPage) {
      if (newPage <= this.currentMaxPage) {
        this.page = newPage;
        await this.getVoucher();
      }
    },
    formatDate(date) {
      return formatDate(date);
    },
    formatNumber(number) {
      return formatNumber(number);
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
  },
};
</script>

<style scoped>
.voucher-card {
  background: white;
  border: 1px solid #dc3545 !important;
  border-radius: 12px !important;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  height: 145px;
}

.voucher-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
}

.voucher-card h6 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.voucher-card small {
  display: block;
  color: #6c757d;
  font-size: 0.85rem;
}

.voucher-card .btn-danger {
  background-color: #dc3545;
  border: none;
  padding: 5px 15px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.voucher-card .btn-danger:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

/* Thêm đường kẻ ngang giữa các thông tin */
.voucher-card small:not(:last-child) {
  border-bottom: 1px dashed #dee2e6;
  padding-bottom: 5px;
  margin-bottom: 5px;
}

/* Style cho phần tiêu đề VOUCHER */
h5 {
  font-weight: 700;
  color: #dc3545;
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
}

h5::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #dc3545;
  border-radius: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .voucher-card {
    margin-bottom: 15px;
  }

  .voucher-card h6 {
    font-size: 1rem;
  }

  .voucher-card small {
    font-size: 0.8rem;
  }

  .voucher-card .btn-danger {
    font-size: 0.8rem;
    padding: 4px 12px;
  }
}
</style>
