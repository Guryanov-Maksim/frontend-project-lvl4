import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { useSelector } from 'react-redux';

import { selectAllMessages } from './MessagesSlice.jsx';
import { selectCurrentChannelId, selectAllChannels } from '../channels/ChannelsSlice.jsx';

const MessageExcerpt = ({ message }) => (
  <div className="text-break mb-2">
    {message.text}
  </div>
);

const MessageForm = ({ sendMessage }) => {
  const [messageStatus, setMessageStatus] = useState('filling');
  const currentChannelId = useSelector(selectCurrentChannelId);

  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={{
          text: '',
        }}
        onSubmit={(values, actions) => {
          const { username } = JSON.parse(localStorage.getItem('userId'));
          const message = {
            text: values.text,
            channelId: currentChannelId,
            username,
          };
          sendMessage(message, { setMessageStatus, actions });
        }}
      >
        {({ values }) => (
          <Form>
            <Field name="text" placeholder="Enter your message..." />
            <button disabled={values.text === '' || messageStatus === 'sending'} type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
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

  return (
    messages.map((message) => (
      <MessageExcerpt key={message.id} message={message} />
    ))
  );
};

const MessagesList = ({ sendMessage }) => {
  const messages = useSelector(selectAllMessages);

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
