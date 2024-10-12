export function formatNumber(number) {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
