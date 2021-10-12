import React, { useContext, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
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
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values, actions) => {
      console.log(actions);
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const message = {
        text: values.text,
        channelId: currentChannelId,
        username,
      };
      const callbacks = {
        onSuccess: [
          () => actions.resetForm(),
          () => inputRef.current.focus(),
        ],
        onFail: [
          () => actions.setSubmitting(false),
          () => inputRef.current.focus(),
        ],
      };
      ws.sendMessage(message, callbacks);
    },
  });

  console.log(formik);

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Control
          type="text"
          name="text"
          value={formik.values.text}
          onChange={formik.handleChange}
          data-testid="new-message"
          placeholder={t('messages.placeholder')}
          ref={inputRef}
        />
        <Button className="btn btn-group-vertical" disabled={formik.values.text === '' || formik.isSubmitting} type="submit">
          {t('messages.submitButton')}
        </Button>
      </Form>
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
