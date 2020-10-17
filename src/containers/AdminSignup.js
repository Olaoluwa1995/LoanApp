import React from "react";
import {
  Button,
  Form,
  Grid,
  Segment,
  Transition,
  Container,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { adminSignup } from "../store/actions/adminAuth";
import { Card } from "antd";

class RegistrationForm extends React.Component {
  state = {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password2: "",
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

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      username,
      email,
      first_name,
      last_name,
      phone,
      password,
      password2,
    } = this.state;
    this.props.signup(
      username,
      email,
      first_name,
      last_name,
      phone,
      password,
      password2
    );
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      username,
      email,
      first_name,
      last_name,
      phone,
      password,
      password2,
      visible,
    } = this.state;
    const { error, loading, adminToken } = this.props;
    console.log(adminToken);
    if (adminToken) {
      return <Redirect to="/all-loans" />;
    }
    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          <Grid textAlign="center" style={{ marginTop: 20 }}>
            <Grid.Column style={{ maxWidth: 700, minWidth: 250 }}>
              <Card hoverable>
                <h3 style={{ color: "#1890ff", textAlign: "center" }}>
                  Create a new account
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
                        value={email}
                        name="email"
                        fluid
                        icon="mail"
                        iconPosition="left"
                        placeholder="E-mail address"
                      />
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        value={first_name}
                        name="first_name"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="First name"
                      />
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        value={last_name}
                        name="last_name"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="Last name"
                      />
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        value={phone}
                        name="phone"
                        fluid
                        icon="phone"
                        iconPosition="left"
                        placeholder="Phone Number"
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
                      <Form.Input
                        required
                        onChange={this.handleChange}
                        fluid
                        value={password2}
                        name="password2"
                        icon="lock"
                        iconPosition="left"
                        placeholder="Confirm password"
                        type="password"
                      />

                      <Button
                        style={{ backgroundColor: "#1890ff", color: "white" }}
                        fluid
                        size="large"
                        loading={loading}
                        disabled={loading}
                      >
                        Signup
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
                    Already have an account?{" "}
                    <NavLink to="/admin-login">Login</NavLink>
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
    signup: (
      username,
      email,
      first_name,
      last_name,
      phone,
      password,
      password2
    ) =>
      dispatch(
        adminSignup(
          username,
          email,
          first_name,
          last_name,
          phone,
          password,
          password2
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
