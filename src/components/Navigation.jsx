import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import useAuth from '../hooks/index.jsx';

const AuthButton = () => {
  const auth = useAuth();
  const [t] = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('mainNav.button')}</Button>
      : null
  );
};

const Navigation = () => {
  const [t] = useTranslation();

  return (
    <Navbar className="shadow-sm" bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">{t('mainNav.mainPageLink') }</Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  );
};

export default Navigation;
