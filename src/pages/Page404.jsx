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

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column h-100">
      <Navigation />
      <Container className="h-100">
        <Row className="justify-content-md-center align-content-center h-100">
          <Col md={8} xl={6}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>
                  {t('page404.text')}
                  <Link to="/">{t('page404.link')}</Link>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Page404;
