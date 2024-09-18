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
}
export default new EmailService();
