import axios from 'axios';

import routes from '../routes.js';

const getAuthData = () => JSON.parse(localStorage.getItem('userId'));

const saveAuthData = (data) => localStorage.setItem('userId', JSON.stringify(data));

const logIn = (values) => (
  axios.post(routes.loginPath(), values)
    .then(({ data }) => saveAuthData(data))
    .catch((error) => {
      if (error.response?.status === 401) {
        throw new Error('unauthorized');
      }
      if (error.isAxiosError) {
        throw new Error('network');
      }
      throw error;
    })
);

const logOut = () => localStorage.removeItem('userId');

const getAuthHeader = () => {
  const userId = getAuthData();
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const fetchContent = () => axios.get(routes.contentPath(), { headers: getAuthHeader() });

const signUp = (values) => (
  axios.post(routes.signupPath(), values)
    .then(({ data }) => saveAuthData(data))
    .catch((error) => {
      if (error.response?.status === 409) {
        throw new Error('conflict');
      }
      if (error.isAxiosError) {
        throw new Error('network');
      }
      throw error;
    })
);

export default () => (
  {
    getAuthData,
    fetchContent,
    logIn,
    logOut,
    signUp,
  }
);
