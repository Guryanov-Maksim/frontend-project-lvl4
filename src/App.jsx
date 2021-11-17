import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import Page404 from './pages/Page404.jsx';
import { authContext } from './contexts/index.js';
import { useAuth, useApi } from './hooks/index.js';
import routes from './routes.js';
import Navigation from './components/Navigation.jsx';

const isAuthUser = (userId) => userId && userId.token;

const AuthProvider = ({ children }) => {
  const api = useApi();
  const userId = api.getAuthData() || { username: null };
  const [loggedIn, setLoggedIn] = useState(isAuthUser(userId));
  const { username } = userId;

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    api.logOut();
    setLoggedIn(false);
  };

  return (
    <authContext.Provider
      value={{
        username,
        loggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={() => (auth.loggedIn
        ? children
        : (
          <Redirect
            to={{
              pathname: routes.loginRoute(),
              state: { from: routes.privateRoute() },
            }}
          />
        ))}
    />
  );
};

const App = () => (
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
        <Navigation />
        <Switch>
          <Route exact path={routes.loginRoute()}>
            <LoginPage />
          </Route>
          <Route exact path={routes.signUpRoute()}>
            <SignUpPage />
          </Route>
          <PrivateRoute exact path={routes.privateRoute()}>
            <ChatPage />
          </PrivateRoute>
          <Route path={routes.defaultRoute()}>
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </div>
  </AuthProvider>
);

export default App;
