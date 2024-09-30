import createApiClient from "./api.services";
class PriceService {
  constructor(baseUrl = "/api/v1/price") {
    this.api = createApiClient(baseUrl);
  }
  async getDefaultPrice(id) {
    try {
      const response = await this.api.get(`/defaultPrice/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getPriceKeyValue(id, payload) {
    try {
      const response = await this.api.get(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
export default new PriceService();
