import React from 'react';
import { useSelector } from 'react-redux';
import { Nav, Button } from 'react-bootstrap';
import cn from 'classnames';

import { selectAllChannels, selectCurrentChannelId } from './ChannelsSlice.jsx';

const ChannelExcerpt = ({ channel }) => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const classes = cn('w-100 rounded-0 text-start', {
    'btn-secondary': currentChannelId === channel.id,
  });

  return (
    <Nav.Item as="li" className="w-100">
      <Button variant="" className={classes}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
    </Nav.Item>
  );
};

const ChannelsList = () => {
  const channels = useSelector(selectAllChannels);

  return (
    <Nav as="ul" className="flex-column px-2">
      {channels.map((channel) => (
        <ChannelExcerpt key={channel.id} channel={channel} />
      ))}
    </Nav>
  );
};

export default ChannelsList;
