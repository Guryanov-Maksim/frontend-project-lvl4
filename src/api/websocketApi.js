import { messageFetched } from '../features/messages/MessagesSlice.jsx';
import {
  channelFetched,
  channelRemoved,
  currentChannelIdChanged,
  channelRenamed,
} from '../features/channels/ChannelsSlice.jsx';

const callCallbacks = (callbacks) => callbacks.forEach((cb) => cb());

const mapping = {
  addChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
  sendMessage: 'newMessage',
};

const withAcknowledge = ({ status }, { onSuccess, onFail }) => {
  if (status === 'ok') {
    callCallbacks(onSuccess);
  } else {
    callCallbacks(onFail);
  }
};

const withTimeout = (callbacks = { onSuccess: [], onFail: [] }, timeout) => {
  let called = false; // eslint-disable-line
  const defaultResponse = {};
  const { onSuccess, onFail } = callbacks;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    callCallbacks(onFail);
  }, timeout);

  return (response = defaultResponse) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    if (response.status) {
      withAcknowledge(response, callbacks);
    } else {
      callCallbacks(onSuccess);
    }
  };
};

export default (store, socket) => {
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
