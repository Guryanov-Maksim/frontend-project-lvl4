import axios from 'axios';

import routes from '../routes.js';
import createErrorWithType, { types } from '../error.js';

const getAuthData = () => JSON.parse(localStorage.getItem('userId'));

const saveAuthData = (data) => localStorage.setItem('userId', JSON.stringify(data));

const logIn = (values) => (
  axios.post(routes.loginPath(), values)
    .then(({ data }) => saveAuthData(data))
    .catch((error) => {
      if (error.response?.status === 401) {
        throw createErrorWithType(error, types.unauthorized);
      }
      if (error.isAxiosError) {
        throw createErrorWithType(error, types.network);
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
        throw createErrorWithType(error, types.conflict);
      }
      if (error.isAxiosError) {
        throw createErrorWithType(error, types.network);
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
