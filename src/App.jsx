import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
// import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import LoginPage from './app/LoginPage.jsx';
import MainPage from './app/MainPage.jsx';
import SignUpPage from './app/SignUpPage.jsx';
import authContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';

const isAuthUser = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  console.log(userId);

  if (userId && userId.token) {
    return true;
  }

  // if (userId) {
  //   return true;
  // }

  return false;
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(isAuthUser());

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const MainRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={() => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: '/' } }} />)}
    />
  );
};

// const AuthButton = () => {
//   const auth = useAuth();
//   const [t] = useTranslation();

//   return (
//     auth.loggedIn
//       ? <Button onClick={auth.logOut}>{t('mainNav.button')}</Button>
//       : null
//   );
// };

const App = () => {
  const [t] = useTranslation();
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/signup">
              <SignUpPage />
            </Route>
            <MainRoute path="/">
              <MainPage />
            </MainRoute>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
