/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';
import { GetUserInfoRequest } from 'component/layout/sidebar/Api/sidebarRequest';
import { getFromLocalStorage } from 'component/storage/localStorage';
import { GetAllPlanShortFormReq } from 'pages/CommentManagment/Api/CommentManagmentApiCall';
import { createContext, useEffect, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const token = JSON.parse(getFromLocalStorage('token'));

  useEffect(() => {
    token && getuserinfo();
    token && GetAllPlanShortForm();
    token && GetPermission();
  }, []);

  const getuserinfo = async () => {
    const res = await GetUserInfoRequest();
    setUserInfo(res);
  };

  const [timer, setTimer] = useState(2 * 60 * 1000);
  const [userInfo, setUserInfo] = useState();
  const [allPlanDetails, setAllPlanDetails] = useState();
  const [reload, setReload] = useState(false);
  const [accessiBility, setAccessiBility] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [permission, setPermission] = useState([]);

  const GetAllPlanShortForm = async () => {
    const res = await GetAllPlanShortFormReq({});
    if (res) {
      console.log(res);
      let array = res?.map((item) => ({ name: item?.title, key: item?.id }));
      console.log('syti', array);
      return setAllPlans(array || []);
    } else {
      setAllPlans([]);
    }
  };

  const GetPermission = async () => {
    try {
      const res = await Axios.get('Accounts/GetUserPermissions');
      setPermission(res?.data);
    } catch (er) {
      setPermission([]);
    }
  };
  return (
    <DataContext.Provider
      value={{
        timer,
        setTimer,
        userInfo,
        setUserInfo,
        allPlanDetails,
        setAllPlanDetails,
        reload,
        setReload,
        allPlans,
        accessiBility,
        setAccessiBility,
        setAllPlans,
        token,
        permission
      }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
