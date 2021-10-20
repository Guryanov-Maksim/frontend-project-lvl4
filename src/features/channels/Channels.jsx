import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Nav,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import { selectAllChannels, selectCurrentChannelId, currentChannelIdChanged } from './ChannelsSlice.jsx';
import { modalToggled } from '../modals/ModalsSlice.js';

const Channel = ({ channel }) => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();

  const classes = cn('w-100 rounded-0 text-start text-truncate', {
    'btn-secondary': currentChannelId === channel.id,
  });

  const dropdownClasses = cn('flex-grow-0', {
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
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button variant="" className={classes} onClick={onClickHandler(channel.id)}>
          <span className="me-1">#</span>
          {channel.name}
        </Button>
        {channel.removable && (
          <>
            <Dropdown.Toggle split variant="" className={dropdownClasses} id="dropdown-split-basic" />
            <Dropdown.Menu>
              <Dropdown.Item href="#" eventKey="1" onClick={showModalHandler(channel.id)} active={false}>
                {t('channels.removeButton')}
              </Dropdown.Item>
              <Dropdown.Item href="#" eventKey="2" onClick={showRenameModalHandler(channel)} active={false}>
                {t('channels.renameButton')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    </Nav.Item>
  );
};

const Channels = () => {
  const channels = useSelector(selectAllChannels);

  return (
    channels.map((channel) => (
      <Channel key={channel.id} channel={channel} />
    ))
  );
};

export default Channels;
