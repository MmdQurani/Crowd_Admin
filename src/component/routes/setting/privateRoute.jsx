import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchUserInfo } from 'component/action/userInfoAction';
import { getFromLocalStorage } from 'component/storage/localStorage';

export default function PrivateRouts() {
  const token = getFromLocalStorage('token'); //if token exists
  console.log('token', token);

  const onFetchUserInfo = () => {
    return fetchUserInfo();
  };

  useEffect(() => {
    if (token) {
      onFetchUserInfo();
      //get user information
    }
  }, []);

  return token ? <Outlet /> : <Navigate to="/login" />;
}
