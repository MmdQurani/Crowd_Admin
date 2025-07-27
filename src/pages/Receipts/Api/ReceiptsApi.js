/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllRecieptReq = async (data) =>
  await Axios.post('OfflinePaymentManagement/GetAll', data)
    .then((res) => res)
    .catch((er) => false);

export const UpdateRecieptStatusReq = async (data) =>
  await Axios.post('OfflinePaymentManagement/UpdateStatus', data)
    .then((res) => res)
    .catch((er) => false);

export const GetOrderPreviewReq = async (id) =>
  await Axios.get(`OfflinePaymentManagement/GetOrderPreview/${id}`)
    .then((res) => res)
    .catch((er) => false);
