import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { channelsFetched } from '../features/channels/ChannelsSlice.jsx';
import { messagesFetched } from '../features/messages/MessagesSlice.jsx';
import MessagesBox from '../features/messages/MessagesBox.jsx';
import ChannelsBox from '../features/channels/ChannelsBox.jsx';
import Modal from '../features/modals/Modal.jsx';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const getAuthHeader = (user) => {
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(routes.contentPath(), { headers: getAuthHeader(user) })
      .then(({ data: { channels, currentChannelId, messages } }) => {
        dispatch(channelsFetched({ channels, currentChannelId }));
        dispatch(messagesFetched(messages));
      })
      .catch((error) => console.error(error));
  });

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 border-end pt-5 px-0 bg-light" md={2}>
          <ChannelsBox />
        </Col>
        <Col className="p-0 h-100">
          <MessagesBox />
        </Col>
      </Row>
      <Modal />
    </Container>
  );
};

export default ChatPage;
