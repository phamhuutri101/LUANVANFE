import { createApp } from "vue";
import { createStore } from "vuex"; // Import createStore từ Vuex

// Tạo store
export const store = createStore({
  state: {
    product: [],
    topRated: [
      {
        id: 1,
        name: "cake 1",
        price: 125000,
        description: "This is a delicious cake",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rdwZ_rXX6loZEHmelvazDGqoWKVeCc7ukA&s",
        rating: 4.0,
        quantity: 10,
      },
      {
        id: 2,
        name: "cake 2",
        price: 174000,
        description: "This is a delicious cake",
        image:
          "https://anhquanbakery.com/uploads/article/nhung-loai-banh-ngot-noi-tieng-tren-the-gioi-1591093362.jpg",
        rating: 4.7,
        quantity: 10,
      },
      {
        id: 3,
        name: "cake 3",
        price: 186000,
        description: "This is a delicious cake",
        image:
          "https://daylambanh.edu.vn/wp-content/uploads/2017/09/cach-lam-banh-kep-thom-ngon-600x400.jpg",
        rating: 4.5,
        quantity: 10,
      },
    ],
    count: 0,
    cartItems: [],
  },
  mutations: {
    addToCart(state, payload) {
      let item = payload;
      item = { ...item, quantity: 1 };
      if (state.cartItems.length > 0) {
        let bool = state.cartItems.some((i) => i.id == item.id);
        if (bool) {
          let itemIndex = state.cartItems.findIndex((el) => el.id === item.id);
          state.cartItems[itemIndex]["quantity"] += 1;
        } else {
          state.cartItems.push(item);
        }
      } else {
        state.cartItems.push(item);
      }
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
