import createApiClient from "./api.services";
class promoServices {
  constructor(baseUrl = "/api/v1/promo") {
    this.api = createApiClient(baseUrl);
  }
  async addDiscount(payload) {
    try {
      const response = await this.api.post("/", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async checkPromoCode(payload) {
    try {
      const response = await this.api.post("/checkPromoCode", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllPromo(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async promoCheckActive() {
    try {
      const response = await this.api.post("/checkActivePromoCode");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async deletePromoCode(id) {
    try {
      const response = await this.api.post(`/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new promoServices();
