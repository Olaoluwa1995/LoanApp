import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { adminLogout } from "../store/actions/adminAuth";
import { Layout, Menu, Button } from "antd";
import { ChromeOutlined } from "@ant-design/icons";
import "../App.css";

const { Content, Header } = Layout;
class CustomLayout extends React.Component {
  render() {
    const { authenticated, adminAuthenticated } = this.props;
    return (
      <Layout>
        <Header
          className="header"
          style={{ position: "fixed", zIndex: 1, width: "100%" }}
        >
          <Menu theme="dark" mode="horizontal" style={{ float: "left" }}>
            <Menu.Item key="1">
              <ChromeOutlined />
              MyLoanApp
            </Menu.Item>
          </Menu>

          {/* {(() => {
            if (adminAuthenticated) {
              return (
                <React.Fragment>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ float: "right" }}
                  >
                    <Menu.Item onClick={() => this.props.adminLogout()} key="1">
                      AdminLogout
                    </Menu.Item>
                  </Menu>
                </React.Fragment>
              );
            } else if (authenticated) {
              return (
                <React.Fragment>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ float: "right" }}
                  >
                    <Menu.Item onClick={() => this.props.logout()} key="1">
                      UserLogout
                    </Menu.Item>
                  </Menu>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ float: "right" }}
                  >
                    <Menu.Item key="1">Login</Menu.Item>
                  </Menu>
                </React.Fragment>
              );
            }
          })()} */}
          {authenticated && (
            <React.Fragment>
              <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                <Menu.Item key="1">
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/products">
                    <Button shape="round" type="primary">
                      Apply
                    </Button>
                  </Link>
                </Menu.Item>
              </Menu>
            </React.Fragment>
          )}
          {adminAuthenticated && (
            <React.Fragment>
              <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                <Menu.Item key="1">
                  <Link to="/all-loans">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/admin-profile">Profile</Link>
                </Menu.Item>
              </Menu>
            </React.Fragment>
          )}
        </Header>
        <Layout>
          <Content
            style={{
              padding: 24,
              minHeight: "100vh",
              paddingTop: 100,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    adminAuthenticated: state.adminAuth.adminToken !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    adminLogout: () => dispatch(adminLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
