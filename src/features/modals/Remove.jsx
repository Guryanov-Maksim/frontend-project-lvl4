import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels } from '../channels/ChannelsSlice.jsx';

const Remove = (props) => {
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;
  const [defaultChannel] = channels;
  const defautlChannelId = defaultChannel.id;

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
          {() => (
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
