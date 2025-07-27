/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';

export const GetAllUsersReq = async (Api, data) =>
  await Axios.post(Api, data)
    .then((res) => res)
    .catch((er) => false);

export const GetUserWalletBalanceReq = async (data) =>
  await Axios.post('WalletManagement/Balance', data)
    .then((res) => res?.data)
    .catch((er) => false);

export const GetUserByNationalIdReq = async (nationalId) =>
  await Axios.get(`AccountsManagement/GetUserByNationalId/${nationalId}`)
    .then((res) => res?.data)
    .catch((er) => false);

// currently user role
export const GetRolesReq = async () =>
  await Axios.get('AccountsManagement/GetRoles')
    .then((res) => res?.data)
    .catch((er) => false);

// crowd user  roles
export const GetUserRoleReq = async (userId) =>
  await Axios.get(`AccountsManagement/GetUserRoles/${userId}`)
    .then((res) => res?.data)
    .catch((er) => false);

export const GetImpersonateTokenReq = async (body) =>
  await Axios.post('AccountsManagement/Impersonate', body)
    .then((res) => res?.data)
    .catch((er) => false);

export const RemoveFromRoleReq = async (nationalId, rolename) =>
  await Axios.post(
    `AccountsManagement/RemoveFromRole?nationalId=${nationalId}&roleName=${rolename}`,
    {}
  )
    .then((res) => true)
    .catch((er) => false);

export const AddToRolesReq = async (nationalId, rolename) =>
  await Axios.post(`AccountsManagement/AddToRole?nationalId=${nationalId}&roleName=${rolename}`, {})
    .then((res) => true)
    .catch((er) => false);

export const CreateSejamOtpReq = async (body) =>
  await Axios.post('Accounts/CreateSejamOtp', body)
    .then((res) => true)
    .catch((er) => false);

export const UserRegisterReq = async (body) =>
  await Axios.post('AccountsManagement/Register', body)
    .then((res) => true)
    .catch((er) => false);

export const UpdateUserStatusReq = async (body) =>
  await Axios.post('AccountsManagement/UpdateUserStatus', body)
    .then((res) => true)
    .catch((er) => false);
