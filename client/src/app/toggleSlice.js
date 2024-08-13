import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggleMode",
  initialState: {
    selectedMode: true,
  },
  reducers: {
    toggleSelectedMode: (state) => {
      state.selectedMode = !state.selectedMode;
      document.body.classList.toggle("dark");
    },
  },
});

export const { toggleSelectedMode } = toggleSlice.actions;
export const selectedMode = (state) => state.toggleMode.selectedMode;


export default toggleSlice.reducer;
