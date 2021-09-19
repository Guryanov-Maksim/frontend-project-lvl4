import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';
import { channelsFetched } from '../features/channels/ChannelsSlice.jsx';
import { messagesFetched } from '../features/messages/MessagesSlice.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const NotFound = () => {
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

  return <p>Welcome to The Not Found page</p>;
};

export default NotFound;
