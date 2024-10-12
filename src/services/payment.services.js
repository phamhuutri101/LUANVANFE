import createApiClient from "./api.services";
class PaymentService {
  constructor(baseUrl = "/api/v1/payment") {
    this.api = createApiClient(baseUrl);
  }
  async paymentCOD() {
    try {
      const response = await this.api.post("/cod");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async paymentMOMO() {
    try {
      const response = await this.api.post("/paymentMOMO");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async paymentZaloPay() {
    try {
      const response = await this.api.post("/paymentZalo");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
export default new PaymentService();
