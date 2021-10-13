import { createSlice } from '@reduxjs/toolkit';
import { channelRemoved } from '../channels/ChannelsSlice.jsx';

const initialState = [];

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messagesFetched: (state, action) => action.payload,
    messageFetched(state, action) {
      state.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelRemoved, (state, { payload: { id } }) => (
        state.filter((message) => message.channelId !== id)
      ))
      .addDefaultCase(() => {});
  },
});

export const { messagesFetched, messageFetched } = messagesSlice.actions;

export default messagesSlice.reducer;

export const selectAllMessages = (state) => state.messages;
