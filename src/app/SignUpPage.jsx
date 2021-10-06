import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { Form, Button, FormControl } from 'react-bootstrap';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

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
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required(),
});

const SignUpPage = () => {
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const inputRef = useRef();
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
          if (err.isAxiosError) {
            actions.setSubmitting(false);
            inputRef.current.focus();
            return;
          }
          if (err.response.status === 409) {
            setRegistrationFailed(true);
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
                  <Form.Label htmlFor="username">username</Form.Label>
                  <FormControl.Feedback type="invalid" tooltip>
                    {errors.username}
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
                  <Form.Label htmlFor="password">password</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
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
                  <Form.Label htmlFor="confirmation">confirm password</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {(registrationFailed && 'Такой пользователь уже существует') || errors.confirmation}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button type="submit" disabled={isSubmitting} variant="outline-primary">Submit</Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUpPage;
