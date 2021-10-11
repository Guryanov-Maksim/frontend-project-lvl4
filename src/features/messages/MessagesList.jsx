import React, { useState, useContext } from 'react';
import { Formik, Field, Form } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectAllMessages } from './MessagesSlice.jsx';
import { selectCurrentChannelId, selectAllChannels } from '../channels/ChannelsSlice.jsx';
import { wsContext } from '../../contexts/index.jsx';

const MessageExcerpt = ({ message }) => (
  <div className="text-break mb-2">
    {message.text}
  </div>
);

const MessageForm = () => {
  const ws = useContext(wsContext);
  const [messageStatus, setMessageStatus] = useState('filling');
  const currentChannelId = useSelector(selectCurrentChannelId);
  const [t] = useTranslation();

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
          ws.sendMessage(message, { setMessageStatus, actions });
        }}
      >
        {({ values }) => (
          <Form>
            <Field name="text" data-testid="new-message" placeholder={t('messages.placeholder')} />
            <button className="btn btn-group-vertical" disabled={values.text === '' || messageStatus === 'sending'} type="submit">
              <span className="visually-hidden">{t('messages.submitButton')}</span>
            </button>
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

const Messages = ({ messages }) => (
  messages.map((message) => (
    <MessageExcerpt key={message.id} message={message} />
  ))
);

const MessagesList = () => {
  const allMessages = useSelector(selectAllMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const activeChannelMessages = allMessages.filter((m) => m.channelId === currentChannelId);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader messagesCount={activeChannelMessages.length} />
        <Messages messages={activeChannelMessages} />
        <MessageForm />
      </div>
    </div>
  );
};

export default MessagesList;
