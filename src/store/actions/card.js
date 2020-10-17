import {
  CARD_START,
  CARD_SUCCESS,
  CARD_FAIL
} from "./actionTypes";
import {
  authAxios
} from "../../utils";
import {
  cardDetailURL
} from "../../constants";

export const cardStart = () => {
  return {
    type: CARD_START,
  };
};

export const cardSuccess = (data) => {
  return {
    type: CARD_SUCCESS,
    data,
  };
};

export const cardFail = (error) => {
  return {
    type: CARD_FAIL,
    error: error,
  };
};

export const fetchCard = () => {
  return (dispatch) => {
    dispatch(cardStart());
    authAxios
      .get(cardDetailURL)
      .then((res) => {
        dispatch(cardSuccess(res.data));
      })
      .catch((err) => {
        dispatch(cardFail(err));
      });
  };
};