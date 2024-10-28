import createApiClient from "./api.services";
class Category {
  constructor(baseUrl = "/api/v1/category") {
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
  
}
export default new Category();
