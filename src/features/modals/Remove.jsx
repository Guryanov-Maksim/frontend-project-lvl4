import React, { useEffect, useRef, useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels, currentChannelIdChanged } from '../channels/ChannelsSlice.jsx';

const Remove = (props) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;
  const [defaultChannel] = channels;
  const defautlChannelId = defaultChannel.id;

  // const 

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  return (
    <Modal show={modalInfo.isOpen} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Remove?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure?
        <Formik
          initialValues={{
            body: '',
          }}
          onSubmit={() => {
            ws.removeChannel(modalInfo.extra, { onHide, defautlChannelId });
          }}
        >
          {({ handleChange, handleBlur }) => (
            <Form>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Remove
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
