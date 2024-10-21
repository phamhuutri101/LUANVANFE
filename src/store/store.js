import cartServices from "@/services/cart.services";
import { createApp } from "vue";
import { createStore } from "vuex";

// Tạo store
export const store = createStore({
  state: {
    product: [],
    count: 0, // Tổng số lượng sản phẩm trong giỏ hàng
    cartItems: [], // Danh sách các sản phẩm trong giỏ hàng
  },
  mutations: {
    addToCart(state, payload) {
      // Payload là sản phẩm được thêm vào giỏ hàng
      let item = payload;
      item = { ...item, quantity: 1 }; // Mặc định số lượng là 1

      // Tìm kiếm sản phẩm trong giỏ hàng
      let existingItemIndex = state.cartItems.findIndex((i) => i.id == item.id);

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        state.cartItems[existingItemIndex].quantity += 1;
      } else {
        // Nếu là sản phẩm mới, thêm vào giỏ hàng
        state.cartItems.push(item);
      }

      // Tăng tổng số lượng sản phẩm trong giỏ hàng
      state.count++;
    },
    removeItem(state, payload) {
      // Tìm sản phẩm trong giỏ hàng
      let existingItemIndex = state.cartItems.findIndex(
        (i) => i.id == payload.id
      );

      if (existingItemIndex !== -1) {
        // Giảm số lượng nếu số lượng lớn hơn 1
        if (state.cartItems[existingItemIndex].quantity > 1) {
          state.cartItems[existingItemIndex].quantity -= 1;
          state.count--; // Giảm tổng số lượng sản phẩm
        } else {
          // Nếu số lượng bằng 1, thì xóa sản phẩm khỏi giỏ hàng
          state.cartItems.splice(existingItemIndex, 1);
          state.count--; // Giảm tổng số lượng sản phẩm
        }
      }
    },
    clearCart(state) {
      // Xóa toàn bộ giỏ hàng
      state.cartItems = [];
      state.count = 0;
    },
    setCart(state, cartData) {
      // Nếu dữ liệu trả về là mảng rỗng, không làm gì
      if (!cartData || cartData.length === 0) {
        state.cartItems = [];
        state.count = 0;
        return;
      }

      // Duyệt qua dữ liệu trả về để tạo danh sách giỏ hàng
      const items = cartData.map((item) => ({
        id: item.ITEM.ID_PRODUCT, // ID của sản phẩm
        name: item.PRODUCT_DETAILS.NAME_PRODUCT, // Tên sản phẩm
        description: item.PRODUCT_DETAILS.SHORT_DESC, // Mô tả ngắn
        quantity: item.ITEM.QUANTITY, // Số lượng sản phẩm
        price: item.ITEM.PRICE, // Giá của sản phẩm
        total: item.ITEM.QUANTITY * item.ITEM.PRICE, // Tổng tiền
        matchKeys: item.ITEM.LIST_MATCH_KEY, // Các thuộc tính sản phẩm
      }));

      // Cập nhật giỏ hàng
      state.cartItems = items;

      // Tính tổng số lượng sản phẩm trong giỏ hàng
      state.count = items.reduce((total, item) => total + item.quantity, 0);
    },
  },
  actions: {
    addToCart({ commit }, payload) {
      commit("addToCart", payload); // Thực hiện mutation để thêm sản phẩm
    },
    removeItem({ commit }, payload) {
      commit("removeItem", payload); // Thực hiện mutation để xóa sản phẩm
    },
    async fetchCart({ commit }) {
      try {
        // Gọi API lấy giỏ hàng
        const response = await cartServices.getCart();

        if (response && response.success) {
          // Nếu thành công, commit dữ liệu giỏ hàng vào store
          commit("setCart", response.data);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },
  },
  getters: {
    cartItems: (state) => state.cartItems, // Lấy danh sách sản phẩm trong giỏ hàng
    cartCount: (state) => state.count, // Lấy tổng số lượng sản phẩm
  },
});

// Cài đặt store vào ứng dụng Vue
const app = createApp({
  /* root component */
});

app.use(store);
