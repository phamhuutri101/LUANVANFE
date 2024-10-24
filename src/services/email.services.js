import createApiClient from "./api.services";
class EmailService {
  constructor(baseUrl = "/api/v1/sendMail") {
    this.api = createApiClient(baseUrl);
  }
  async sendMailOTP(email) {
    try {
      const response = await this.api.post("/", email);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async sendMailOrder(email) {
    try {
      const response = await this.api.post("/order", email);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async StopAccount(payload) {
    try {
      const response = await this.api.post("/stopAccount", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async ReactiveAccount(payload) {
    try {
      const response = await this.api.post("/reactiveAccount", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new EmailService();
