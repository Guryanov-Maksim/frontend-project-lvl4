import createAuthApi from './authorizationApi.js';
import createWebsocketApi from './websocketApi.js';

export default (store, socket) => {
  const socketApi = createWebsocketApi(store, socket);
  const authApi = createAuthApi();
  return {
    ...socketApi,
    ...authApi,
  };
};
