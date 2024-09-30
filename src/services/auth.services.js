import createApiClient from "./api.services";

class AuthService {
  constructor(baseUrl = "/api/v1/auth") {
    this.api = createApiClient(baseUrl);
  }

  async register(user) {
    try {
      const response = await this.api.post("/register", user);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(user) {
    try {
      const response = await this.api.post("/login", user);
      console.log("Login response data:", response);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async activeOtp(email, code) {
    try {
      // Đảm bảo rằng bạn gửi một đối tượng với các trường email và otp
      const response = await this.api.post("/active", {
        email: email,
        code: code,
      });
      // Kiểm tra xem response.data có tồn tại và có thuộc tính 'message' không
      if (response.data && response.data.message) {
        return response.data.message;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error) {
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Config:", error.config);
  }
}

export default new AuthService();
