import React from "react";
import {
  Button,
  Form,
  Grid,
  Segment,
  Container,
  Transition,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { adminLogin } from "../store/actions/adminAuth";
import { Card } from "antd";

class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    visible: false,
  };

  componentDidMount() {
    this._isMounted = true;
    setTimeout(
      function () {
        if (this._isMounted) {
          this.setState({ visible: true });
        }
      }.bind(this),
      300
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.login(username, password);
  };

  render() {
    const { error, loading, adminToken } = this.props;
    const { username, password, visible } = this.state;
    if (adminToken) {
      return <Redirect to="/all-loans" />;
    }
    return (
      <Transition visible={visible} animation="slide left" duration={1000}>
        <Container>
          <Grid
            textAlign="center"
            style={{ marginTop: 20, paddingBottom: 110 }}
          >
            <Grid.Column style={{ maxWidth: 700, minWidth: 250 }}>
              <Card hoverable>
                <h3 style={{ color: "#1890ff", textAlign: "center" }}>
                  Sign-in to your account
                </h3>
                {error && (
                  <h6 style={{ color: "red" }}>
                    {this.props.error.response.data.non_field_errors[0]}
                  </h6>
                )}

                <React.Fragment>
                  <Form size="large" onSubmit={this.handleSubmit}>
                    <Segment stacked>
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        value={username}
                        name="username"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                      />
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        fluid
                        value={password}
                        name="password"
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                      />

                      <Button
                        style={{ backgroundColor: "#1890ff", color: "white" }}
                        fluid
                        size="large"
                        loading={loading}
                        disabled={loading}
                      >
                        Login
                      </Button>
                    </Segment>
                  </Form>
                  <div
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bolder",
                      marginTop: 10,
                    }}
                  >
                    New to us? <NavLink to="/admin-signup">Sign Up</NavLink>
                  </div>
                </React.Fragment>
              </Card>
            </Grid.Column>
          </Grid>
        </Container>
      </Transition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.adminAuth.loading,
    error: state.adminAuth.error,
    adminToken: state.adminAuth.adminToken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(adminLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
