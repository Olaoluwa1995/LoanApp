import * as actionTypes from "../actions/actionTypes";
import {
  updateObject
} from "../utility";

const initialState = {
  adminToken: null,
  error: null,
  loading: false
};

const adminAuthStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const adminAuthSuccess = (state, action) => {
  return updateObject(state, {
    adminToken: action.adminToken,
    error: null,
    loading: false
  });
};

const adminAuthFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const adminAuthLogout = (state, action) => {
  return updateObject(state, {
    adminToken: null
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_START:
      return adminAuthStart(state, action);
    case actionTypes.ADMIN_SUCCESS:
      return adminAuthSuccess(state, action);
    case actionTypes.ADMIN_FAIL:
      return adminAuthFail(state, action);
    case actionTypes.ADMIN_LOGOUT:
      return adminAuthLogout(state, action);
    default:
      return state;
  }
};

export default reducer;