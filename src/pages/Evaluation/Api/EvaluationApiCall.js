/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import Axios from 'component/Axios/Axios';

export const GetAllEvaluationReq = async (body) =>
  await Axios.post('InvesteeAssessments/GetAll', body)
    .then((res) => res)
    .catch((ex) => {
      toast.error(ex?.response?.data?.title);
      return false;
    });

export const CreateEvaluationReq = async (body) =>
  await Axios.post('InvesteeAssessments/Create', body)
    .then((res) => res)
    .catch((ex) => {
      toast.error(ex?.response?.data?.title);
    });

export const UpdateEvaluationReq = async (body) =>
  await Axios.post('InvesteeAssessments/Update', body)
    .then((res) => true)
    .catch((ex) => {
      toast.error(ex?.response?.data?.title);
      return false;
    });

export const RemoveEvaluationReq = async (body) =>
  await Axios.post('InvesteeAssessments/Remove', body)
    .then((res) => true)
    .catch((ex) => {
      toast.error(ex?.response?.data?.title);
      return false;
    });
