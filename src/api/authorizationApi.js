import axios from 'axios';

import routes from '../routes.js';

const getUserData = () => JSON.parse(localStorage.getItem('userId'));

const saveUserData = (data) => localStorage.setItem('userId', JSON.stringify(data));

const logIn = (values) => (
  axios.post(routes.loginPath(), values)
    .then(({ data }) => saveUserData(data))
    .catch((error) => {
      if (error.isAxiosError && error.response?.status === 401) {
        throw new Error('unauthorized');
      }
      if (error.isAxiosError) {
        throw new Error('network');
      }
      throw error;
    })
);

const isAuthUser = () => {
  const userId = getUserData();
  if (userId && userId.token) {
    return true;
  }

  return false;
};

const getAuthHeader = () => {
  const userId = getUserData();
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const logOut = () => localStorage.removeItem('userId');

const fetchContent = () => axios.get(routes.contentPath(), { headers: getAuthHeader() });

const signUp = (values) => (
  axios.post(routes.signupPath(), values)
    .then(({ data }) => saveUserData(data))
    .then(() => Promise.resolve())
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
    getAuthHeader,
    fetchContent,
    isAuthUser,
    logIn,
    logOut,
    signUp,
  }
);
