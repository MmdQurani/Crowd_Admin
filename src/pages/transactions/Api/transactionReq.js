/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetWalletFlowsReq = async (data) =>
  await Axios.post('WalletManagement/GetWalletFlows', data)
    .then((res) => res)
    .catch((er) => false);

export const UpdateWalletFlowStatusReq = async (data) =>
  await Axios.post('WalletManagement/UpdateWalletFlowStatus', data)
    .then((res) => res)
    .catch((er) => false);
