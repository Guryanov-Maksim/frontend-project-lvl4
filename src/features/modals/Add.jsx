import React, { useEffect, useRef, useContext } from 'react';
import { Formik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
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
          validateOnChange={false} // for validation on submit
          validateOnBlur={false} // for validation on submit
          validate={(values) => {
            const errors = {};
            const isChannelAlreadyExist = !!channels.find((ch) => ch.name === values.body);
            if (isChannelAlreadyExist) {
              errors.body = 'Already exist';
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            const newChannel = { name: values.body, removable: true };
            const addedChannel = channels.find((channel) => channel.name === newChannel.name);
            if (addedChannel) {
              dispatch(currentChannelIdChanged({ id: addedChannel.id }));
              onHide();
              return;
            }
            ws.addChannel(newChannel, { inputRef, onHide, actions });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isSubmitting,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  required
                  ref={inputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-testid="input-body"
                  name="body"
                  value={values.body}
                  isInvalid={!!errors.body}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.body}
                </Form.Control.Feedback>
              </Form.Group>
              <button disabled={isSubmitting} type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Add;