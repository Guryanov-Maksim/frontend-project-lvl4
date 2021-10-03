import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpen: false, type: null, extra: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalToggled: (state, { payload }) => ({ ...state, ...payload }),
  },
});

export const { modalToggled } = modalSlice.actions;

export default modalSlice.reducer;

export const selectModal = (state) => state.modal;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = { modal: { isOpen: false, type: null, extra: null } };

// const modalSlice = createSlice({
//   name: 'modal',
//   initialState,
//   reducers: {
//     modalToggled(state, { payload: { modal } }) {
//       console.log('Modal reducer');
//       // state.modal = modal; // eslint-disable-line no-param-reassign
//     },
//   },
// });

// export const { modalToggled } = modalSlice.actions;

// export default modalSlice.reducer;

// export const selectModal = (state) => state;
