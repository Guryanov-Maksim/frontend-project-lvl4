import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Add from './Add.jsx';
import { modalToggled, selectModal } from './ModalsSlice.js';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = modals[modalInfo.type];
  return <Component modalInfo={modalInfo} onHide={hideModal} />;
};

const Modal = () => {
  const dispatch = useDispatch();
  const modalInfo = useSelector(selectModal);
  const hideModal = () => dispatch(modalToggled({ isOpen: false, type: null, extra: null }));

  return (
    renderModal({ modalInfo, hideModal })
  );
};

export default Modal;
