/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllPlansReq = async (body) =>
  await Axios.post('PlansManagement/GetAll', body)
    .then((res) => res)
    .catch((er) => false);

export const GetPlanDetailsReq = async (id) =>
  await Axios.get(`PlansManagement/GetById/${id}`)
    .then((res) => res?.data)
    .catch((er) => false);

export const GetAllPlanOrdersReq = async (body) =>
  await Axios.post('OrdersManagement/GetAllByInvestmentId', body)
    .then((res) => res)
    .catch((er) => false);

export const UpdatePlanDetailsReq = async (body) =>
  await Axios.post('PlansManagement/UpdateInvestment', body)
    .then((res) => res)
    .catch((er) => false);

export const CreatePlanReq = async (body) =>
  await Axios.post('PlansManagement/Create', body)
    .then((res) => res)
    .catch((er) => false);

export const GetUserStatisticsReq = async (nationalId) =>
  await Axios.get(`AccountsManagement/GetUserStatistics/${nationalId}`)
    .then((res) => res?.data)
    .catch((er) => false);
