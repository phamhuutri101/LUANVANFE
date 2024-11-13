import { createStore } from "vuex";
import cartServices from "@/services/cart.services";

// Tạo store
const store = createStore({
  state: {
    cart: [],
  },
  mutations: {
    setCart(state, cartItems) {
      state.cart = cartItems;
    },
    addToCart(state, item) {
      state.cart.push(item);
    },
    removeFromCart(state, itemId) {
      state.cart = state.cart.filter((item) => item._id !== itemId);
    },
    updateItemQuantity(state, { itemId, quantity }) {
      const item = state.cart.find((item) => item._id === itemId);
      if (item) item.quantity = quantity;
    },
  },
  getters: {
    cartItemCount: (state) => state.cart.length,
  },
  actions: {
    async fetchCart({ commit }) {
      const response = await cartServices.getCart();
      if (response && response.data.length > 0) {
        commit("setCart", response.data);
      }
    },
  },
});

export default store;
