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
      state.channels.push(...channels);
      state.currentChannelId = currentChannelId; // eslint-disable-line no-param-reassign
    },
  },
});

export const { channelsFetched } = channelsSlice.actions;

export default channelsSlice.reducer;

export const selectAllChannels = (state) => state.channels.channels;

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
