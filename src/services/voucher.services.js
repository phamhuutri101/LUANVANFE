import createApiClient from "./api.services";
class VoucherService {
  constructor(baseUrl = "/api/v1/promo") {
    this.api = createApiClient(baseUrl);
  }
  async getAllVouchers() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new VoucherService();
