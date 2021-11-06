import axios from 'axios';

import routes from '../routes.js';
import { callCallbacks, callCallbacksWithData } from '../helpers/callbacksCaller.js';

const getUserData = () => JSON.parse(localStorage.getItem('userId'));
const saveUserData = (data) => localStorage.setItem('userId', JSON.stringify(data));

export default () => {
  const logIn = async (data, { onSuccess, onFail }) => {
    try {
      const res = await axios.post(routes.loginPath(), data);
      saveUserData(res.data);
      callCallbacks(onSuccess);
    } catch (err) {
      if (err.isAxiosError && err.response.status === 401) {
        callCallbacks(onFail);
      }
      throw err;
    }
  };

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

  const fetchContent = async (callbacks) => {
    const { data } = await axios.get(routes.contentPath(), { headers: getAuthHeader() });
    callCallbacksWithData(callbacks, data);
  };

  const signUp = async (data, { onSuccess, onSingUpFail, onNetworkFail }) => {
    try {
      const res = await axios.post(routes.signupPath(), data);
      saveUserData(res.data);
      callCallbacks(onSuccess);
    } catch (err) {
      if (err.response?.status === 409) {
        callCallbacks(onSingUpFail);
        return;
      }
      if (err.isAxiosError) {
        callCallbacks(onNetworkFail);
        return;
      }
      throw err;
    }
  };

  return {
    getAuthHeader,
    fetchContent,
    isAuthUser,
    logIn,
    logOut,
    signUp,
  };
};
