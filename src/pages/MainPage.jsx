import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

import { channelsFetched } from '../features/channels/ChannelsSlice.jsx';
import { messagesFetched } from '../features/messages/MessagesSlice.jsx';
import MessagesBox from '../features/messages/MessagesBox.jsx';
import ChannelsBox from '../features/channels/ChannelsBox.jsx';
import Modal from '../features/modals/Modal.jsx';
import Navigation from '../components/Navigation.jsx';
import { useApi } from '../hooks/index.js';

const MainPage = () => {
  const dispatch = useDispatch();
  const api = useApi();

  useEffect(() => {
    const callbacks = [
      ({ channels, currentChannelId }) => dispatch(channelsFetched({ channels, currentChannelId })),
      ({ messages }) => dispatch(messagesFetched(messages)),
    ];

    api.fetchContent(callbacks);
  });

  return (
    <div className="d-flex flex-column h-100">
      <Navigation />
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
    </div>
  );
};

export default MainPage;
