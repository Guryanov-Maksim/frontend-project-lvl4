import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const LoginForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state;
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3 form-group">
        <Form.Label htmlFor="username">{t('loginPage.username')}</Form.Label>
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder="username"
          name="username"
          id="username"
          autoComplete="username"
          required
          ref={inputRef}
          isValid={!formik.errors.username}
          isInvalid={authFailed}
        />
      </Form.Group>
      <Form.Group className="position-relative" md="4">
        <Form.Label htmlFor="password">{t('loginPage.password')}</Form.Label>
        <Form.Control
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="password"
          name="password"
          id="password"
          autoComplete="current-password"
          required
          isValid={!formik.errors.username}
          isInvalid={authFailed}
        />
        {authFailed && (
          <Form.Control.Feedback type="invalid" tooltip>
            {t('errors.loginFailed')}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button type="submit" variant="outline-primary">{t('loginPage.submitButton')}</Button>
    </Form>
  );
};

export default LoginForm;
