<template>
  <!-- modal đánh giá sp -->
  <div
    class="modal fade"
    id="ratingModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="ratingModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ratingModalLabel">
            Đánh Giá Sản Phẩm
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="card mb-3">
            <div class="card-body"></div>
          </div>

          <div class="mb-3">
            <label class="form-label">Chất lượng sản phẩm</label>
            <div>
              <i
                v-for="n in 5"
                :key="n"
                :class="['bi', n <= rating ? 'bi-star-fill' : 'bi-star']"
                @click="setRating(n)"
                style="color: gold; cursor: pointer"
              ></i>
            </div>
            <small v-if="rating === 5" class="text-success">Tuyệt vời</small>
            <small v-if="rating === 4" class="text-success">Hài lòng</small>
            <small v-if="rating === 3" class="text-success">Bình thường</small>
            <small v-if="rating === 2" class="text-success"
              >Không hài lòng</small
            >
            <small v-if="rating === 1" class="text-success">Tệ</small>
          </div>

          <div class="mb-3">
            <label for="reviewText" class="form-label"
              >Chất lượng sản phẩm:</label
            >
            <textarea
              class="form-control"
              id="reviewText"
              rows="3"
              placeholder="để lại đánh giá."
              v-model="reviewContent"
            ></textarea>
          </div>

          <div class="mb-3">
            <button class="btn btn-outline-primary me-2">
              <i class="bi bi-camera"></i> Thêm Hình ảnh
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            TRỞ LẠI
          </button>
          <button type="button" class="btn btn-primary" @click="submitRating()">
            Hoàn Thành
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- modal đánh giá sp -->
</template>

<script>
import { Modal } from "bootstrap";
export default {
  dataK() {
    return {
      rating: 0,
    };
  },
  //   mounted() {
  //     const modal = new Modal(document.getElementById("ratingModal"));
  //     modal.show();
  //   },
  methods: {
    setRating(value) {
      this.rating = value;
    },
    async submitRating() {
      console.log(this.reviewContent);
      console.log("số sao được đánh giá", this.rating);
      this.closeModal();
    },
    closeModal() {
      const modal = Modal.getInstance(document.getElementById("ratingModal"));
      if (modal) {
        modal.hide();
        // Manually remove the modal backdrop
      }
    },
  },
};
</script>

<style></style>
