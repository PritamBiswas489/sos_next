import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    SHOW_LOADER: (state) => {
      state.loading = true;
    },
    HIDE_LOADER: (state) => {
      state.loading = false;
    },
  },
});

export const { SHOW_LOADER, HIDE_LOADER } = loaderSlice.actions;

export default loaderSlice.reducer;