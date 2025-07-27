/* eslint-disable no-unused-vars */
import DataContext from 'comon/context/MainContext';
import { getDate, getTime } from 'component/DateFunctions/DateFunctions';
import Sidebar from 'component/layout/sidebar/SideBar';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useContext, useEffect, useState } from 'react';
import { ChangePasswordReq, GetUserLogsReq } from './Api/AccountReq';
import background from 'asset/image/background/spiral.webp';
import { Pagination } from 'flowbite-react';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { toast } from 'react-toastify';

function Account() {
  const { userInfo } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [isloading, setIsloading] = useState();
  const [isloadingReq, setIsloadingReq] = useState(false);
  const [response, setResponse] = useState();

  useEffect(() => {
    GetUserLogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const GetUserLogs = async () => {
    setIsloading(true);

    const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

    const res = await GetUserLogsReq({
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    setIsloading(false);
    setResponse(res);
  };

  const ChangePassword = async () => {
    setIsloadingReq(true);
    try {
      const res = await ChangePasswordReq({
        userId: userInfo?.id,
        password: password
      });
      if (res) {
        toast.success('رمز عبور با موفقیت تغییر کرد ');
        setPassword('');
        setPasswordConfirm('');
      } else {
        toast.error('خطا ! درخواست شما انجام نشد .');
      }
    } catch (error) {
      console.error('Error in ChangePassword:', error);
      toast.error('خطا در پردازش درخواست.');
    } finally {
      setIsloadingReq(false);
    }
  };

  const disable = !!password && !!passwordConfirm && passwordConfirm == password;

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-3/4 max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex- flex-col items-center align-middle p-9 ">
        {userInfo ? (
          <div className="flex flex-wrap justify-between gap-x-8 items-center gap-y-5 bg-gray-500 text-white rounded-lg p-5  font-normal">
            <p className=" ">
              نام و نام خانوادگی: {userInfo?.realPerson?.firstName} {userInfo?.realPerson?.lastName}
            </p>
            <p className=" ">محل تولد: {userInfo?.realPerson?.placeOfBirth}</p>
            <p className=" ">
              تاریخ تولد:{' '}
              {userInfo?.realPerson?.birthDate && getDate(userInfo?.realPerson?.birthDate)}
            </p>
            <p className=" ">کدملی: {userInfo?.realPerson?.shNumber}</p>
          </div>
        ) : (
          <p className="border-2 border-accent rounded-md text-dominant-500">
            {' '}
            اطلاعاتی درمورد شما یافت نشده است
          </p>
        )}
        <div className="w-[60%] border-b border-white" />
        <div className="w-full flex   flex-col items-start justify-center p-3 bg-gray-500 rounded-large gap-y-3">
          <span className="w-full items-center justify-start text-white text-sm text-start">
            تغییر رمز عبور
          </span>
          <div className="flex justify-between w-full items-center">
            <div className="w-[20%] flex items-center flex-col justify-center h-auto gap-y-1 ">
              <label
                htmlFor="password "
                className="w-full text-xs text-white text-start flex justify-start items-center ">
                رمز عبور جدید
              </label>
              <input
                className={`focus:outline-none focus:ring-0 focus:border-none  text-sm rounded-lg h-[40px] w-full pr-3 bg-white ${
                  passwordConfirm && password && password !== passwordConfirm
                    ? ' borde border-red-600 text-red-600'
                    : 'border-0 focus:border-none  text-gray-600 '
                } `}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="w-[20%] flex items-center flex-col justify-center h-auto gap-y-1 ">
              <label
                htmlFor="passwordConfirm"
                className="w-full text-xs text-white text-start flex justify-start items-center ">
                تکرار رمز{' '}
              </label>
              <input
                className={`focus:outline-none focus:ring-0 focus:border-none w-full  text-sm rounded-lg pr-3 h-[40px] bg-white ${
                  passwordConfirm && password && password !== passwordConfirm
                    ? ' borde border-red-600 text-red-600'
                    : 'border-0 focus:border-none  text-gray-600 '
                } `}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                value={passwordConfirm}
              />
            </div>
            <button
              onClick={ChangePassword}
              disabled={!disable}
              className={`w-[20%]  text-white text-sm font-semibold ${
                disable ? 'opacity-100' : 'opacity-50'
              }  ${
                isloadingReq ? ' border border-green-500' : 'bg-green-500'
              } rounded-lg h-[40px]`}>
              {isloadingReq ? <BouncingDotsLoader /> : 'ثبت'}
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="border-b-2 border-gray-300  w-2/3 pt-10 px-5" />
        </div>
        {/* user logs table  */}
        <div className="relative overflow-x-auto md:rounded-lg mt-8">
          <table className="table-auto  font-IRANYekanX w-full  rounded-md">
            <thead className="font-bold  shadow-xl bg-white text-base text-right text-dominant-500  ">
              <tr className=" ">
                <th className="  border-gray-600  bg-secondary p-3">ردیف</th>
                <th className="  border-gray-600  bg-secondary p-3">IP آدرس</th>
                <th className="  border-gray-600  bg-secondary p-3">تاریخ</th>
                <th className="  border-gray-600  bg-secondary p-3">ساعت </th>
              </tr>
            </thead>
            <tbody>
              {response &&
                response?.data?.map((data, index) => (
                  <tr key={index} className="  p-10  text-caption text-right text-dominant-500">
                    <td className="p-3 font-semibold border-b border-gray-300 ">{index + 1}</td>
                    <td className="p-3 border-b border-gray-300">{data?.ipAddress}</td>
                    <td className="p-3 border-b border-gray-300 ">{getDate(data?.time) || '-'}</td>
                    <td className="p-3 border-b border-gray-300 ">{getTime(data?.time) || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full flex-col flex items-center">
              <BouncingDotsLoader />{' '}
            </div>
          )}
          {response?.data?.length === 0 && isloading === false && (
            <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
              <p>تراکنشی برای شما یافت نشد </p>
            </div>
          )}
          <div className=" relative flex justify-center p-8">
            {' '}
            <PaginationComponet
              total={response?.pagination?.total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
