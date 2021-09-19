import React, { useState, useEffect } from 'react';
import axios from 'axios';

import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const NotFound = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.contentPath(), { headers: getAuthHeader() });
      setContent(data);
    };

    fetchContent();
  }, []);
  console.log(content);
  return <p>Welcome to The Not Found page</p>;
};

export default NotFound;
