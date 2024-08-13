import { createSlice } from "@reduxjs/toolkit";

const pwaSlice = createSlice({
  name: "installBtn",
  initialState: {
    deferredPrompt: null,
  },
  reducers: {
    setDeferredPrompt: (state, action) => {
      state.deferredPrompt = action.payload;
    },
  },
});

export const { setDeferredPrompt } = pwaSlice.actions;
export const selectDeferredPrompt = (state) => state.installBtn.deferredPrompt;

export default pwaSlice.reducer;
