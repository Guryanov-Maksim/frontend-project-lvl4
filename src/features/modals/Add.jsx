import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Formik, Form, Field } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

const generateOnSubmit = ({ addChannel, onHide, setChannelStatus }) => (values) => {
  const channel = { name: values.body, removable: true };
  addChannel(channel, { setChannelStatus });
  onHide();
};

const Add = (props) => {
  const { onHide, modalInfo } = props;
  // const f = useFormik({ onSubmit: generateOnSubmit(props), initialValues: { body: '' } });
  const [channelStatus, setChannelStatus] = useState('filling');

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
          onSubmit={generateOnSubmit({ ...props, setChannelStatus })}
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

// <form onSubmit={f.handleSubmit}>
//           <FormGroup>
//             <FormControl
//               required
//               ref={inputRef}
//               onChange={f.handleChange}
//               onBlur={f.handleBlur}
//               value={f.values.body}
//               data-testid="input-body"
//               name="body"
//             />
//           </FormGroup>
//           <input type="submit" className="btn btn-primary" value="submit" />
//         </form>