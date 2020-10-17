import axios from "axios";
import * as actionTypes from "./actionTypes";
import {
  adminRegisterURL,
  adminLoginURL
} from "../../constants";

export const adminAuthStart = () => {
  return {
    type: actionTypes.ADMIN_START,
  };
};

export const adminAuthSuccess = (adminToken) => {
  return {
    type: actionTypes.ADMIN_SUCCESS,
    adminToken: adminToken,
  };
};

export const adminAuthFail = (error) => {
  return {
    type: actionTypes.ADMIN_FAIL,
    error: error,
  };
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.ADMIN_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(adminLogout());
    }, expirationTime * 1000);
  };
};

export const adminLogin = (username, password) => {
  return (dispatch) => {
    dispatch(adminAuthStart());
    axios
      .post(adminLoginURL, {
        username: username,
        password: password,
      })
      .then((res) => {
        const adminToken = res.data.token;
        console.log(res.data);
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(adminAuthSuccess(adminToken));
        dispatch(checkAuthTimeout(3600));
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response.data.non_field_errors[0]);
        dispatch(adminAuthFail(err));
      });
  };
};

export const adminSignup = (
  username,
  email,
  first_name,
  last_name,
  phone,
  password,
  password2
) => {
  return (dispatch) => {
    dispatch(adminAuthStart());
    axios
      .post(adminRegisterURL, {
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        password: password,
        password2: password2,
      })
      .then((res) => {
        const adminToken = res.data.token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("expirationDate", expirationDate);
      })
      .catch((err) => {
        dispatch(adminAuthFail(err));
      });
  };
};

export const authAdminCheckState = () => {
  return (dispatch) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken === undefined) {
      dispatch(adminLogout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(adminLogout());
      } else {
        dispatch(adminAuthSuccess(adminToken));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};