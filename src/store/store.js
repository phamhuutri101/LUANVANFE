import { createStore } from "vuex";
import cartServices from "@/services/cart.services";
const store = createStore({
  state: {
    cartItemCount: 0, // Số lượng sản phẩm trong giỏ hàng
  },
  mutations: {
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    setCartItemCount(state, count) {
      state.cartItemCount = count;
    },
  },
  getters: {
    // Lấy số lượng sản phẩm trong giỏ hàng
    cartItemCount: (state) => state.cartItemCount,
  },
  actions: {
    // Đồng bộ số lượng sản phẩm trong giỏ hàng từ server
    async fetchCartItemCount({ commit }) {
      try {
        const response = await cartServices.getAllCart(); // Gọi API để lấy dữ liệu giỏ hàng
        if (response && response.data) {
          const totalItems = response.data.length;
          commit("setCartItemCount", totalItems); // Cập nhật số lượng sản phẩm vào state
        }
      } catch (error) {
        console.error("Lỗi khi đồng bộ số lượng sản phẩm:", error);
      }
    },
  },
});

export default store;
