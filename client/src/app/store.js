import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../pages/product/productSlice";
import authReducer from "../pages/auth/authSlice";
import userReducer from "../pages/user/userSlice";
import CartSlice from "../pages/cart/cartSlice";
import orderSlice from "../pages/order/orderSlice";
import toggleSlice from "./toggleSlice";
import pwaSlice from "./pwaSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    user: userReducer,
    cart: CartSlice,
    order: orderSlice,
    toggleMode: toggleSlice,
    installBtn: pwaSlice,
  },
});
