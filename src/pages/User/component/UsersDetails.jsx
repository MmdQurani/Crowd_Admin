/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { GetUserByNationalIdReq } from '../Api/UserReq';
import LegalUserData from './LegalUserData';
import RealUserData from './RealUserData';
import { GetUserStatisticsReq } from 'pages/Plans/Api/PlanReq';
import DataContext from 'comon/context/MainContext';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';

const UsersDetails = () => {
  const { reload } = useContext(DataContext);
  const { code } = useParams();
  const [details, setDetails] = useState();
  const [statistics, setStatistics] = useState();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    GetUserData();
    GetUserStatistics();
  }, [reload]);

  const GetUserData = async () => {
    setIsloading(true);
    const res = await GetUserByNationalIdReq(code);
    if (res) {
      setDetails(res);
    } else {
      setDetails(false);
    }
    setIsloading(false);
  };

  const GetUserStatistics = async () => {
    const res = await GetUserStatisticsReq(code);
    if (res) {
      setStatistics(res);
    } else {
      setStatistics(false);
    }
  };

  const DetectUserType =
    code?.length !== 10 ? (
      <LegalUserData details={details} statistics={statistics} />
    ) : (
      <RealUserData details={details} statistics={statistics} />
    );

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        {isloading ? (
          <BouncingDotsLoader />
        ) : details ? (
          DetectUserType
        ) : (
          <span className=" w-full flex justify-center items-center text-center text-base text-gray-600  font-semibold ">
            کاربری یافت نشد{' '}
          </span>
        )}
      </div>
    </div>
  );
};

export default UsersDetails;
