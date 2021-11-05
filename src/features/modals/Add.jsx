import React, { useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useApi } from '../../hooks/index.jsx';
import { selectAllChannels } from '../channels/ChannelsSlice.jsx';

const Add = (props) => {
  const channels = useSelector(selectAllChannels);
  const api = useApi();
  const { onHide, modalInfo } = props;
  const { t } = useTranslation();

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show={modalInfo.isOpen} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('addModal.title')}</Modal.Title>
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
              errors.body = t('errors.sameName');
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            const newChannel = { name: values.body, removable: true };
            const onSuccessCallbacks = [
              () => onHide(),
            ];
            const onFailCallbacks = [
              () => inputRef.current.focus(),
              () => actions.setSubmitting(false),
            ];
            api.addChannel(newChannel, { onSuccessCallbacks, onFailCallbacks });
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
                  name="body"
                  value={values.body}
                  isInvalid={!!errors.body}
                  data-testid="add-channel"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.body}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button className="mr-2" disabled={isSubmitting} variant="secondary" onClick={onHide} type="button">{t('addModal.cancelButton')}</Button>
                <Button disabled={isSubmitting} type="submit">{t('addModal.submitButton')}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
