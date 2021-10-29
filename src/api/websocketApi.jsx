import { io } from 'socket.io-client';

import { messageFetched } from '../features/messages/MessagesSlice.jsx';
import {
  channelFetched,
  channelRemoved,
  currentChannelIdChanged,
  channelRenamed,
} from '../features/channels/ChannelsSlice.jsx';

const withAcknowledge = ({ status }, { onSuccessCallbacks, onFailCallbacks }) => {
  if (status === 'ok') {
    onSuccessCallbacks.forEach((cb) => cb());
  } else {
    onFailCallbacks.forEach((cb) => cb());
  }
};

const withTimeout = (callbacks = { onSuccessCallbacks: [], onFailCallbacks: [] }, timeout) => {
  let called = false; // eslint-disable-line
  const defaultResponse = {};
  const { onSuccessCallbacks, onFailCallbacks } = callbacks;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onFailCallbacks.forEach((cb) => cb());
  }, timeout);

  return (response = defaultResponse) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    if (response.status) {
      withAcknowledge(response, callbacks);
    } else {
      onSuccessCallbacks.forEach((cb) => cb());
    }
  };
};

const createWebsocket = (store, socketClient = io) => {
  const socket = socketClient();
  const timeout = 3000;

  socket.on('newMessage', (message) => {
    store.dispatch(messageFetched(message));
  });

  socket.on('newChannel', (channel) => {
    store.dispatch(channelFetched({ channel }));
    store.dispatch(currentChannelIdChanged({ id: channel.id }));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(channelRemoved({ id }));
  });

  socket.on('renameChannel', (renamedChannel) => {
    store.dispatch(channelRenamed({ renamedChannel }));
  });

  const sendMessage = (message, callbacks) => {
    socket.volatile.emit('newMessage', message, withTimeout(callbacks, timeout));
  };

  const addChannel = (channel, callbacks) => {
    socket.volatile.emit('newChannel', channel, withTimeout(callbacks, timeout));
  };

  const removeChannel = (id, callbacks) => {
    socket.volatile.emit('removeChannel', { id }, withTimeout(callbacks, timeout));
  };

  const renameChannel = (updatedChannel, callbacks) => {
    socket.volatile.emit('renameChannel', updatedChannel, withTimeout(callbacks, timeout));
  };

  return {
    sendMessage,
    addChannel,
    removeChannel,
    renameChannel,
  };
};

export default createWebsocket;
