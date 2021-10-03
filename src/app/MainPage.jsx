import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

import routes from '../routes.js';
import { channelsFetched } from '../features/channels/ChannelsSlice.jsx';
import { messagesFetched } from '../features/messages/MessagesSlice.jsx';
import MassageList from '../features/messages/MessagesList.jsx';
import ChannelsList from '../features/channels/ChannelsList.jsx';
import Modal from '../features/modals/Modal.jsx';
import WsProvider from '../api/websocketApi.jsx';

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

  return (
    <>
      <WsProvider>
        <div className="d-flex flex-column h-100">
          <Container className="h-100 my-4 overflow-hidden rounded shadow">
            <Row className="h-100 bg-white flex-md-row">
              <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <ChannelsList />
              </Col>
              <Col className="p-0 h-100">
                <MassageList />
              </Col>
            </Row>
          </Container>
        </div>
        <Modal />
      </WsProvider>
    </>
  );
};

export default MainPage;
