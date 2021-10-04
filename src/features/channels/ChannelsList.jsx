import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button } from 'react-bootstrap';
import cn from 'classnames';

import { selectAllChannels, selectCurrentChannelId, currentChannelIdChanged } from './ChannelsSlice.jsx';
import { modalToggled } from '../modals/ModalsSlice.js';

const ChannelExcerpt = ({ channel }) => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector(selectCurrentChannelId);

  const classes = cn('w-100 rounded-0 text-start', {
    'btn-secondary': currentChannelId === channel.id,
  });

  const onClickHandler = (id) => () => {
    dispatch(currentChannelIdChanged({ id }));
  };

  const showModalHandler = (id) => () => {
    dispatch(modalToggled({ isOpen: true, type: 'removing', extra: id }));
  };

  const showRenameModalHandler = (name) => () => {
    dispatch(modalToggled({ isOpen: true, type: 'renaming', extra: name }));
  };

  return (
    <Nav.Item as="li" className="w-100">
      <Button variant="" className={classes} onClick={onClickHandler(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      {channel.removable && (
        <>
          <Button variant="" className="w-100 rounded-0 text-start, btn-secondary, bg-red" onClick={showModalHandler(channel.id)}>
            Remove
          </Button>
          <Button variant="" className="w-100 rounded-0 text-start, btn-secondary, bg-red" onClick={showRenameModalHandler(channel)}>
            Rename
          </Button>
        </>
      )}
    </Nav.Item>
  );
};

const ChannelsList = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const showModalHandler = () => dispatch(modalToggled({ isOpen: true, type: 'adding' }));
  // const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  // const [items, setItems] = useState([]);
  // const hideModal = () => setModalInfo({ type: null, item: null });
  // const showModal = (type, item = null) => setModalInfo({ type, item });
  // showModal('adding');
  // const [channelStatus, setChannelStatus] = useState('filling');

  return (
    <>
      <button type="button" onClick={showModalHandler} data-testid="item-add" className="btn btn-secondary">add</button>
      <Nav as="ul" className="flex-column px-2">
        {channels.map((channel) => (
          <ChannelExcerpt key={channel.id} channel={channel} />
        ))}
      </Nav>
    </>
  );
};

export default ChannelsList;
