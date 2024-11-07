import createApiClient from "./api.services";
class SupplierService {
  constructor(baseUrl = "/api/v1/suppliers") {
    this.api = createApiClient(baseUrl);
  }
  async getById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllSuppliers() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new SupplierService();
