import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { authAxios } from "../utils";
import { Card, Button, Empty, message } from "antd";
import {
  Container,
  Table,
  Transition,
  Segment,
  Loader,
  Icon,
} from "semantic-ui-react";
import { userIDURL, userLoanListURL } from "../constants";

class UserLoans extends React.Component {
  state = {
    loading: true,
    visible: false,
    loans: [],
    userID: null,
    cancel: false,
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
    this.handleFetchUserID();
    this.handleFetchUserLoans();
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
        message.error(err.response.statusText);
      });
  };

  handleFetchUserLoans = () => {
    authAxios
      .get(userLoanListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ loans: res.data });
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        message.error(err.response.statusText);
      });
  };

  render() {
    const { loans, visible, loading } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          {loading && (
            <Segment>
              <Loader size="massive">Loading Loans</Loader>
            </Segment>
          )}
          <Card
            hoverable
            style={{
              minHeight: 600,
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bolder",
              }}
            >
              My Loans
            </h1>
            {loans.length !== 0 ? (
              <Fragment>
                <Table inverted celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Product</Table.HeaderCell>
                      <Table.HeaderCell>Card</Table.HeaderCell>
                      <Table.HeaderCell>Tenure (days)</Table.HeaderCell>
                      <Table.HeaderCell>Amount (#)</Table.HeaderCell>
                      <Table.HeaderCell>Interest (%)</Table.HeaderCell>
                      <Table.HeaderCell>Due Date</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {loans.map((loan) => (
                      <Table.Row key={loan.id}>
                        <Table.Cell>
                          {
                            <Link to={`user-loans/${loan.id}`}>
                              {loan.product}
                            </Link>
                          }
                        </Table.Cell>
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
              </Fragment>
            ) : (
              <Empty style={{ marginTop: 100 }} />
            )}
            <div style={{ float: "right", marginTop: 250 }}>
              <Link to="/products">
                <Button
                  type="primary"
                  shape="round"
                  icon={<Icon name="send" />}
                  size="middle"
                  style={{ width: 200, marginRight: 40 }}
                >
                  Apply
                </Button>
              </Link>
            </div>
          </Card>
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

export default withRouter(connect(mapStateToProps, null)(UserLoans));
