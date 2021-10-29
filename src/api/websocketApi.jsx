import { io } from 'socket.io-client';

import { messageFetched } from '../features/messages/MessagesSlice.jsx';
import {
  channelFetched,
  channelRemoved,
  currentChannelIdChanged,
  channelRenamed,
} from '../features/channels/ChannelsSlice.jsx';

const mapping = {
  addChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
  sendMessage: 'newMessage',
};

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

  const manageData = (operation) => (data, callbacks) => {
    socket.volatile.emit(operation, data, withTimeout(callbacks, timeout));
  };

  socket.on('newMessage', (message) => {
    store.dispatch(messageFetched(message));
  });

  socket.on('newChannel', (channel) => {
    store.dispatch(channelFetched({ channel }));
    store.dispatch(currentChannelIdChanged({ id: channel.id }));
  });

  socket.on('removeChannel', (data) => {
    store.dispatch(channelRemoved(data));
  });

  socket.on('renameChannel', (renamedChannel) => {
    store.dispatch(channelRenamed({ renamedChannel }));
  });

  const sendMessage = manageData(mapping.sendMessage);
  const addChannel = manageData(mapping.addChannel);
  const removeChannel = manageData(mapping.removeChannel);
  const renameChannel = manageData(mapping.renameChannel);

  return {
    sendMessage,
    addChannel,
    removeChannel,
    renameChannel,
  };
};

export default createWebsocket;
