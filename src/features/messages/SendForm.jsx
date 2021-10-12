import React, { useContext, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectCurrentChannelId } from '../channels/ChannelsSlice.jsx';
import { wsContext } from '../../contexts/index.jsx';

const SendForm = () => {
  const ws = useContext(wsContext);
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
      console.log(actions);
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const message = {
        text: values.text,
        channelId: currentChannelId,
        username,
      };
      const callbacks = {
        onSuccess: [
          () => actions.resetForm(),
          () => inputRef.current.focus(),
        ],
        onFail: [
          () => actions.setSubmitting(false),
          () => inputRef.current.focus(),
        ],
      };
      ws.sendMessage(message, callbacks);
    },
  });

  console.log(formik);

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Control
          type="text"
          name="text"
          value={formik.values.text}
          onChange={formik.handleChange}
          data-testid="new-message"
          placeholder={t('messages.placeholder')}
          ref={inputRef}
        />
        <Button className="btn btn-group-vertical" disabled={formik.values.text === '' || formik.isSubmitting} type="submit">
          {t('messages.submitButton')}
        </Button>
      </Form>
    </div>
  );
};

export default SendForm;
