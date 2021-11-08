import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpen: false, type: null, extra: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalToggled: (state, { payload }) => payload,
  },
});

export const { modalToggled } = modalSlice.actions;

export default modalSlice.reducer;

export const selectModal = (state) => state.modal;
