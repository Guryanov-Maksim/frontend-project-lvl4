import { configureStore } from '@reduxjs/toolkit';

import channelsReducer from './features/channels/ChannelsSlice.jsx';
import messagesReducer from './features/messages/MessagesSlice.jsx';
import modalReducer from './features/modals/ModalsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
  },
});
