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
    <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
      <span>{t('channels.header')}</span>
      <Button
        type="button"
        onClick={showModalHandler}
        data-testid="item-add"
        className="btn btn-secondary"
      >
        {t('channels.addButton')}
      </Button>
    </div>
  );
};

export default Header;
