import jwtDecode from "jwt-decode";

function isTokenValid(token) {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return false;
  }
}

export default isTokenValid;
