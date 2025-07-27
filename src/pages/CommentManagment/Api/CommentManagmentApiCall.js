/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllPlanShortFormReq = async (body) =>
  await Axios.post('PlansManagement/GetAllTiny', body)
    .then((res) => res?.data)
    .catch((er) => false);

export const GetAllCommentsReq = async (body) =>
  await Axios.post('CommentsManagement/GetAll', body)
    .then((res) => res)
    .catch((er) => false);

export const GetCommentByIdReq = async (id) =>
  await Axios.get(`CommentsManagement/GetById/${id}`)
    .then((res) => res)
    .catch((er) => false);

export const UpdateCommentStatusReq = async (body) =>
  await Axios.post('CommentsManagement/UpdateState', body)
    .then((res) => res)
    .catch((er) => false);

export const CreateCommentReq = async (body) =>
  await Axios.post('CommentsManagement/Create', body)
    .then((res) => res)
    .catch((er) => false);

export const RemoveCommentReq = async (body) =>
  await Axios.post('CommentsManagement/Remove', body)
    .then((res) => res)
    .catch((er) => false);

export const UpdateCommentReq = async (body) =>
  await Axios.post('CommentsManagement/Update', body)
    .then((res) => res)
    .catch((er) => false);
