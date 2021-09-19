import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messagesFetched(state, action) {
      state.push(...action.payload);
    },
  },
});

export const { messagesFetched } = messagesSlice.actions;

export default messagesSlice.reducer;
