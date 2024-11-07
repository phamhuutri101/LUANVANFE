import createApiClient from "./api.services";
class UserService {
  constructor(baseUrl = "/api/v1/user") {
    this.api = createApiClient(baseUrl);
  }
  async getUserLogin() {
    try {
      const response = await this.api.get("/UserLogin");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getUserById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllUsers() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async updateAVTUser(img) {
    try {
      const response = await this.api.put("/", img);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async updateInfo(payload) {
    try {
      const response = await this.api.put("/updateProfile", payload);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async updateNumberUser() {
    try {
      const response = await this.api.get("/realtimeUser");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getUserByAccountId(id) {
    try {
      const response = await this.api.get(`/getUserByAccountId/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new UserService();
