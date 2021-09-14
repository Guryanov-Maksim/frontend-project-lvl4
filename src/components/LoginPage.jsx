import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap';

const schema = yup.object().shape({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
});

const MainPage = () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
      // setAuthFailed(false);

      // try {
      //   const res = await axios.post(routes.loginPath(), values);
      //   localStorage.setItem('userId', JSON.stringify(res.data));
      //   auth.logIn();
      //   const { from } = location.state || { from: { pathname: '/' } };
      //   history.replace(from);
      // } catch (err) {
      //   if (err.isAxiosError && err.response.status === 401) {
      //     setAuthFailed(true);
      //     inputRef.current.select();
      //     return;
      //   }
      //   throw err;
      // }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            <Form.Group>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.username}
                placeholder="username"
                name="username"
                id="username"
                autoComplete="username"
                required
                ref={inputRef}
                isInvalid={formik.errors.username}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                isInvalid={formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary">Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
