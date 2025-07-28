import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product._id === productId
      );

      if (productIndex !== -1) {
        const currentProduct = state.products[productIndex];
        if (currentProduct.quantity > 1) {
          // Decrease quantity by 1 if it's greater than 1
          state.products[productIndex].quantity -= 1;
          state.quantity -= 1;
          state.total -= currentProduct.price;
        }
      }
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product._id === productId
      );

      if (productIndex !== -1) {
        // Increase quantity by 1
        state.products[productIndex].quantity += 1;
        state.quantity += 1;
        state.total += state.products[productIndex].price;
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      const removedProductIndex = state.products.findIndex(
        (product) => product._id === productId
      );

      if (removedProductIndex !== -1) {
        const removedProduct = state.products[removedProductIndex];

        // Ensure quantity won't go negative
        const newQuantity = Math.max(
          0,
          state.quantity - removedProduct.quantity
        );

        state.quantity = newQuantity;
        state.total -= removedProduct.price * removedProduct.quantity;
        state.products.splice(removedProductIndex, 1);
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const { addProduct, decreaseQuantity, increaseQuantity, removeItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
