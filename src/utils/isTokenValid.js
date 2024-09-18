import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Token không hợp lệ", error);
    return false;
  }
}

export default isTokenValid;
