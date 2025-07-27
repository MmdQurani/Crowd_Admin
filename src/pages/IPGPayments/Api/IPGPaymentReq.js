/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllIPGPaymnetReq = async (body) =>
  await Axios.post('PaymentManagement/GetAll', body)
    .then((res) => res)
    .catch((er) => false);

export const GetAllGatewayReq = async (body) =>
  await Axios.get('Gateway/GetAll', body)
    .then((res) => res)
    .catch((er) => false);
