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
  async getOrderUser(page, limit) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
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
  async getLastStatusOrder(id) {
    try {
      const response = await this.api.get(`/lastStatusOrderCode/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async receivedGoods(id_account, payload) {
    try {
      const response = await this.api.post(
        `/receivedGoods/${id_account}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async confirmedOrder(id_account, payload) {
    try {
      const response = await this.api.post(
        `/is_confirmed/${id_account}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async sendOrder(id_account, payload) {
    try {
      response = await this.api.post(`/sendGoods/${id_account}`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async successOrder(id_account, payload) {
    try {
      const response = await this.api.post(
        `/receivedGoods/${id_account}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteOrder(id) {
    try {
      const response = await this.api.post(`/deleteOrder/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getOrderPriceInDay() {
    try {
      const response = await this.api.get("/getPriceInDay");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getOrderPriceInMonth() {
    try {
      const response = await this.api.get("/getPriceInMonth");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getOrderInDay() {
    try {
      const response = await this.api.get("/getOrderInDay");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new OrderService();
