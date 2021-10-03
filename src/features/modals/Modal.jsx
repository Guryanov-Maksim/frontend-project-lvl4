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

const renderModal = ({ modalInfo, hideModal, addChannel }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = modals[modalInfo.type];
  return <Component modalInfo={modalInfo} addChannel={addChannel} onHide={hideModal} />;
};

const Modal = ({ addChannel }) => {
  const dispatch = useDispatch();
  const modalInfo = useSelector(selectModal);
  const hideModal = () => dispatch(modalToggled({ isOpen: false, type: null, extra: null }));

  // const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  // const [items, setItems] = useState([]);
  // const showModal = (type, item = null) => setModalInfo({ type, item });
  // const showModalHandler = () => showModal('adding');
  // const [channelStatus, setChannelStatus] = useState('filling');

  return (
    renderModal({ modalInfo, hideModal, addChannel })
  );
};

export default Modal;
