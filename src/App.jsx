import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import Page404 from './pages/Page404.jsx';
import { authContext } from './contexts/index.js';
import { useAuth, useApi } from './hooks/index.js';

const isAuthUser = (userId) => userId && userId.token;

const AuthProvider = ({ children }) => {
  const api = useApi();
  const userId = api.getAuthData();
  const [loggedIn, setLoggedIn] = useState(isAuthUser(userId));

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    api.logOut();
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

const App = () => (
  <AuthProvider>
    <Router>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/signup">
          <SignUpPage />
        </Route>
        <MainRoute exact path="/">
          <MainPage />
        </MainRoute>
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </Router>
  </AuthProvider>
);

export default App;
