import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { Form, Button, FormControl } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

import { ru, errors } from '../locales/index.js';

yup.setLocale(errors);

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

const toString = (err) => (
  typeof err === 'string'
    ? err
    : `${err.key}${err.values.min}`
);

const SignUpPage = () => {
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const inputRef = useRef();
  const auth = useAuth();
  const history = useHistory();
  const [t] = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const resetRefistrationFail = () => setRegistrationFailed(false);

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmation: '',
      }}
      validationSchema={schema}
      onSubmit={async (values, actions) => {
        setRegistrationFailed(false);
        try {
          const res = await axios.post(routes.signupPath(), values);
          localStorage.setItem('userId', JSON.stringify(res.data));
          auth.logIn();
          history.replace('/');
        } catch (err) {
          if (err.response?.status === 409) {
            setRegistrationFailed(true);
            inputRef.current.select();
            return;
          }
          if (err.isAxiosError) {
            actions.setSubmitting(false);
            inputRef.current.focus();
            return;
          }
          throw err;
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <div className="container-fluid">
          <div className="row justify-content-center pt-5">
            <div className="col-sm-4">
              <Form onSubmit={handleSubmit}>
                <h1 className="text-center mb-4">{t('signupPage.title')}</h1>
                <Form.Floating className="mb-3 form-group">
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    placeholder="username"
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    ref={inputRef}
                    isInvalid={(!!errors.username && touched.username) || registrationFailed}
                  />
                  <Form.Label htmlFor="username">{t('signupPage.username')}</Form.Label>
                  <FormControl.Feedback type="invalid" tooltip>
                    {errors.username
                      ? t(`errors.${toString(errors.username)}`)
                      : (registrationFailed && t('errors.registrationFailedEmtyMessage'))}
                  </FormControl.Feedback>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    isInvalid={(errors.password && touched.password) || registrationFailed}
                  />
                  <Form.Label htmlFor="password">{t('signupPage.password')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.password
                      ? t(`errors.${toString(errors.password)}`)
                      : (registrationFailed && t('errors.registrationFailedEmtyMessage'))}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmation}
                    placeholder="confirmation"
                    name="confirmation"
                    id="confirmation"
                    autoComplete="current-password"
                    required
                    isInvalid={(errors.confirmation && touched.confirmation) || registrationFailed}
                  />
                  <Form.Label htmlFor="confirmation">{t('signupPage.confirmation')}</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {registrationFailed
                      ? t('errors.registrationFailed')
                      : t(`errors.${errors.confirmation}`)}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button type="submit" onClick={resetRefistrationFail} disabled={isSubmitting} variant="outline-primary">{t('signupPage.submitButton')}</Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUpPage;
