import createApiClient from "./api.services";
class CartService {
  constructor(baseUrl = "/api/v1/cart") {
    this.api = createApiClient(baseUrl);
  }
  async addCart(id) {
    try {
      const response = await this.api.post(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async addToCart(id, payload) {
    try {
      const response = await this.api.post(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart with key-value:", error);
      throw error;
    }
  }
  async getCart(page, limit) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async updateCart(payload) {
    try {
      const response = await this.api.put("/", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteCart(id) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async updatePriceReducedAndShipping(payload) {
    try {
      const response = await this.api.put("/updatePriceAndShipping", payload);
    } catch (error) {
      console.error(error);
    }
  }
  async getAllCart() {
    try {
      const response = await this.api.get("/getAll");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new CartService();
