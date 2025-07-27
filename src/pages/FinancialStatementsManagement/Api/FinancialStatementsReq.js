/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllFinancialStatementsReq = async (data) =>
  await Axios.post('FinancialStatementsManagement/GetAll', data)
    .then((res) => res)
    .catch((er) => false);

export const FinancialStatementsUpdateStateReq = async (data) =>
  await Axios.post('FinancialStatementsManagement/Update', data)
    .then((res) => res)
    .catch((er) => false);

export const DepositeReceiptReq = async (data) =>
  await Axios.post('WalletManagement/DepositeReceipt', data)
    .then((res) => res)
    .catch((er) => false);

export const CreateFinancialStatementsManagementReq = async (data) =>
  await Axios.post('FinancialStatementsManagement/Create', data)
    .then((res) => res)
    .catch((er) => false);

export const UpdateFinancialStatementsManagementReq = async (data) =>
  await Axios.post('FinancialStatementsManagement/Update', data)
    .then((res) => res)
    .catch((er) => false);
