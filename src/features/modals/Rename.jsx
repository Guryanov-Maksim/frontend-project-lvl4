import React, { useEffect, useRef, useContext } from 'react';
import { Formik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels } from '../channels/ChannelsSlice.jsx';

const Rename = (props) => {
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;
  const [t] = useTranslation();

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show={modalInfo.isOpen} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('renameModal.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            body: modalInfo.extra.name,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={(values) => {
            const errors = {};
            const isChannelAlreadyExist = !!channels.find((ch) => ch.name === values.body);
            if (isChannelAlreadyExist) {
              errors.body = t('errors.sameName');
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            ws.renameChannel(
              { id: modalInfo.extra.id, newName: values.body }, { inputRef, onHide, actions },
            );
            // actions.setSubmitting(false); // возможность самого формика
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isSubmitting,
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
              <button disabled={isSubmitting} type="submit">{t('renameModal.cancelButton')}</button>
              <button disabled={isSubmitting} type="submit">{t('renameModal.submitButton')}</button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
