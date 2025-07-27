/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetUserLogsReq = async (data) =>
  await Axios.post('Accounts/GetUserLogins', data)
    .then((res) => res)
    .catch((er) => false);

export const ChangePasswordReq = async (data) =>
  await Axios.post('AccountsManagement/UpdateUserPassword', data)
    .then((res) => true)
    .catch((er) => false);
