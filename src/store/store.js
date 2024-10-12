import { createApp } from "vue";
import { createStore } from "vuex"; // Import createStore từ Vuex

// Tạo store
export const store = createStore({
  state: {
    product: [],
    count: 0,
    cartItems: [],
  },
  mutations: {
    addToCart(state, payload) {
      let item = payload;
      item = { ...item, quantity: 1 };

      // Tạo một bản sao mới của mảng cartItems
      let updatedCartItems = [...state.cartItems];

      let existingItemIndex = updatedCartItems.findIndex(
        (i) => i.id == item.id
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        updatedCartItems[existingItemIndex]["quantity"] += 1;
      } else {
        // Nếu là sản phẩm mới, thêm vào mảng
        updatedCartItems.push(item);
      }

      // Cập nhật giỏ hàng với mảng mới
      state.cartItems = updatedCartItems;

      console.log("Updated cart items:", state.cartItems);
      state.count++;
    },
    removeItem(state, payload) {
      if (state.cartItems.length > 0) {
        let bool = state.cartItems.some((i) => i.id == payload.id);
        if (bool) {
          let index = state.cartItems.findIndex((el) => el.id === payload.id);
          if (state.cartItems[index]["quantity"] !== 0) {
            state.cartItems[index]["quantity"] -= 1;
            state.count--;
          }
          if (state.cartItems[index]["quantity"] == 0) {
            state.cartItems.splice(index, 1);
          }
        }
      }
    },
  },
  actions: {
    addToCart: (context, payload) => {
      context.commit("addToCart", payload);
    },
    removeItem: (context, payload) => {
      context.commit("removeItem", payload);
    },
  },
});
const app = createApp({
  /* your root component */
});

// Install the store instance as a plugin
app.use(store);
