import createApiClient from "./api.services";
class UploadServices {
  constructor(baseUrl = "/api/v1/upload") {
    this.api = createApiClient(baseUrl);
  }
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("img", file); // 'file' là tên trường sẽ nhận file ở backend

      const response = await this.api.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng kiểu
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async uploadFiles(formData) {
    try {
      const response = await this.api.post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
export default new UploadServices();
