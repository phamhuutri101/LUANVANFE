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
}
export default new ReviewServices();
