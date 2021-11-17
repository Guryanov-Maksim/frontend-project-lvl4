import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    channelsFetched: (state, { payload: { channels, currentChannelId } }) => (
      { channels, currentChannelId }
    ),
    channelFetched: (state, { payload: { channel } }) => {
      state.channels.push(channel);
    },
    currentChannelIdChanged: (state, { payload: { id } }) => {
      state.currentChannelId = id; // eslint-disable-line
    },
    channelRemoved: (state, { payload: { id } }) => {
      state.channels = state.channels.filter((channel) => channel.id !== id); // eslint-disable-line
    },
    channelRenamed: (state, { payload: { renamedChannel } }) => {
      state.channels = state.channels.map((channel) => ( // eslint-disable-line
        channel.id === renamedChannel.id ? renamedChannel : channel
      ));
    },
  },
});

export const {
  channelsFetched,
  channelFetched,
  currentChannelIdChanged,
  channelRemoved,
  channelRenamed,
} = channelsSlice.actions;

export default channelsSlice.reducer;

export const selectAllChannels = (state) => state.channels.channels;

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectActiveChannel = createSelector(
  selectCurrentChannelId,
  selectAllChannels,
  (activeChannelId, channels) => channels.find((channel) => channel.id === activeChannelId),
);
