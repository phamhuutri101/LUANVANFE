import createApiClient from "./api.services";
class InventoryServices {
  constructor(baseUrl = "/api/v1/inventory") {
    this.api = createApiClient(baseUrl);
  }
  async create(id, payload) {
    try {
      const response = await this.api.post(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getInventory() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getInventoryById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteInventory(id) {
    try {
      const response = await this.api.delete(`/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getInventoryByIdProduct(id) {
    try {
      const response = await this.api.get(`/getByIdProduct/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new InventoryServices();
