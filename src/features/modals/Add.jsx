import React, { useEffect, useRef, useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels, currentChannelIdChanged } from '../channels/ChannelsSlice.jsx';

const Add = (props) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show={modalInfo.isOpen} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            body: '',
          }}
          onSubmit={(values) => {
            const newChannel = { name: values.body, removable: true };
            const addedChannel = channels.find((channel) => channel.name === newChannel.name);
            if (addedChannel) {
              dispatch(currentChannelIdChanged({ id: addedChannel.id }));
              onHide();
              return;
            }
            ws.addChannel(newChannel, { inputRef, onHide });
          }}
        >
          {({ handleChange, handleBlur }) => (
            <Form>
              <FormGroup>
                <FormControl
                  required
                  ref={inputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-testid="input-body"
                  name="body"
                />
              </FormGroup>
              <button disabled={false} type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
