import React, { useEffect, useRef, useContext } from 'react';
import { Formik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels } from '../channels/ChannelsSlice.jsx';

const Rename = (props) => {
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;
  const { t } = useTranslation();

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
            const onSuccessCallbacks = [
              () => onHide(),
            ];
            const onFailCallbacks = [
              () => inputRef.current.focus(),
              () => actions.setSubmitting(false),
            ];
            const updatedChannel = { id: modalInfo.extra.id, name: values.body };
            ws.renameChannel(updatedChannel, { onSuccessCallbacks, onFailCallbacks });
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
                  data-testid="rename-channel"
                  name="body"
                  value={values.body}
                  isInvalid={!!errors.body}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.body}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button className="mr-2" disabled={isSubmitting} onClick={onHide} variant="secondary" type="button">{t('renameModal.cancelButton')}</Button>
                <Button disabled={isSubmitting} type="submit">{t('renameModal.submitButton')}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
