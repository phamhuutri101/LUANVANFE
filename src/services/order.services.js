import createApiClient from "./api.services";
class OrderService {
  constructor(baseUrl = "/api/v1/order") {
    this.api = createApiClient(baseUrl);
  }
  async addOrder(address) {
    try {
      const response = await this.api.post("/", address);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getOrderUser() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getSuccessPaymentOrder() {
    try {
      const response = await this.api.get("/successPayment");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getOrderById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new OrderService();
