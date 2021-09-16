import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

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

      <div className="container p-3">
        <h1 className="text-center mt-5 mb-4">Welcome to Chat!</h1>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <MainRoute path="/">
            <NotFound />
          </MainRoute>
        </Switch>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
