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

import { IoMdClose } from "react-icons/io";

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

  // تغییر رمز
  const ChangePassword = async () => {
    setIsloadingReq(true);
    try {
      const res = await ChangePasswordReq({ // ارسال درخواست تغییر رمز
        userId: userInfo?.id,
        password: password
      });
      if (res) { // در صورتی که درخواست با موفقیت انجام شود
        toast.success('رمز عبور با موفقیت تغییر کرد ');
        setPassword('');
        setPasswordConfirm('');
      } else {
        toast.error('خطا ! درخواست شما انجام نشد .');
      }
    } catch (error) { // در صورتی که درخواست با خطا مواجه شود
      console.error('Error in ChangePassword:', error);
      toast.error('خطا در پردازش درخواست.');
    } finally {
      setIsloadingReq(false);
    }
  };

  const isFormValid = password?.length > 0 && passwordConfirm === password; // بررسی صحت فرم
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>

      {/* مدال تغییر رمز */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-max lg:w-[400px] h-max min-h-[350px] flex flex-col items-start justify-around relative px-4">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              <IoMdClose />
            </button>

            <h2 className="text-lg font-semibold mb-4">تغییر رمز عبور</h2>

            <input
              type="password"
              placeholder="رمز عبور جدید"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="تکرار رمز عبور"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={passwordConfirm || ''}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <button
              onClick={ChangePassword}
              disabled={!isFormValid || isloadingReq}
              className={`w-full py-2 rounded-md text-white ${isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {isloadingReq ? 'در حال ارسال...' : 'ثبت تغییر'}
            </button>

          </div>
        </div>
      )}


      <div className="flex flex-row items-start justify-center h-auto ">
        <div className="w-[350px] bg-white h-full bg-secondary sticky top-0 right-0 border-0 hidden lg:flex">
          <Sidebar />
        </div>

        {/* محتوای صفحه */}
        <div className='flex-1 w-full h-full flex flex-col items-center justify-start px-6 py-8'>

          {/* اطلاعات کاربر */}
          <div className='user-datas grid grid-cols-12 gap-4 w-full min-h-max bg-white border border-1 border-gray-200 rounded-lg p-5'>

            {/* نام و نام خانوادگی */}
            <div className='xl:col-span-3 md:col-span-6 col-span-12'>
              <div className='max-w-full text-sm h-10 flex justify-center items-center border border-1 border-gray-200 rounded-lg'>
                <span className='w-full block px-4 text-ellipsis'>نام و نام خانوادگی:  {userInfo?.realPerson?.firstName} {userInfo?.realPerson?.lastName}</span>
              </div>
            </div>

            {/* محل تولد */}
            <div className='xl:col-span-3 md:col-span-6 col-span-12'>
              <div className='max-w-full text-sm h-10 flex justify-center items-center border border-1 border-gray-200 rounded-lg'>
                <span className='w-full block px-4 text-ellipsis'>محل تولد: {userInfo?.realPerson?.placeOfBirth}</span>
              </div>
            </div>

            {/* تاریخ تولد */}
            <div className='xl:col-span-3 md:col-span-6 col-span-12'>
              <div className='max-w-full text-sm h-10 flex justify-center items-center border border-1 border-gray-200 rounded-lg'>
                <span className='w-full block px-4 text-ellipsis'>تاریخ تولد: {userInfo?.realPerson?.birthDate && getDate(userInfo?.realPerson?.birthDate)}</span>
              </div>
            </div>

            {/* کدملی */}
            <div className='xl:col-span-3 md:col-span-6 col-span-12'>
              <div className='max-w-full text-sm h-10 flex justify-center items-center border border-1 border-gray-200 rounded-lg'>
                <span className='w-full block px-4 text-ellipsis'>کدملی: {userInfo?.realPerson?.shNumber}</span>
              </div>
            </div>

            {/* تغییر رمز عبور */}
            <div className='change-password col-span-12 flex justify-center items-center mt-2.5'>
              <button onClick={() => setIsModalOpen(true)} className='md:w-1/2 w-full py-2 rounded-md bg-green-500 text-white'>تغییر رمز عبور</button>
            </div>

          </div>

        </div>

        {/* <div className="flex-1 w-full flex flex-col items-center align-middle p-9 ">
        {userInfo ? (
          <div className="grid grid-cols-12 w-full gap-x-8 gap-y-5 bg-white text-gray-800 border border-1 border-gray-200 rounded-lg p-5  font-normal">
            <div className='xl:col-span-3 sm:col-span-6 col-span-8 max-w-max min-w-full py-2 px-4 rounded-md border border-1 border-gray-300'>
              <p className="">
                نام و نام خانوادگی: {userInfo?.realPerson?.firstName} {userInfo?.realPerson?.lastName} محمد قرانی
              </p>
            </div>
            <div className='xl:col-span-3 sm:col-span-6 col-span-8 max-w-max min-w-full py-2 px-4 rounded-md border border-1 border-gray-300'>
              <p className="text-ellipsis">محل تولد: {userInfo?.realPerson?.placeOfBirth} ایران ، آذربایجان شرقی ، شهرستان مرند ، شهر دیزج حسین بیگ</p>
            </div>
            <div className='xl:col-span-3 sm:col-span-6 col-span-8 max-w-max min-w-full py-2 px-4 rounded-md border border-1 border-gray-300'>
              <p className="">
                تاریخ تولد:{' '}
                {userInfo?.realPerson?.birthDate && getDate(userInfo?.realPerson?.birthDate)}  1403/12/02
              </p>
            </div>
            <div className='xl:col-span-3 sm:col-span-6 col-span-8 max-w-max min-w-full py-2 px-4 rounded-md border border-1 border-gray-300'>
              <p className="">کدملی: {userInfo?.realPerson?.shNumber} 1570770761</p>
            </div>
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
          <div className="flex justify-between w-full items-end">
            <div className="w-[20%] flex items-center flex-col justify-center h-auto gap-y-1 ">
              <label
                htmlFor="password "
                className="w-full text-xs text-white text-start flex justify-start items-center ">
                رمز عبور جدید
              </label>
              <input
                className={`focus:outline-none focus:ring-0 focus:border-none  text-sm rounded-lg h-[40px] w-full pr-3 bg-white ${passwordConfirm && password && password !== passwordConfirm
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
                className={`focus:outline-none focus:ring-0 focus:border-none w-full  text-sm rounded-lg pr-3 h-[40px] bg-white ${passwordConfirm && password && password !== passwordConfirm
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
              className={`w-[20%]  text-white text-sm font-semibold ${disable ? 'opacity-100' : 'opacity-50'
                }  ${isloadingReq ? ' border border-green-500' : 'bg-green-500'
                } rounded-lg h-[40px]`}>
              {isloadingReq ? <BouncingDotsLoader /> : 'ثبت'}
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="border-b-2 border-gray-300  w-2/3 pt-10 px-5" />
        </div> */}
        {/* user logs table  */}
        {/* <div className="relative overflow-x-auto md:rounded-lg mt-8">
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
      </div> */}
      </div>
    </>
  );
}

export default Account;
