import { createSlice } from '@reduxjs/toolkit';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { useGetMessagesQuery } from '../../app/WebsocketApi.jsx';

const initialState = [];

// import { io } from 'socket.io-client';

// export const sendMessage = createAsyncThunk('messages/messageFetched', async (message) => {
//   await useGetMessagesQuery(message);
// });

// export const receiveMessage = createAsyncThunk('messages/messageFetched', async (message) => {
//   ws.sendMessage(message);
// });

// const sendMessage = createAsyncThunk(
//   'messages/messageFetched',
//   async (text, { getState }) => {
//     const roomToken = selectRoomToken(getState());
//     return socketService.emit('send-message', { text, roomToken });
//   },
// );

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // createChannel(state, action) {
    //   ws.createWebsocket();
    // },
    messagesFetched(state, action) {
      state.push(...action.payload);
    },
    messageFetched(state, action) {
      state.push(action.payload);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(sendMessage.fulfilled, (state, action) => {
  //     state.push(action.payload);
  //   });
  // },
  // extraReducers(builder) {
  //   // omit posts loading reducers
  //   builder.addCase(sendMessage.fulfilled, (state, action) => {
  //     // We can directly add the new post object to our posts array
  //     state.posts.push(action.payload)
  //   });
  // },
});

// export const { messagesFetched, messageFetched, createChannel } = messagesSlice.actions;
export const { messagesFetched, messageFetched } = messagesSlice.actions;

export default messagesSlice.reducer;

export const selectAllMessages = (state) => state.messages;
