import createApiClient from "./api.services";
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
  async getProductShop(page, limit) {
    try {
      const response = await this.api.get(
        `/shopProduct/?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getProductShopByIdAccount(id_account, page, limit) {
    try {
      const response = await this.api.get(
        `/getProductShopByIdAccount/${id_account}/?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
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
    return (await this.api.post("/createProduct", product)).data;
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
  async deleteProduct(id) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async getProductKeyValue(id) {
    try {
      const response = await this.api.get(`/getKV/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getTotalProductShop(id) {
    try {
      const response = await this.api.get(`/getProductTotalShop/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getTotalProductShopper() {
    try {
      const response = await this.api.get("/getProductTotalShopper");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
export default new ProductService();
