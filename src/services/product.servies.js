import createApiClient from "./api.service";
class ProductService {
  constructor(baseUrl = "/api/v1/product") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(page, limit) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllProduct() {
    try {
      const response = await this.api.get("/getAll");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async create(product) {
    return (await this.api.post("/", product)).data;
  }
  async getProductByIdCategory(id) {
    try {
      const response = await this.api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async searchProducts(keyword) {
    try {
      const response = await this.api.get(`/search?query=${keyword}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with keyword ${keyword}:`, error);
      throw error;
    }
  }
}
export default new ProductService();
