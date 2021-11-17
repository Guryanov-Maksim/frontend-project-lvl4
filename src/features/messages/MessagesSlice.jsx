import { createSlice, createSelector } from '@reduxjs/toolkit';
import { channelRemoved, selectCurrentChannelId } from '../channels/ChannelsSlice.jsx';

const initialState = [];

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messagesFetched: (state, { payload }) => payload,
    messageFetched(state, { payload }) {
      state.push(payload);
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

export const selectActiveChannelMessages = createSelector(
  (state) => state.messages,
  selectCurrentChannelId,
  (allMessages, currentChannelId) => allMessages.filter((m) => m.channelId === currentChannelId),
);
