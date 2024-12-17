import createApiClient from "./api.services";
class Shop {
  constructor(baseUrl = "/api/v1/shop") {
    this.api = createApiClient(baseUrl);
  }
  async checkTimeActive(payload) {
    try {
      const response = await this.api.post("/", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async activeShop(id) {
    try {
      const response = await this.api.post(`/active/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async checkActiveShop() {
    try {
      const response = await this.api.get("/checkActive");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async shopNonActive() {
    try {
      const response = await this.api.get("/nonActive");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getNameShopByAccountId(id) {
    try {
      const response = await this.api.get(`/getNameShop/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getNameShopByAccountIdShopper() {
    try {
      const response = await this.api.get("/getNameShopper");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async cancelActiveShop(id) {
    try {
      const response = await this.api.post(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllShop() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new Shop();
