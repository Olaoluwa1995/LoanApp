import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter, Link } from "react-router-dom";
import { adminAxios } from "../utils";
import { message } from "antd";
import {
  Container,
  Transition,
  Image,
  Button,
  Card,
  Icon,
  Label,
} from "semantic-ui-react";
import { allLoansDetailURL, loanUpdateURL } from "../constants";

class LoansDetail extends React.Component {
  state = {
    loading: false,
    visible: false,
    loan: {},
    user: {},
    user_profile: {},
    approve: true,
    reject: true,
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
    this.handleFetchLoansDetail();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFetchLoansDetail = () => {
    const loanId = this.props.match.params.loanId;
    adminAxios
      .get(allLoansDetailURL(loanId))
      .then((res) => {
        if (this._isMounted) {
          this.setState({ loan: res.data });
          this.setState({ user: res.data.user });
          this.setState({ user_profile: res.data.user_profile });
        }
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("There is an error");
      });
  };

  handleLoanAccept = () => {
    const loanId = this.props.match.params.loanId;
    const { approve } = this.state;
    adminAxios
      .put(loanUpdateURL(loanId), { approve, loanId })
      .then((res) => {
        message.success(res.data.message);
        this.handleFetchLoansDetail();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("There is an error");
      });
  };

  handleLoanReject = () => {
    const loanId = this.props.match.params.loanId;
    const { reject } = this.state;
    adminAxios
      .put(loanUpdateURL(loanId), { reject, loanId })
      .then((res) => {
        message.success(res.data.message);
        this.handleFetchLoansDetail();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("There is an error");
      });
  };

  render() {
    const { loan, visible, user, user_profile } = this.state;

    const { isAdminAuthenticated } = this.props;
    if (!isAdminAuthenticated) {
      return <Redirect to="/admin-login" />;
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
                <Link to="/all-loans">
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
                <div className="ui two buttons">
                  {loan.status === "Pending" ? (
                    <Button
                      type="primary"
                      color="blue"
                      onClick={this.handleLoanAccept}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button type="primary" color="blue" disabled>
                      Approve
                    </Button>
                  )}
                  {loan.status === "Pending" ? (
                    <Button
                      type="primary"
                      color="red"
                      onClick={this.handleLoanReject}
                    >
                      Reject
                    </Button>
                  ) : (
                    <Button type="primary" color="red" disabled>
                      Reject
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
    isAdminAuthenticated: state.adminAuth.adminToken !== null,
  };
};

export default withRouter(connect(mapStateToProps, null)(LoansDetail));
