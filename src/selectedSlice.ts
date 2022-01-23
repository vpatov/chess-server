import { createSlice } from "@reduxjs/toolkit";

export const selectedSlice = createSlice({
  name: "selected",
  initialState: {
    value: undefined,
  },
  reducers: {
    setSelectedSquare: (state, action) => {
      state.value = action.payload;
    },
    clearSelectedSquare: (state, action) => {
      state.value = undefined;
    },
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedSquare, clearSelectedSquare } = selectedSlice.actions;

export default selectedSlice.reducer;
