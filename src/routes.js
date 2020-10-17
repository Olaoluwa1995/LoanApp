import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import AdminLogin from "./containers/AdminLogin";
import Signup from "./containers/Signup";
import AdminSignup from "./containers/AdminSignup";
import Profile from "./containers/Profile";
import AdminProfile from "./containers/AdminProfile";
import SubscriptionProducts from "./containers/SubscriptionProducts";
import CardPayment from "./containers/CardPayment";
import UserLoans from "./containers/UserLoans";
import AllLoans from "./containers/AllLoans";
import LoansDetail from "./containers/LoansDetail";
import UserLoansDetail from "./containers/UserLoansDetail";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/login" component={Login} />
    <Route exact path="/admin-login" component={AdminLogin} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/admin-signup" component={AdminSignup} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/admin-profile" component={AdminProfile} />
    <Route exact path="/products" component={SubscriptionProducts} />
    <Route exact path="/card-payment" component={CardPayment} />
    <Route exact path="/" component={UserLoans} />
    <Route exact path="/all-loans" component={AllLoans} />
    <Route exact path="/all-loans/:loanId" component={LoansDetail} />
    <Route exact path="/user-loans/:loanId" component={UserLoansDetail} />
  </Hoc>
);

export default BaseRouter;
