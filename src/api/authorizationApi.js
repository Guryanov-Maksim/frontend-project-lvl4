import axios from 'axios';

import routes from '../routes.js';
import createErrorWithType, { types } from '../error.js';

const logIn = (values) => (
  axios.post(routes.loginPath(), values)
    .then(({ data }) => data)
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

const getAuthHeader = (user) => {
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const fetchContent = (user) => axios.get(routes.contentPath(), { headers: getAuthHeader(user) });

const signUp = (values) => (
  axios.post(routes.signupPath(), values)
    .then(({ data }) => data)
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
    fetchContent,
    logIn,
    signUp,
  }
);
