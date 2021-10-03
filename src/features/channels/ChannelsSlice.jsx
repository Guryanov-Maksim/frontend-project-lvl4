import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    channelsFetched(state, { payload: { channels, currentChannelId } }) {
      state.channels = channels; // eslint-disable-line no-param-reassign
      state.currentChannelId = currentChannelId; // eslint-disable-line no-param-reassign
    },
    channelFetched(state, { payload: { channel } }) {
      state.channels.push(channel);
    },
    currentChannelIdChanged(state, { payload: { id } }) {
      state.currentChannelId = id; // eslint-disable-line no-param-reassign
    },
  },
});

export const { channelsFetched, channelFetched, currentChannelIdChanged } = channelsSlice.actions;

export default channelsSlice.reducer;

export const selectAllChannels = (state) => state.channels.channels;

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
