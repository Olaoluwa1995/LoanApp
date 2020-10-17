import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import * as adminActions from "./store/actions/adminAuth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./containers/Layout";
import "antd/dist/antd.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.props.onTryAutoAdminSignup();
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter />
        </CustomLayout>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdminAuthenticated: state.adminAuth.adminToken !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    onTryAutoAdminSignup: () => dispatch(adminActions.authAdminCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
