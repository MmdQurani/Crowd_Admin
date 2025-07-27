/* eslint-disable no-unused-vars */
import { getFromLocalStorage } from 'component/storage/localStorage';
import Axios from 'component/Axios/Axios';

const token = JSON.parse(getFromLocalStorage('token'));

export const GetUserInfoRequest = async () =>
  await Axios.get('Accounts/GetUserInfo')
    .then((res) => res?.data)
    .catch((er) => false);

export const getWalletBalanceReq = async () =>
  await Axios.post('Wallet/Balance', {})
    .then((res) => res)
    .catch((er) => false);
