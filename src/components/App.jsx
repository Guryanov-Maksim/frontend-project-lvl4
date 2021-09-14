import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';


const defaultPath = '/';
const loginPath = '/login';

const App = () => (
  <Router>
    <Link to={defaultPath}>Default page</Link>
    <Link to={loginPath}>Login page</Link>

    <div className="container p-3">
      <h1 className="text-center mt-5 mb-4">Welcome to Chat!</h1>
      <Switch>
        <Route exact path={loginPath}>
          <LoginPage />
        </Route>
        <Route exact path={defaultPath}>
          <NotFound />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
