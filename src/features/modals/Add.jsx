import React, { useEffect, useRef, useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';

import { wsContext } from '../../contexts/index.jsx';

const generateOnSubmit = ({ addChannel, onHide, inputRef }) => (values) => {
  const channel = { name: values.body, removable: true };
  addChannel(channel, { inputRef, onHide });
};

const Add = (props) => {
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
          onSubmit={generateOnSubmit({ ...props, addChannel: ws.addChannel, inputRef })}
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
