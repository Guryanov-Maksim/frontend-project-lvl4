import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';

import { selectActiveChannelMessages } from './MessagesSlice.jsx';
import Header from './Header.jsx';
import SendForm from './SendForm.jsx';

const Message = ({ message }) => (
  <div className="text-break mb-2">
    <b>{`${message.username}: `}</b>
    {message.text}
  </div>
);

const Messages = ({ messages }) => (
  <div className="overflow-auto px-5" id="containerElement">
    {messages.map((message) => <Message key={message.id} message={message} />)}
  </div>
);

const MessagesBox = () => {
  const activeChannelMessages = useSelector(selectActiveChannelMessages);

  useEffect(() => {
    animateScroll.scrollToBottom({
      containerId: 'containerElement',
      duration: 0,
    });
  });

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
