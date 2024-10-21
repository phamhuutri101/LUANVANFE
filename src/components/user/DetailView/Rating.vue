<template>
  <div class="product-review" v-if="totalReviews.length > 0">
    <h2 class="review-title">ĐÁNH GIÁ SẢN PHẨM</h2>
    <div class="review-summary">
      <div class="rating-overview">
        <h3 class="average-rating">
          {{ numberStart.toFixed(1) }}<span>trên 5</span>
        </h3>
        <div class="star-rating">
          <i
            v-for="n in 5"
            :key="n"
            class="bi"
            :class="n <= Math.round(numberStart) ? 'bi-star-fill' : 'bi-star'"
          ></i>
        </div>
      </div>
    </div>
    <div class="review-list">
      <div v-for="review in totalReviews" :key="review.id" class="review-item">
        <div class="user-info">
          <img :src="review.AVATAR_URL" alt="User Avatar" class="user-avatar" />
          <div class="user-details">
            <strong>{{ review.NAME }}</strong>
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
          </div>
        </div>
        <p class="review-meta">
          {{ formatDate(review.REVIEW_DATE) }}| {{ review.CLASSIFY }}
        </p>
        <p class="review-comment">{{ review.REVIEW_CONTENT }}</p>
        <div class="review-media">
          <div class="media-item" v-for="img in review.IMG_URL" :key="img._id">
            <img alt="Review Image" :src="img.FILE_URL" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="not-rating" v-else>
    <h2 class="review-title-non-rating">ĐÁNH GIÁ SẢN PHẨM</h2>
    <div class="text-center pt-5">
      <img
        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/shoprating/7d900d4dc402db5304b2.png"
        alt=""
      />
    </div>

    <p class="text-center py-5 fs-5">Chưa có đánh giá về sản phẩm</p>
  </div>
</template>

<script>
import reviewServices from "@/services/review.services";
import userServices from "@/services/user.services";
const moment = require("moment");
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      numberStart: 0,
      totalReviews: "",
    };
  },
  created() {
    setTimeout(async () => {
      await this.getReviewProductsById();
      await this.getTotalReviewsByProductId();
    }, 100);
  },
  methods: {
    async getReviewProductsById() {
      try {
        const response = await reviewServices.getReviewsByProductId(
          this.product._id
        );
        if (response) {
          this.numberStart = response.data.averageRating || [];
        } else {
          this.numberStart = 0;
        }
      } catch (error) {
        console.error(error);
        this.numberStart = 0;
      }
    },
    async getTotalReviewsByProductId() {
      try {
        const response = await reviewServices.getTotalReviews(this.product._id);

        for (const review of response.data) {
          const user = await userServices.getUserById(review.USER_ID);
          review.NAME = user.data.FULL_NAME;
          review.AVATAR_URL = user.data.AVT_URL;
        }
        this.totalReviews = response.data;
        console.log("lấy tất cả đánh giá", this.totalReviews);
      } catch (error) {
        console.error(error);
        this.totalReviews = "";
      }
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
  },
};
</script>

<style scoped>
.product-review {
  font-family: Arial, sans-serif;

  margin: 0 auto;
  padding: 20px;
}

.review-title {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}

.review-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.rating-overview {
  flex: 0 0 200px;
}

.average-rating {
  font-size: 36px;
  color: #ee4d2d;
  margin: 0;
}

.average-rating span {
  font-size: 24px;
}

.star-rating {
  color: #ee4d2d;
  font-size: 24px;
}

.rating-filters {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  background-color: #fff;
  border: 1px solid #ee4d2d;
  color: #ee4d2d;
  padding: 8px 16px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: #ee4d2d;
  color: #fff;
}

.review-item {
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-details .star-rating {
  font-size: 14px;
}

.review-meta {
  color: #888;
  font-size: 14px;
  margin-bottom: 10px;
}

.review-comment {
  margin-bottom: 10px;
}

.review-media {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.media-item img,
.media-item video {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.helpful-btn {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0;
}

.helpful-btn:hover {
  text-decoration: underline;
}
.review-title-non-rating {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}
</style>
