import createApiClient from "./api.services";
class Search {
  constructor(baseUrl = "/api/v1/search") {
    this.api = createApiClient(baseUrl);
  }
  async searchByKeyword(keyword) {
    try {
      const response = await this.api.get("/", {
        params: { search: keyword },
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new Search();
