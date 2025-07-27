/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllInverstmentCalendarReq = async (data) =>
  await Axios.post('TimelineManagement/GetAll', data)
    .then((res) => res)
    .catch((er) => false);

export const UpdateInverstmentCalendarReq = async (data) =>
  await Axios.post('TimelineManagement/Update', data)
    .then((res) => res)
    .catch((er) => false);

export const CreateInverstmentCalendarReq = async (data) =>
  await Axios.post('TimelineManagement/Create', data)
    .then((res) => res)
    .catch((er) => false);

export const DeleteInverstmentCalendarReq = async (data) =>
  await Axios.post('TimelineManagement/Remove', data)
    .then((res) => res)
    .catch((er) => false);
