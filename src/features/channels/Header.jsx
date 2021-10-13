import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { modalToggled } from '../modals/ModalsSlice.js';

const Header = () => {
  const dispatch = useDispatch();
  const showModalHandler = () => dispatch(modalToggled({ isOpen: true, type: 'adding' }));
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between mb-2 pl-4 pr-2">
      <span>{t('channels.header')}</span>
      <Button
        type="button"
        onClick={showModalHandler}
        data-testid="item-add"
        variant="light"
        className="btn p-0 text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="sr-only">{t('channels.addButton')}</span>
      </Button>
    </div>
  );
};

export default Header;
