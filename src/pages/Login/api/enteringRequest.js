/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import { ErrorHandler } from 'component/db/ErrorHandler';
import Axios from 'component/Axios/Axios';

export const LoginReq = async (data) => {
  return await Axios.post('AccountsManagement/Login', data)
    .then((res) => res.data.token)
    .catch((ex) => toast.error(ErrorHandler(ex?.response?.data?.title)));
}

export const GetCaptchaReq = async () =>
  await Axios.post('Captcha/Create')
    .then((res) => res?.data)
    .catch((er) => false);
