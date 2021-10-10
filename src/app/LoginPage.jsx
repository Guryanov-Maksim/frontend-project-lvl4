import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const LoginForm = () => {
  const inputRef = useRef();
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const [t] = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state;
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            <Form.Group>
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
              />
            </Form.Group>
            <Form.Group>
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
              />
              <Form.Control.Feedback type="invalid">
                {t('errors.loginFailed')}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary">{t('loginPage.submitButton')}</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [t] = useTranslation();

  return (
    <>
      <LoginForm />
      <Link to="/signup">{t('loginPage.regLink')}</Link>
    </>
  );
};

export default LoginPage;
