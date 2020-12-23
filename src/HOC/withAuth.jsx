import React from 'react';
import Login from '../Components/Authentication/Login';
import { connect } from 'react-redux';
import { compose } from 'redux';

const auth = (Component) => (props) => {
  return props.id !== undefined ? <Component {...props} /> : <Login />;
};

const mapStateToProps = (state) => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
});

const withAuth = compose(connect(mapStateToProps, null), auth);

export default withAuth;
