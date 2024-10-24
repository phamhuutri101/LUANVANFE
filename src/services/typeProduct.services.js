import createApiClient from "./api.services";
class TypeProductServices {
  constructor(baseUrl = "/api/v1/typeProduct") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllProductByType(id) {
    try {
      const response = await this.api.get(`/productByType/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getCategoryByTypeProduct(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new TypeProductServices();
