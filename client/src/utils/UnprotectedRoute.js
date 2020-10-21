import React from 'react';
import { useStore } from '../stores/helpers/UseStore';
import { Route, Redirect } from 'react-router-dom'

const UnprotectedRoute = ({ component: Component, ...rest }) => {
  const { auth } = useStore();

  return (
    <Route
      {...rest}
      render={props => {
        if (!auth.loggedIn) {
          return <Component {...props} />
        }
        return <Redirect to={
          {
            pathname: props.location.state? props.location.state.from.pathname : '/get-someone',
            state: {
              from: props.location
            }
          } 
        } />
      }}
    />
  );
}

export default UnprotectedRoute;
