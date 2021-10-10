import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import { wsContext } from '../contexts/index.jsx';
import { messageFetched } from '../features/messages/MessagesSlice.jsx';
import { channelFetched, channelRemoved, currentChannelIdChanged, channelRenamed } from '../features/channels/ChannelsSlice.jsx';

const withTimeout = (onSuccess, onTimeout, timeout) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess.apply(this, args);
  };
};

const WsProvider = ({ children, socketClient }) => {
  const dispatch = useDispatch();

  const socket = socketClient();

  useEffect(() => {
    if (socket !== null) {
      socket.on('newMessage', (data) => {
        dispatch(messageFetched(data));
      });

      socket.on('newChannel', (data) => {
        console.log(data);
        dispatch(channelFetched({ channel: data }));
        dispatch(currentChannelIdChanged({ id: data.id }));
      });

      socket.on('removeChannel', ({ id }) => {
        dispatch(channelRemoved({ id }));
      });

      socket.on('renameChannel', (channel) => {
        dispatch(channelRenamed({ renamedChannel: channel }));
      });
    }
  }, [socket]);

  const sendMessage = (message, callbacks) => {
    const { setMessageStatus, actions } = callbacks;
    setMessageStatus('sending');
    socket.volatile.emit('newMessage', message, withTimeout((response) => {
      setMessageStatus('filling');
      actions.resetForm();
    }, () => {
      setMessageStatus('failed');
      console.log('timeout!');
    }, 1000));
  };

  const addChannel = (channel, callbacks) => {
    const { inputRef, onHide, actions } = callbacks;
    socket.volatile.emit('newChannel', channel, withTimeout((response) => {
      onHide();
    }, () => {
      actions.setSubmitting(false);
      inputRef.current.focus();
      console.log('timeout!');
    }, 1000));
  };

  const removeChannel = (id, callbacks) => {
    const { onHide, defautlChannelId } = callbacks;
    socket.volatile.emit('removeChannel', { id }, withTimeout((response) => {
      dispatch(currentChannelIdChanged({ id: defautlChannelId }));
      onHide();
    }, () => {
      console.log('timeout!');
    }, 1000));
  };

  const renameChannel = ({ id, newName }, callbacks) => {
    const { inputRef, onHide, actions } = callbacks;
    socket.volatile.emit('renameChannel', { id, name: newName }, withTimeout((response) => {
      onHide();
    }, () => {
      inputRef.current.focus();
      actions.setSubmitting(false);
      console.log('renameChannel timeout!');
    }, 2000));
  };

  const ws = {
    sendMessage,
    addChannel,
    removeChannel,
    renameChannel,
  };

  return (
    <wsContext.Provider value={ws}>
      {children}
    </wsContext.Provider>
  );
};

export default WsProvider;
