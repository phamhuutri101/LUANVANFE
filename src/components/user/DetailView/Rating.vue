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
    }, 300);
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
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0 auto;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.product-review:hover {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

.review-title,
.review-title-non-rating {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  border-left: 4px solid #09884d;
  transition: all 0.3s ease;
}

.review-title:hover,
.review-title-non-rating:hover {
  background: #f0f2f5;
  transform: translateX(5px);
}

.review-summary {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.rating-overview {
  flex: 0 0 220px;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.rating-overview:hover {
  transform: translateY(-2px);
}

.average-rating {
  font-size: 42px;
  color: #09884d;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
}

.average-rating span {
  font-size: 18px;
  color: #666;
  font-weight: normal;
  margin-left: 5px;
}

.star-rating {
  color: #ffa41c;
  font-size: 20px;
  display: flex;
  gap: 3px;
  justify-content: center;
  margin: 10px 0;
}

.star-rating .bi {
  transition: all 0.2s ease;
}

.star-rating .bi:hover {
  transform: scale(1.2);
}

.review-item {
  border-top: 1px solid #eef0f2;
  padding: 25px 0;
  transition: all 0.3s ease;
  margin: 10px 0;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.review-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.user-details {
  flex: 1;
}

.user-details strong {
  display: block;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.user-details .star-rating {
  font-size: 14px;
  justify-content: flex-start;
}

.review-meta {
  color: #666;
  font-size: 14px;
  margin: 12px 0;
  padding: 8px 0;
  border-top: 1px dashed #eee;
  border-bottom: 1px dashed #eee;
}

.review-comment {
  font-size: 15px;
  line-height: 1.6;
  color: #4a4a4a;
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #09884d;
}

.review-media {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.media-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.media-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.media-item img,
.media-item video {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.media-item:hover img,
.media-item:hover video {
  filter: brightness(1.1);
}

.helpful-btn {
  background: none;
  border: none;
  color: #09884d;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.helpful-btn:hover {
  background: #e0f7e9;
  color: #076d3d;
}

.not-rating {
  text-align: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.not-rating img {
  max-width: 200px;
  height: auto;
  margin: 20px 0;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.not-rating img:hover {
  opacity: 1;
  transform: scale(1.05);
}

.not-rating p {
  color: #666;
  font-size: 16px;
  margin-top: 20px;
}

/* Animation cho star rating */
@keyframes starPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.star-rating .bi-star-fill {
  animation: starPulse 1s ease;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.review-item.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
