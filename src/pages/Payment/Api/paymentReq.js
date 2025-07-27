/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllPaymentReq = async (body) =>
  await Axios.post('PaymentManagement/GetAll', body)
    .then((res) => res)
    .catch((er) => false);

export const GetAllGetwayReq = async () =>
  await Axios.get('Gateway/GetAll')
    .then((res) => res)
    .catch((er) => false);

export const AutoCompleteUsernameReq = async (username) =>
  await Axios.get(`AccountsManagement/AutoCompleteUsername/${username}`)
    .then((res) => res)
    .catch((er) => false);
