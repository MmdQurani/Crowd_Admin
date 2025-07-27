import {
  FETCH_USER_INFO_START,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAIL
} from 'component/action/actionTypes';
// import { GetUserInformationsApi } from "";
import { httpFailAction, httpStartAction } from './storeUtils';
import { getFromLocalStorage, removeFromLocalStorage } from 'component/storage/localStorage';
import axios from 'axios';
import { toast } from 'react-toastify';

const fetchUserInfoSuccess = (result) => {
  return {
    type: FETCH_USER_INFO_SUCCESS,
    result
  };
};

export const fetchUserInfo = () => async (dispatch) => {
  console.log(dispatch);
  httpStartAction(FETCH_USER_INFO_START);
  try {
    const token = getFromLocalStorage('token');
    const res = await axios.get('GetUserInformationsApi', {
      headers: { Authorization: `Bearer ${token?.replaceAll('"', '')}` }
    });
    fetchUserInfoSuccess(res.data);
  } catch (error) {
    toast.error('لطفا مجددا وارد حساب کاربری خود شوید', {
      toastId: 'userinfoaction-login-again'
    });
    removeFromLocalStorage('token');
    window.location.pathname = '/Home';
    httpFailAction(FETCH_USER_INFO_FAIL, error);
  }
};
