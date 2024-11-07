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
  async getPriceRange(id) {
    try {
      const response = await this.api.get(`/range/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getPriceKeyValue(id, payload) {
    try {
      const response = await this.api.post(`/get_price/${id}`, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async addPriceProduct(id, payload) {
    try {
      const response = await this.api.post(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getById(id) {
    try {
      const response = await this.api.get(`/getById/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async addPriceDefault(id) {
    try {
      await this.api.get(`/addPriceDefault/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
  async deletePrice(id, payload) {
    try {
      const response = await this.api.post(`/deletePrice/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new PriceService();
