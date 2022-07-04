import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    data: [],
    headerNotification: {
      count: 0,
      list: [],
    },
  },
  reducers: {
    setData(state, action) {
      state.data = [...state.data, ...action.payload];
    },
    setHeaderData(state, action) {
      state.headerNotification = action.payload;
    },
  },
});

export const { setData, setHeaderData } = notificationSlice.actions;

export default notificationSlice.reducer;
