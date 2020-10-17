import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter, Link } from "react-router-dom";
import { authAxios } from "../utils";
import { Button, message } from "antd";
import {
  Container,
  Transition,
  Icon,
  Image,
  Card,
  Label,
} from "semantic-ui-react";
import { userLoansDetailURL, loanUpdateURL } from "../constants";

class UserLoansDetail extends React.Component {
  state = {
    visible: false,
    loan: {},
    user: {},
    user_profile: {},
    cancel: true,
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
    this.handleFetchUserLoansDetail();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFetchUserLoansDetail = () => {
    const loanId = this.props.match.params.loanId;
    authAxios
      .get(userLoansDetailURL(loanId))
      .then((res) => {
        if (this._isMounted) {
          this.setState({ loan: res.data });
          this.setState({ user: res.data.user });
          this.setState({ user_profile: res.data.user_profile });
        }
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleLoanCancel = () => {
    const loanId = this.props.match.params.loanId;
    const { cancel } = this.state;
    authAxios
      .put(loanUpdateURL(loanId), { cancel, loanId })
      .then((res) => {
        message.success(res.data.message);
        this.handleFetchUserLoansDetail();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("There is an error");
      });
  };

  render() {
    const { loan, visible, user, user_profile } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Card
              style={{
                width: 400,
                minHeight: 400,
              }}
            >
              <Card.Content>
                <Image
                  floated="right"
                  size="massive"
                  src={user_profile.photo}
                  avatar
                />
                <Link to="/">
                  <Icon name="angle double left" size="big" />
                </Link>
                <Card.Header style={{ marginTop: 30 }}>
                  <h2>
                    {user.first_name} {user.last_name}
                  </h2>
                </Card.Header>

                <Card.Meta>
                  <div style={{ marginTop: 10 }}>
                    <Label as="h3" size="large">
                      Card: <Label.Detail>{loan.card}</Label.Detail>
                    </Label>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Label as="h3" size="large">
                      Product: <Label.Detail>{loan.product}</Label.Detail>
                    </Label>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Label as="h3" size="large">
                      Due Date: <Label.Detail>{loan.due_date}</Label.Detail>
                    </Label>
                  </div>
                </Card.Meta>
                <Card.Description>
                  <div style={{ marginTop: 10 }}>
                    <Label as="h3" tag size="large">
                      {loan.tenure} days tenure
                    </Label>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Label as="h3" tag size="large">
                      {loan.interest}% interest
                    </Label>
                  </div>
                </Card.Description>
                <div>
                  <Label as="h4" color="blue" ribbon="right" size="big">
                    #{loan.amount}
                  </Label>
                </div>
                <div>
                  <Label
                    as="h4"
                    color="blue"
                    style={{ marginTop: 5 }}
                    ribbon="right"
                    size="big"
                  >
                    {loan.status}
                  </Label>
                </div>
              </Card.Content>
              <Card.Content extra>
                <div style={{ justifyContent: "center", display: "flex" }}>
                  {loan.status === "Pending" && (
                    <Button
                      key="submit"
                      style={{ backgroundColor: "red", color: "white" }}
                      shape="round"
                      icon={<Icon name="send" />}
                      onClick={this.handleLoanCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </Container>
      </Transition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default withRouter(connect(mapStateToProps, null)(UserLoansDetail));
