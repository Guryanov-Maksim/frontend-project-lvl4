import { io } from 'socket.io-client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { isMessage } from './schemaValidators';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (build) => ({
    start: build.query({
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const ws = io();
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close();
      },
    }),
    getMessages: build.query({
      query: (channel) => `messages/${channel}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = io();
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event) => {
            // const data = JSON.parse(event.data);
            const { data } = event;
            console.log(data);

            updateCachedData((draft) => {
              draft.push(data);
            });
          };

          ws.addEventListener('newMessage', listener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close();
      },
    }),
  }),
});

export const { useGetMessagesQuery } = api;

// const withTimeout = (onSuccess, onTimeout, timeout) => {
//   let called = false;

//   const timer = setTimeout(() => {
//     if (called) return;
//     called = true;
//     onTimeout();
//   }, timeout);

//   return (...args) => {
//     if (called) return;
//     called = true;
//     clearTimeout(timer);
//     onSuccess.apply(this, args);
//   }
// };

// const ws = {
//   socket: null,
//   createWebsocket() {
//     ws.socket = io();
//     return ws.socket;
//   },
//   sendMessage(message) {
//     ws.socket.volatile.emit('newMessage', message, withTimeout((response) => {
//       console.log('success!');
//       console.log(response);
//       return Promise.resolved();
//       // setMessageStatus('filling');
//       // actions.resetForm();
//     }, () => {
//       // setMessageStatus('failed');
//       console.log('timeout!');
//     }, 1000));
//   },
//   receiveMessage() {
//     ws.socket.on('newMessage', (data) => {
//       console.log(data);
//       // dispatch(messageFetched(data));
//     });
//   },
// };

// export default ws;
