import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { reactPathLogin } from '../../common/routes';

function AuthRoute(props) {
  const { type, location, loggedIn } = props;

  if (type === 'guest' && loggedIn) {
    const searchParams = new URLSearchParams(location.search);
    const nextPath = searchParams.get('next') || '/';
    return <Redirect to={nextPath} />;
  }
  if (type === 'private' && !loggedIn) {
    return <Redirect to={reactPathLogin} />;
  }
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return <Route {...props} />;
}

AuthRoute.defaultProps = {
  location: null,
};

AuthRoute.propTypes = {
  type: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  loggedIn: PropTypes.bool.isRequired,
};
export default AuthRoute;
