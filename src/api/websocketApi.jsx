import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import { wsContext } from '../contexts/index.jsx';
import { messageFetched } from '../features/messages/MessagesSlice.jsx';
import { channelFetched, channelRemoved, currentChannelIdChanged } from '../features/channels/ChannelsSlice.jsx';

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

const WsProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socket = io();

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
    const { inputRef, onHide } = callbacks;
    socket.volatile.emit('newChannel', channel, withTimeout((response) => {
      onHide();
    }, () => {
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

  const ws = {
    sendMessage,
    addChannel,
    removeChannel,
  };

  return (
    <wsContext.Provider value={ws}>
      {children}
    </wsContext.Provider>
  );
};

export default WsProvider;
