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
  async getAllPromo() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new promoServices();
