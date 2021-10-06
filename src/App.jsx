import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
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

const App = () => (
  <AuthProvider>
    <Router>
      <Link to="/">Default page</Link>
      <Link to="/login">Login page</Link>

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
    </Router>
  </AuthProvider>
);

export default App;
