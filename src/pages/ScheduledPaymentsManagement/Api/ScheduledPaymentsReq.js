/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const ScheduledPaymentsManagementReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/GetAll', data)
    .then((res) => res)
    .catch((er) => false);

export const ScheduledPaymentsManagementDetailsReq = async (id) =>
  await Axios.get(`ScheduledPaymentsManagement/GetById/${id}`)
    .then((res) => res)
    .catch((er) => false);

export const GetOrdersDetailsReq = async (id) =>
  await Axios.get(`ScheduledPaymentsManagement/GetOrdersByScheduledPaymentId/${id}`)
    .then((res) => res)
    .catch((er) => false);

export const ConfirmDepositeScheduledPaymentReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/ConfirmDepositeScheduledPayment', data)
    .then((res) => true)
    .catch((er) => false);

export const GetWalletFlowsReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/GetPayouts', data)
    .then((res) => res?.data)
    .catch((er) => false);

export const GetWalletFlowsPreviewReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/GetWalletFlowsPreview', data)
    .then((res) => res?.data)
    .catch((er) => false);

export const CreateScheduledPaymentsReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/Create', data)
    .then((res) => true)
    .catch((er) => false);

export const UpdateScheduledPaymentsReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/Update', data)
    .then((res) => true)
    .catch((er) => false);

export const RemoveScheduledPaymentsReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/Remove', data)
    .then((res) => true)
    .catch((er) => false);

export const AddpayOutWalletFlowReq = async (data) =>
  await Axios.post('ScheduledPaymentsManagement/AddPayoutWalletFlow', data)
    .then((res) => true)
    .catch((er) => false);
