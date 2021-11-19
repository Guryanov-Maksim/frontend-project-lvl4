import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAuth, useApi } from '../hooks/index.js';
import { types } from '../error.js';

const LoginForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const api = useApi();

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
        await api.logIn(values);
        auth.logIn();
        const { from } = location.state;
        history.replace(from);
      } catch (error) {
        switch (error.type) {
          case types.unauthorized: {
            setAuthFailed(true);
            inputRef.current.select();
            break;
          }
          case types.network:
            inputRef.current.select();
            break;
          default:
            console.error(error);
        }
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
          isInvalid={authFailed}
        />
        {authFailed && (
          <Form.Control.Feedback type="invalid" tooltip>
            {t('errors.loginFailed')}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button type="submit" variant="outline-primary" disabled={formik.isSubmitting}>
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
          : t('loginPage.submitButton')}
      </Button>
    </Form>
  );
};

export default LoginForm;
