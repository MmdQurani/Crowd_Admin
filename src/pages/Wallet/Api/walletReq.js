/* eslint-disable no-unused-vars */

import Axios from 'component/Axios/Axios';

export const GetAllRefundRequestsReq = async (body) =>
  await Axios.post('WalletManagement/GetAllRefundRequests', body)
    .then((res) => res?.data)
    .catch((er) => false);

export const RefundRequestReq = async (api, body) =>
  await Axios.post(api, body)
    .then((res) => true)
    .catch((er) => er.response?.data?.title);

export const UpdateWalletStatusReq = async (body) =>
  await Axios.post('WalletManagement/UpdateWalletStatus', body)
    .then((res) => true)
    .catch((er) => false);
