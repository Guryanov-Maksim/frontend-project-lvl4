import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import {
  Form,
  Button,
  FormControl,
  Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const toString = (err) => (
  typeof err === 'string'
    ? err
    : `${err.key}${err.values.min}`
);

const SignupForm = () => {
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const inputRef = useRef();
  const auth = useAuth();
  const history = useHistory();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required()
      .min(3)
      .max(20),
    password: yup
      .string()
      .trim()
      .required()
      .min(6),
    confirmation: yup
      .string()
      .oneOf([yup.ref('password'), null])
      .required(),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmation: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setRegistrationFailed(false);
      try {
        const { data } = await axios.post(routes.signupPath(), values);
        auth.logIn(data);
        history.replace(routes.privateRoute());
      } catch (error) {
        if (error.response?.status === 409) {
          setRegistrationFailed(true);
          inputRef.current.select();
          return;
        }
        if (error.isAxiosError) {
          inputRef.current.focus();
          return;
        }
        console.error(error);
      }
    },
  });

  const resetRefistrationFail = () => setRegistrationFailed(false);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">{t('signupPage.title')}</h1>
      <Form.Group className="position-relative" md="4">
        <Form.Label htmlFor="username">{t('signupPage.username')}</Form.Label>
        <Form.Control
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          placeholder="username"
          name="username"
          id="username"
          autoComplete="username"
          required
          ref={inputRef}
          isInvalid={(!!formik.errors.username && formik.touched.username) || registrationFailed}
        />
        <FormControl.Feedback type="invalid" tooltip>
          {formik.errors.username
            ? t(`errors.${toString(formik.errors.username)}`)
            : (registrationFailed && t('errors.registrationFailedEmtyMessage'))}
        </FormControl.Feedback>
      </Form.Group>
      <Form.Group className="position-relative" md="4">
        <Form.Label htmlFor="password">{t('signupPage.password')}</Form.Label>
        <Form.Control
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          placeholder="password"
          name="password"
          id="password"
          autoComplete="current-password"
          required
          isInvalid={(formik.errors.password && formik.touched.password) || registrationFailed}
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.password
            ? t(`errors.${toString(formik.errors.password)}`)
            : (registrationFailed && t('errors.registrationFailedEmtyMessage'))}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="position-relative" md="4">
        <Form.Label htmlFor="confirmation">{t('signupPage.confirmation')}</Form.Label>
        <Form.Control
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmation}
          placeholder="confirmation"
          name="confirmation"
          id="confirmation"
          autoComplete="current-password"
          required
          isInvalid={(
            formik.errors.confirmation && formik.touched.confirmation) || registrationFailed}
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {registrationFailed
            ? t('errors.registrationFailed')
            : t(`errors.${formik.errors.confirmation}`)}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" onClick={resetRefistrationFail} variant="outline-primary" disabled={formik.isSubmitting}>
        {formik.isSubmitting
          ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">Loading...</span>
            </>
          )
          : t('signupPage.submitButton')}
      </Button>
    </Form>
  );
};

export default SignupForm;
