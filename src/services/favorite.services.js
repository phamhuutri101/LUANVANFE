import createApiClient from "./api.services";
class FavoriteService {
  constructor(baseUrl = "/api/v1/favorites") {
    this.api = createApiClient(baseUrl);
  }
  async addFavorite(productId) {
    try {
      const response = await this.api.post(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async updateFavorite(productId) {
    try {
      const response = await this.api.put(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getFavorite(productId) {
    try {
      const response = await this.api.get(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getProductFavorite() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new FavoriteService();
