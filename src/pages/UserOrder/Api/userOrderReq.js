/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import Axios from 'component/Axios/Axios';

export const GetALLUsersOrderReq = async (body) =>
  await Axios.post('OrdersManagement/GetAll', body)
    .then((res) => res)
    .catch((er) => false);

export const GetUsersOrderDetailsReq = async (orderId) =>
  await Axios.get(`OrdersManagement/GetById/${orderId}`)
    .then((res) => res)
    .catch((er) => false);

export const CreateUserOrderReq = async (body) =>
  await Axios.post('OrdersManagement/Create', body)
    .then((res) => res?.data)
    .catch((er) => {
      toast.error(er?.response?.data?.title);
      return false;
    });

export const OfflinePaymentManagementReq = async (body) =>
  await Axios.post('OfflinePaymentManagement/Create', body)
    .then((res) => res?.data)
    .catch((er) => {
      toast.error(er?.response?.data?.title);
      return false;
    });

export const GetOrderWalletFlows = async (body) =>
  await Axios.post('WalletManagement/GetWalletFlows', body)
    .then((res) => res)
    .catch((er) => {
      toast.error(er?.response?.data?.title);
      return false;
    });
