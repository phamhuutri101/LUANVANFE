import createApiClient from "./api.services";
class InventoryServices {
  constructor(baseUrl = "/api/v1/inventory") {
    this.api = createApiClient(baseUrl);
  }
  async create(id, payload) {
    const response = await this.api.post(`/${id}`, payload);
    return response.data;
  }
}
export default new InventoryServices();
