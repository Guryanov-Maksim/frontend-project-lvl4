import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { io } from 'socket.io-client';

import routes from '../routes.js';
import { channelsFetched, channelFetched } from '../features/channels/ChannelsSlice.jsx';
import { messagesFetched, messageFetched } from '../features/messages/MessagesSlice.jsx';
import MassageList from '../features/messages/MessagesList.jsx';
import ChannelsList from '../features/channels/ChannelsList.jsx';
import Modal from '../features/modals/Modal.jsx';
import { modalToggled, selectModal } from '../features/modals/ModalsSlice.js';

let socket = null;

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

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const MainPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.contentPath(), { headers: getAuthHeader() });
      const { messages, channels, currentChannelId } = data;
      dispatch(channelsFetched({ channels, currentChannelId }));
      dispatch(messagesFetched(messages));
    };

    fetchContent();
  }, []);

  useEffect(() => {
    socket = io();
  }, []);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      dispatch(messageFetched(data));
    });

    socket.on('newChannel', (data) => {
      console.log(data);
      dispatch(channelFetched({ channel: data }));
    });
  }, []);

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
    const { setChannelStatus } = callbacks;
    setChannelStatus('sending');
    // console.log(channel);
    socket.volatile.emit('newChannel', channel, withTimeout((response) => {
      setChannelStatus('filling');
    }, () => {
      // setChannelStatus('failed');
      console.log('timeout!');
    }, 1000));
  };

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Container className="h-100 my-4 overflow-hidden rounded shadow">
          <Row className="h-100 bg-white flex-md-row">
            <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
              <ChannelsList />
            </Col>
            <Col className="p-0 h-100">
              <MassageList sendMessage={sendMessage} />
            </Col>
          </Row>
        </Container>
      </div>
      <Modal addChannel={addChannel} />
    </>
  );
};

export default MainPage;
