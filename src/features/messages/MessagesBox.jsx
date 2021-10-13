import React from 'react';
import { useSelector } from 'react-redux';

import { selectAllMessages } from './MessagesSlice.jsx';
import { selectCurrentChannelId } from '../channels/ChannelsSlice.jsx';
import Header from './Header.jsx';
import SendForm from './SendForm.jsx';

const Message = ({ message }) => (
  <div className="text-break mb-2">
    <b>{`${message.username}: `}</b>
    {message.text}
  </div>
);

const Messages = ({ messages }) => (
  <div className="overflow-auto px-5">
    {messages.map((message) => (
      <Message key={message.id} message={message} />
    ))}
  </div>
);

const MessagesBox = () => {
  const allMessages = useSelector(selectAllMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const activeChannelMessages = allMessages.filter((m) => m.channelId === currentChannelId);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <Header messagesCount={activeChannelMessages.length} />
        <Messages messages={activeChannelMessages} />
        <SendForm />
      </div>
    </div>
  );
};

export default MessagesBox;
