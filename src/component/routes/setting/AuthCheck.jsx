import { useEffect } from 'react';
import { getFromLocalStorage } from 'component/storage/localStorage';
import { fetchUserInfo } from 'component/action/userInfoAction';

export const AuthCheck = ({ children }) => {
  const token = getFromLocalStorage('token');
  const OnfetchUserInfo = () => {
    return fetchUserInfo();
  };

  useEffect(() => {
    if (token) {
      OnfetchUserInfo();
    }
  }, []);

  return <>{children}</>;
};
