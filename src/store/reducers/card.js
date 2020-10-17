import {
  CARD_START,
  CARD_SUCCESS,
  CARD_FAIL
} from "../actions/actionTypes";
import {
  updateObject
} from "../utility";

const initialState = {
  userCard: null,
  error: null,
  loading: false
};

const cardStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const cardSuccess = (state, action) => {
  return updateObject(state, {
    userCard: action.data,
    error: null,
    loading: false
  });
};

const cardFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CARD_START:
      return cardStart(state, action);
    case CARD_SUCCESS:
      return cardSuccess(state, action);
    case CARD_FAIL:
      return cardFail(state, action);
    default:
      return state;
  }
};

export default reducer;