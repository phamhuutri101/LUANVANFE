import axios from "axios";
import getCookieValue from "@/utils/getCookie";

// Tạo một instance của axios với baseURL
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Thêm interceptor để đẩy token lên header cho mỗi request
  instance.interceptors.request.use((config) => {
    const token = getCookieValue("access_token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  });

  return instance;
};

export default createAxiosInstance;
