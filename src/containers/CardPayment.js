import React, { Component } from "react";
import { PaystackButton } from "react-paystack";
import { connect } from "react-redux";
import "../App.css";
import { cardPaymentURL, userIDURL } from "../constants";
import { authAxios } from "../utils";
import { withRouter, Redirect } from "react-router-dom";
import { Card, message } from "antd";
import { fetchCard } from "../store/actions/card";
import { Transition, Container } from "semantic-ui-react";

class CardPayment extends Component {
  state = {
    userID: null,
    redirect: false,
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
    this.handleFetchUserID();
  }

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        this.setState({ userID: res.data.userID });
      })
      .catch((err) => {
        message.error(err.response.statusText);
      });
  };
  render() {
    const { card } = this.props;
    const { visible } = this.state;
    const config = {
      email: "user@example.com",
      amount: 5000,
      publicKey: "pk_test_6d8ebfbc33894142ef2b8335b8be4d1f78fc1cd5",
    };
    const componentProps = {
      ...config,
      text: "Activate Card",
      onSuccess: (response) => {
        const { userID } = this.state;
        authAxios
          .post(cardPaymentURL, { response, userID })
          .then((res) => {})
          .catch((err) => {
            message.error(`${JSON.stringify(err.response.data.message)}`);
          });
        this.props.history.push("/");
        this.props.refreshCard();
      },
      onClose: () => alert("Wait! Don't leave :("),
    };

    if (card !== null) {
      return <Redirect to="/products" />;
    }
    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Card
              hoverable
              style={{
                width: 500,
                minHeight: 500,
              }}
            >
              <h3 style={{ textAlign: "center", paddingTop: 30 }}>
                Add Debit Card
              </h3>
              <p style={{ textAlign: "center", paddingTop: 50 }}>
                To proceed, you need to add your debit card for repayment.
                Kindly click the button below to activate your card.
              </p>
              <div style={{ justifyContent: "center", display: "flex" }}>
                <PaystackButton
                  className="paystack-button"
                  {...componentProps}
                />
              </div>
            </Card>
          </div>
        </Container>
      </Transition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    card: state.card.userCard,
    loading: state.card.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCard: () => dispatch(fetchCard()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CardPayment)
);
