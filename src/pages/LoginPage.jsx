import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Navigation from '../components/Navigation.jsx';
import LoginForm from '../components/LoginForm.jsx';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column h-100">
      <Navigation />
      <Container className="h-100">
        <Row className="justify-content-md-center align-content-center h-100">
          <Col md={8} xl={6}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>{t('loginPage.header')}</Card.Title>
                <LoginForm />
              </Card.Body>
              <Card.Footer className="text-muted">
                <Link to="/signup">{t('loginPage.regLink')}</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
