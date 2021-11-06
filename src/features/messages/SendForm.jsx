import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Form,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectCurrentChannelId } from '../channels/ChannelsSlice.jsx';
import { useApi } from '../../hooks/index.js';

const SendForm = () => {
  const api = useApi();
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values, actions) => {
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const message = {
        text: values.text,
        channelId: currentChannelId,
        username,
      };
      const onSuccessCallbacks = [
        () => actions.resetForm(),
        () => inputRef.current.focus(),
      ];
      const onFailCallbacks = [
        () => actions.setSubmitting(false),
        () => inputRef.current.focus(),
      ];
      api.sendMessage(message, { onSuccessCallbacks, onFailCallbacks });
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Form.Group as={Col} sm={8}>
            <Form.Control
              type="text"
              name="text"
              value={formik.values.text}
              onChange={formik.handleChange}
              data-testid="new-message"
              placeholder={t('messages.placeholder')}
              ref={inputRef}
            />
          </Form.Group>
          <Col sm>
            <Button className="btn btn-group-vertical" disabled={formik.values.text === '' || formik.isSubmitting} type="submit">
              {t('messages.submitButton')}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SendForm;
