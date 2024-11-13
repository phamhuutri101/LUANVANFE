import createApiClient from "./api.services";
class ReviewServices {
  constructor(baseUrl = "/api/v1/reviewsProduct") {
    this.api = createApiClient(baseUrl);
  }
  async AddReviews(id, payload) {
    try {
      const response = await this.api.post(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getReviewsByProductId(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getTotalReviews(id) {
    try {
      const response = await this.api.get(`/totalReview/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllReview(page, limit) {
    try {
      const response = await this.api.get(
        `/getAll/?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getTotalReviewsShop(id) {
    try {
      const response = await this.api.get(`/getTotalReview/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new ReviewServices();
