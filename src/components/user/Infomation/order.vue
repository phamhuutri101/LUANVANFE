<template>
  <div class="col-md-9 background-component background-height p-4">
    <!-- modal đánh giá sp -->
    <div
      class="modal modal-lg fade"
      id="ratingModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ratingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title text-title fs-5" id="ratingModalLabel">
              Đánh Giá Sản Phẩm
            </h1>
          </div>
          <div
            class="modal-body"
            v-if="orderDataRating"
            v-for="item in orderDataRating.LIST_PRODUCT"
            :key="item._id"
          >
            <div class="card">
              <div class="card-body">
                <p>{{ item.NAME_PRODUCT }}</p>
                <div class="d-flex">
                  <p class="classify">Phân loại hàng:</p>
                  <p
                    class="px-1 classify"
                    v-for="classify in item.LIST_MATCH_KEY"
                    :key="classify._id"
                  >
                    {{ classify.VALUE }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label class="product_quality">Chất lượng sản phẩm</label>
              <div class="">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['bi', n <= item.rating ? 'bi-star-fill' : 'bi-star']"
                  @click="item.rating = n"
                  style="color: gold; cursor: pointer; font-size: 25px"
                ></i>
              </div>
              <div class="px-3">
                <small v-if="item.rating === 5" class="text-warning text-rating"
                  >Tuyệt vời</small
                >
                <small v-if="item.rating === 4" class="text-warning text-rating"
                  >Hài lòng</small
                >
                <small
                  v-if="item.rating === 3"
                  class="text-secondary text-rating"
                  >Bình thường</small
                >
                <small
                  v-if="item.rating === 2"
                  class="text-secondary text-rating"
                  >Không hài lòng</small
                >
                <small
                  v-if="item.rating === 1"
                  class="text-secondary text-rating"
                  >Tệ</small
                >
              </div>
            </div>

            <div class="mb-3">
              <textarea
                class="form-control"
                id="reviewText"
                rows="5"
                placeholder="để lại đánh giá."
                v-model="item.desc_reviews"
              ></textarea>
            </div>

            <div class="mb-3">
              <button class="btn btn-outline-success me-2">
                <i class="bi bi-camera"></i> Thêm Hình ảnh
                <input
                  class="input-file"
                  type="file"
                  @change="UploadFile($event, item)"
                  multiple
                />
              </button>
              <div v-if="item.images && item.images.length > 0">
                <h5>Hình ảnh đã upload:</h5>
                <div class="uploaded-images">
                  <img
                    v-for="image in item.images"
                    :key="image._id"
                    :src="image.file_url"
                    alt="Uploaded Image"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer sticky-position">
            <button
              type="button"
              class="btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              TRỞ LẠI
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitRating()"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Hoàn Thành
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal đánh giá sp -->
    <ul
      class="nav nav-pills mb-3 d-flex justify-content-between"
      id="pills-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="AllOrder-tab"
          data-bs-toggle="pill"
          data-bs-target="#AllOrder"
          type="button"
          role="tab"
          aria-controls="AllOrder"
          aria-selected="true"
        >
          Tất cả
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
        >
          Chờ xác nhận
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-contact"
          type="button"
          role="tab"
          aria-controls="pills-contact"
          aria-selected="false"
        >
          Đang xử lý
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="success-order-tab"
          data-bs-toggle="pill"
          data-bs-target="#success-order"
          type="button"
          role="tab"
          aria-controls="success-order"
          aria-selected="false"
        >
          Hoàn thành
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-contact"
          type="button"
          role="tab"
          aria-controls="pills-contact"
          aria-selected="false"
        >
          Đã hủy
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="AllOrder"
        role="tabpanel"
        aria-labelledby="AllOrder-tab"
      >
        <div class="wrap" v-for="item in order" :key="item._id">
          <div class="title-order d-flex py-4 border-bottom">
            <span>Tên shop</span>
            <span class="show-shop"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  src="https://anhvienpiano.com/wp-content/uploads/2018/07/chup-anh-san-pham-dep.jpg"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-4">
              <span>Thành tiền</span>
              <span>{{ formatNumber(calculateTotalPrice(item)) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button>Đã nhận hàng</button>
                <button>Xác nhận hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        2
      </div>
      <div
        class="tab-pane fade"
        id="pills-contact"
        role="tabpanel"
        aria-labelledby="pills-contact-tab"
      >
        3
      </div>
      <div
        class="tab-pane fade"
        id="success-order"
        role="tabpanel"
        aria-labelledby="success-order-tab"
      >
        <div class="wrap" v-for="item in orderSuccess" :key="item._id">
          <div class="title-order d-flex py-4 border-bottom">
            <span>Tên shop</span>
            <span class="show-shop"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  src="https://anhvienpiano.com/wp-content/uploads/2018/07/chup-anh-san-pham-dep.jpg"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-4">
              <span>Thành tiền</span>
              <span>{{ formatNumber(calculateTotalPrice(item)) }}</span>
            </div>
            <div class="notification d-flex justify-content-between">
              <span
                >Đơn hàng đã hoàn thành vui lòng cho biết cảm nhận sản phẩm bằng
                cách đánh giá sản phẩm</span
              >
              <div class="confirm d-flex">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#ratingModal"
                  @click="getOrderSuccessById(item._id)"
                >
                  Đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import { formatNumber } from "@/utils/formatNumber";
import reviewServices from "@/services/review.services";
import uploadServices from "@/services/upload.services";
export default {
  data() {
    return {
      order: [],
      orderSuccess: [],
      reviewId: "",
      rating: 0,
      reviewContent: "",
      orderDataRating: null,
    };
  },
  created() {
    this.getOrder();
    this.getOrderSuccess();
  },
  methods: {
    async getOrder() {
      const order = await orderServices.getOrderUser();
      // Sau khi lấy danh sách đơn hàng, gọi API để lấy tên sản phẩm
      for (const item of order.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.order = order.data;
    },
    async getOrderSuccess() {
      const orderSuccess = await orderServices.getSuccessPaymentOrder();
      for (const item of orderSuccess.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.orderSuccess = orderSuccess.data;
      console.log("sản phẩm đã thanh toán", this.orderSuccess);
    },
    async getOrderSuccessById(id) {
      const response = await orderServices.getOrderById(id);
      for (const item of response.data.LIST_PRODUCT) {
        const NAME_PRODUCT = await this.getNameProduct(item.ID_PRODUCT);
        item.NAME_PRODUCT = NAME_PRODUCT;
        item.rating = 0;
        item.desc_reviews = "";
        item.classify = item.LIST_MATCH_KEY.map((key) => key.VALUE).join(", "); // Ghép các giá trị phân loại thành chuỗi
      }
      this.orderDataRating = response.data;
      console.log("dữ liệu trả về lấy đánh giá", this.orderDataRating);
    },
    async getNameProduct(id) {
      const response = await productServices.getById(id);
    
      return response.data.NAME_PRODUCT;
    },
    calculateTotalPrice(order) {
      return order.LIST_PRODUCT.reduce((total, item) => {
        return total + item.UNITPRICES * item.QLT; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
    },
    formatNumber(number) {
      return formatNumber(number);
    },
    setRating(n, item) {
      item.rating = n;
    },
    async UploadFile(event, item) {
      const files = Array.from(event.target.files);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("imgs", file);
        });
        const response = await uploadServices.uploadFiles(formData);
        const uploadedImages = response.data.map((file) => ({
          file_url: file.url,
          file_type: file.type,
        }));
        if (!item.images) {
          item.images = []; // Khởi tạo mảng nếu chưa có
        }
        item.images.push(...uploadedImages); // Thêm các hình ảnh vào mảng images của sản phẩm
      } catch (error) {
        console.error(error);
      }
    },
    async submitRating() {
      if (!this.orderDataRating) return;

      const reviews = this.orderDataRating.LIST_PRODUCT.map((item) => ({
        ID_PRODUCT: item.ID_PRODUCT,
        number_start: item.rating,
        desc_reviews: item.desc_reviews,
        img_url: item.images.map((img) => img.file_url),
        classify: item.classify,
      }));

      try {
        for (const review of reviews) {
          const payload = {
            number_start: review.number_start,
            desc_reviews: review.desc_reviews,
            img_url: review.img_url,
            classify: review.classify,
          };
          // Gọi API với ID_PRODUCT và payload trong vòng lặp
          const response = await reviewServices.AddReviews(
            review.ID_PRODUCT,
            payload
          );
          console.log(
            "Dữ liệu đánh giá gửi thành công cho sản phẩm",
            review.ID_PRODUCT,
            response
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.img img {
  background: #e1e1e1;
  border: 1px solid #e1e1e1;
  flex-shrink: 0;
  height: 80px;
  width: 80px;
}
.name span {
  font-size: 16px;
  line-height: 12px;
}
.name .classify {
  color: rgba(0, 0, 0, 0.54);
}
.title-order span {
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  margin-right: 8px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  display: flex;
}

.show-shop {
  border: 1px solid rgba(0, 0, 0, 0.09);
  color: #555;
  padding: 5px;
}
.notification span {
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.confirm {
  padding-left: 100px;
}
.confirm button:nth-child(1) {
  background-color: #4caf50;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 10px;
  cursor: pointer;
  width: 192px;
  padding: 0 30px;
  height: 40px;
}
.confirm button:nth-child(2) {
  background-color: #f44336;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 10px;
  cursor: pointer;
  width: 192px;
  padding: 0 30px;
  height: 40px;
}
.total-price span:nth-child(2) {
  color: #44ba69;
  font-size: 24px;
  line-height: 30px;
}
.total-price span:nth-child(1) {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  line-height: 20px;
  margin: 0 10px 0 0;
}
.nav-pills .nav-link.active {
  background-color: #44ba69;
  color: #fff;
}
.nav-pills .nav-link {
  color: #000;
}
.uploaded-images img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  padding: 0 5px;
}
.text-rating {
  font-size: 17px;
}
.classify {
  color: #00000042;
}
.product_quality {
  margin-right: 50px;
  font-size: 14px;
}
.text-title {
  color: #222;
  display: flex;
  font-size: 1.25rem;
  font-weight: 400;
  text-transform: capitalize;
}
.modal-header,
.modal-footer {
  border: none !important;
}
.input-file {
  position: absolute;
  left: 0;
  opacity: 0;
  width: 153px;
  cursor: pointer; /* Để giữ khả năng tương tác khi hover */
}
.btn-outline-primary {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sticky-position {
  position: sticky;
  bottom: 0; /* hoặc top: 0 nếu bạn muốn dính lên đầu */
  z-index: 10;

  background: #fff;
  padding: 20px 0;
}
.modal-content {
  max-height: 76vh; /* Thiết lập chiều cao tối đa cho modal */
  overflow-y: auto; /* Kích hoạt cuộn dọc cho nội dung modal */
}
.background-height {
  min-height: 700px;
}
</style>
