import React from 'react';
import {
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import SignupForm from '../components/SignupForm.jsx';

const SignUpPage = () => (
  <Container className="h-100">
    <Row className="justify-content-md-center align-content-center h-100">
      <Col md={8} xl={6}>
        <Card className="text-center">
          <Card.Body>
            <SignupForm />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default SignUpPage;
