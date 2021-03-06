import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Container, Form, Icon, Table, Segment } from "semantic-ui-react";
import {
  userIDURL,
  profileDetailURL,
  profileUpdateURL,
  imageUpdateURL,
  profileImageDetailURL,
  userLoanListURL,
  passwordUpdateURL,
} from "../constants";
import { authAxios } from "../utils";
import { Avatar, Upload, message, Modal, Button, Card, Drawer } from "antd";
import logo from "../logo.svg";
import { logout } from "../store/actions/auth";

class Profile extends React.Component {
  state = {
    userID: null,
    profile: [],
    User: [],
    loans: [],
    loading: false,
    imageVisible: false,
    drawerVisible: false,
    visible: false,
    passwordVisible: false,
    Data: {
      last_name: "",
      first_name: "",
      username: "",
      phone: "",
      id: "",
      user: 1,
      email: "",
    },
    success: false,
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  componentDidMount() {
    this._isMounted = true;
    this.handleFetchUserID();
    this.handleFetchUserLoans();
    this.handleFetchProfile();
    this.handleFetchProfileImage();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ userID: res.data.userID });
        }
      })
      .catch((err) => {
        message.error("There is an error");
        this.setState({ error: err });
      });
  };

  handleFetchUserLoans = () => {
    authAxios
      .get(userLoanListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ loans: res.data });
        }
      })
      .catch((err) => {
        message.error("There is an error loading loans");
        this.setState({ error: err });
      });
  };

  handleFetchProfile = (profileID) => {
    this.setState({ loading: true });
    authAxios
      .get(profileDetailURL(profileID))
      .then((res) => {
        if (this._isMounted) {
          this.setState({ profile: res.data, loading: false });
          this.setState({ Data: res.data, loading: false });
        }
      })
      .catch((err) => {
        message.error("There is an error loading profile");
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchProfileImage = (profileID) => {
    this.setState({ loading: true });
    authAxios
      .get(profileImageDetailURL(profileID))
      .then((res) => {
        if (this._isMounted) {
          this.setState({ User: res.data, loading: false });
        }
      })
      .catch((err) => {
        message.error("There is an error loading profile image");
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e) => {
    const { Data } = this.state;
    const updatedFormdata = {
      ...Data,
      [e.target.name]: e.target.value,
    };
    this.setState({
      Data: updatedFormdata,
    });
  };

  handleUpdateProfile = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { Data, userID } = this.state;
    authAxios
      .put(profileUpdateURL(Data.id), { ...Data, userID })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          visible: false,
        });
        message.success("Your profile is successfully updated");
        this.handleCancel();
        this.handleFetchProfile();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("Updating profile not successful");
      });
  };

  handleChangePassword = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const {
      Data,
      userID,
      old_password,
      new_password,
      confirm_password,
    } = this.state;
    if (old_password.length < 8 || new_password.length < 8) {
      message.error("Password must not be less than 8 characters");
    } else if (new_password !== confirm_password) {
      message.error("Passwords don't match");
    } else {
      authAxios
        .put(passwordUpdateURL(Data.id), { old_password, new_password, userID })
        .then((res) => {
          this.setState({
            saving: false,
            success: true,
            visible: false,
          });
          message.success("Your password has been successfully changed");
          this.handlePasswordModalCancel();
        })
        .catch((err) => {
          message.error(err.response.data.old_password[0]);
        });
    }
  };

  handleUpdateProfileImage = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { Data } = this.state;
    const formData = new FormData();
    formData.append(
      "photo",
      this.state.fileList[0],
      this.state.fileList[0].name
    );
    authAxios
      .put(imageUpdateURL(Data.id), formData)
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          visible: false,
        });
        message.success("Your profile picture is successfully updated");
        console.log(res.data);
        this.handleProfileImageCancel();
        this.handleFetchProfileImage();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("Updating profile picture not successful");
      });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  showProfileImageModal = () => {
    this.setState({
      imageVisible: true,
    });
  };
  handleProfileImageCancel = () => this.setState({ imageVisible: false });

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  drawerOnClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  showPasswordModal = () => {
    this.setState({
      passwordVisible: true,
    });
  };

  handlePasswordModalCancel = () => {
    this.setState({
      passwordVisible: false,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      loading,
      profile,
      loans,
      User,
      imageVisible,
      drawerVisible,
      passwordVisible,
      Data,
      success,
      visible,
      old_password,
      new_password,
      confirm_password,
    } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const ImageModal = (
      <Modal
        visible={imageVisible}
        title="Change your profile picture"
        onOk={this.handleUpdateProfileImage}
        onCancel={this.handleProfileImageCancel}
        footer={[
          <Button
            key="back"
            onClick={this.handleProfileImageCancel}
            shape="round"
            size="middle"
            type="danger"
          >
            Return
          </Button>,
          <Button
            disabled={
              this.state.fileList &&
              this.state.fileList[0] &&
              this.state.fileList[0].name
                ? false
                : true
            }
            shape="round"
            icon={<Icon name="upload" />}
            size="middle"
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleUpdateProfileImage}
          >
            Upload
          </Button>,
        ]}
      >
        <img
          alt=""
          style={{ width: "100%" }}
          src={User.photo ? User.photo : logo}
        />
        <div style={{ marginTop: 10 }}>
          <Upload
            name="photo"
            multiple={false}
            onRemove={(photo) => {
              this.setState((state) => {
                return { fileList: [] };
              });
            }}
            beforeUpload={(photo) => {
              this.setState((state) => ({
                fileList: [photo],
              }));
              return false;
            }}
            style={{ width: "100%" }}
          >
            <Button>
              <Icon name="upload" />
              {this.state.fileList &&
              this.state.fileList[0] &&
              this.state.fileList[0].name
                ? this.state.fileList[0].name
                : "Click to change picture"}
            </Button>
          </Upload>
        </div>
      </Modal>
    );

    const cover = (
      <div>
        <Avatar
          size={250}
          src={User.photo ? User.photo : logo}
          onClick={this.showProfileImageModal}
          alt="Profile picture"
          shape="circle"
          style={{ marginLeft: 30, marginTop: 50 }}
        />
        {ImageModal}
      </div>
    );

    return (
      <Container>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <Card
            // style={{ width: 500, boxShadow: "3px 3px 3px 3px #9E9E9E" }}
            style={{ width: 500 }}
            hoverable
            cover={cover}
          >
            <Button
              type="primary"
              shape="round"
              icon={<Icon name="camera" />}
              onClick={this.showProfileImageModal}
            >
              Edit
            </Button>
            <h3 style={{ marginBottom: 0, marginTop: 10 }}>
              {profile.first_name} {profile.last_name}
            </h3>
            <p style={{ marginBottom: 0 }}>{profile.email}</p>
            <p>{profile.phone}</p>
            <Segment color="blue" onClick={this.showDrawer}>
              Loans
            </Segment>
            <Drawer
              title="Loans"
              width={720}
              onClose={this.drawerOnClose}
              visible={drawerVisible}
              bodyStyle={{ paddingBottom: 80 }}
            >
              <Table inverted celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Product</Table.HeaderCell>
                    <Table.HeaderCell>Card</Table.HeaderCell>
                    <Table.HeaderCell>Tenure</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Interest</Table.HeaderCell>
                    <Table.HeaderCell>Due Date</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {loans.map((loan) => (
                    <Table.Row key={loan.id}>
                      <Table.Cell>{loan.product}</Table.Cell>
                      <Table.Cell>{loan.card}</Table.Cell>
                      <Table.Cell>{loan.tenure}</Table.Cell>
                      <Table.Cell>{loan.amount}</Table.Cell>
                      <Table.Cell>{loan.interest}</Table.Cell>
                      <Table.Cell>{loan.due_date}</Table.Cell>
                      <Table.Cell>{loan.status}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Drawer>
            <Segment color="blue" onClick={this.showModal}>
              Edit User Details
            </Segment>
            <Modal
              visible={visible}
              title="Edit your details"
              onOk={this.handleUpdateProfile}
              onCancel={this.handleCancel}
              footer={[
                <Button shape="round" key="back" onClick={this.handleCancel}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  shape="round"
                  icon={<Icon name="edit" />}
                  loading={loading}
                  onClick={this.handleUpdateProfile}
                >
                  Update
                </Button>,
              ]}
            >
              <Form success={success} onSubmit={this.handleUpdateProfile}>
                <Form.Input
                  name="first_name"
                  icon="user"
                  iconPosition="left"
                  placeholder="First Name"
                  onChange={this.handleChange}
                  value={Data.first_name}
                />
                <Form.Input
                  name="last_name"
                  icon="user"
                  iconPosition="left"
                  placeholder="Last Name"
                  onChange={this.handleChange}
                  value={Data.last_name}
                />
                <Form.Input
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={Data.email}
                />
                <Form.Input
                  name="phone"
                  icon="phone"
                  iconPosition="left"
                  placeholder="Phone Number"
                  onChange={this.handleChange}
                  value={Data.phone}
                />
              </Form>
            </Modal>
            <Segment color="blue" onClick={this.showPasswordModal}>
              Change Password
            </Segment>
            <Modal
              visible={passwordVisible}
              title="Change your password"
              onOk={this.handleChangePassword}
              onCancel={this.handlePasswordModalCancel}
              footer={[
                <Button
                  shape="round"
                  key="back"
                  onClick={this.handlePasswordModalCancel}
                >
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  shape="round"
                  icon={<Icon name="edit" />}
                  loading={loading}
                  onClick={this.handleChangePassword}
                >
                  Change
                </Button>,
              ]}
            >
              <Form success={success} onSubmit={this.handleChangePassword}>
                <Form.Input
                  required
                  onChange={this.handlePasswordChange}
                  fluid
                  value={old_password}
                  name="old_password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Old Password"
                  type="password"
                />
                <Form.Input
                  required
                  onChange={this.handlePasswordChange}
                  fluid
                  value={new_password}
                  name="new_password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="New Password"
                  type="password"
                />
                <Form.Input
                  required
                  onChange={this.handlePasswordChange}
                  fluid
                  value={confirm_password}
                  name="confirm_password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm Password"
                  type="password"
                />
              </Form>
            </Modal>
            <div
              style={{
                marginTop: 30,
                textAlign: "center",
              }}
              color="blue"
            >
              <Button
                key="submit"
                shape="round"
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => this.props.logout()}
              >
                <Icon name="log out" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
