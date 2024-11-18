import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    data: [],
    headerNotification: {
      count: 0,
      list: [],
    },
    isChecked: false,
  },
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setHeaderData(state, action) {
      state.headerNotification = action.payload;
    },
    setNotificationIsChecked(state, action) {
      state.isChecked = action.payload;
    },
  },
});

export const { setData, setHeaderData, setNotificationIsChecked } =
  notificationSlice.actions;

export default notificationSlice.reducer;
