// React
import React from "react";
// Components & Hooks
import RPMApp from "./RPMApp";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset";
import PasswordResetSend from "./PasswordResetSend";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

App.propTypes = {};
export default function App() {
  return (
    <StitchAuthProvider>
      <Router>
        <Switch>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/passwordreset'>
            <PasswordReset />
          </Route>
          <Route path='/passwordresetsend'>
            <PasswordResetSend />
          </Route>          
          <Route path='/login'>
            <Login />
          </Route>
          <PrivateRoute exact path='/'>
            <RPMApp />
          </PrivateRoute>
        </Switch>
      </Router>
    </StitchAuthProvider>
  );
}

function PrivateRoute({ children, ...rest }) {
  const { isLoggedIn } = useStitchAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

