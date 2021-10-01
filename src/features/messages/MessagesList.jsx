import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
// import { io } from 'socket.io-client';

import { selectAllMessages, messageFetched } from './MessagesSlice.jsx';
// import { selectAllMessages, messageFetched, createChannel, sendMessage } from './MessagesSlice.jsx';
import { selectCurrentChannelId, selectAllChannels } from '../channels/ChannelsSlice.jsx';

// import ws from '../../app/WebsocketApi.jsx';

// const socket = io();
// const socket = ws.createWebsocket();

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
// }

const MessageExcerpt = ({ message }) => (
  <div className="text-break mb-2">
    {message.text}
  </div>
);

// (response) => {
//   setMessageStatus('filling');
//   // return 'truetrue';
//   actions.resetForm();
// }, () => {
//   setMessageStatus('failed');
//   console.log('timeout!');
// }, 1000));

// const callbacks = () => {
//   onSuccess: (response) => {

//   },
//   onTimeout: () => {

//   },
// };

const MessageForm = ({ sendMessage }) => {
  const [messageStatus, setMessageStatus] = useState('filling');

  return (
    <Formik
      initialValues={{
        text: '',
      }}
      onSubmit={(values, actions) => {
        const message = { text: values.text };
        sendMessage(message, { setMessageStatus, actions });
        // console.log(result);
        // if (messageStatus === 'filling') {
        //   actions.resetForm();
        // }
      }}
    >
      {({ values }) => (
        <Form>
          <Field name="text" placeholder="Enter your message..." />
          <button disabled={values.text === '' || messageStatus === 'sending'} type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

const MessagesHeader = ({ messagesCount }) => {
  const activeChannelId = useSelector(selectCurrentChannelId);
  const channels = useSelector(selectAllChannels);
  const currentChannel = channels.find((channel) => channel.id === activeChannelId);

  return (
    <>
      {currentChannel && (
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {currentChannel.name}
              {messagesCount}
            </b>
          </p>
        </div>
      )}
    </>
  );
};

const Messages = () => {
  const messages = useSelector(selectAllMessages);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   socket.on('newMessage', (data) => {
  //     // console.log(data);
  //     dispatch(messageFetched(data));
  //   });
  // }, []);

  return (
    messages.map((message) => (
      <MessageExcerpt key={message.id} message={message} />
    ))
  );
};

const MessagesList = ({ sendMessage }) => {
  const messages = useSelector(selectAllMessages);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(createChannel());
  //   // const socket = ws.createWebsocket();
  // }, []);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader messagesCount={messages.length} />
        <Messages />
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default MessagesList;
