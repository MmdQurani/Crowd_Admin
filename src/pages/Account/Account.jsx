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

import { Table } from 'flowbite-react';

import { IoMdClose } from "react-icons/io";
import UserInfoCard from 'component/UserInfoCard/UserInfoCard';

function Account() {
  const { userInfo } = useContext(DataContext); // اطلاعات کاربر
  const [currentPage, setCurrentPage] = useState(1); // صفحه جاری
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState(); // تکرار رمز
  const [isloading, setIsloading] = useState();
  const [isloadingReq, setIsloadingReq] = useState(false); // بارگزاری درخواست
  const [response, setResponse] = useState(); // نتیجه درخواست

  const isFormValid = password?.length > 0 && passwordConfirm === password; // بررسی صحت فرم
  const [isModalOpen, setIsModalOpen] = useState(false); // بارگزاری مدال

  useEffect(() => { // در صورتی که صفحه جاری تغییر کند
    GetUserLogs(); // درخواست اطلاعات
  }, [currentPage]);

  const handlePageChange = (page) => { // تغییر صفحه
    setCurrentPage(page);
  };

  const GetUserLogs = async () => { // درخواست اطلاعات
    setIsloading(true);

    const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1); // محاسبه شماره صفحه

    const res = await GetUserLogsReq({
      pagination: {
        take: 10,
        skip: Skip
      }
    }); // درخواست اطلاعات
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
        {/* سایدبار */}
        <div className="w-[350px] bg-white h-full bg-secondary sticky top-0 right-0 border-0 hidden lg:flex">
          <Sidebar />
        </div>

        {/* محتوای صفحه */}
        <div className='flex-1 w-full h-full flex flex-col items-center justify-start px-6 py-8'>

          {/* اطلاعات کاربر */}
          <UserInfoCard
            userInfo={userInfo}
            onChangePassword={() => setIsModalOpen(true)} // اکتیو کننده مودال
          />

          {/* جدول لاگ‌ها */}
          <div
            dir="rtl"
            className="relative w-full overflow-x-auto shadow-md sm:rounded-lg mt-4 striped-rows"
          >
            <Table hoverable={false}>
              {/* هدر با رنگ خاکستری ملایم و فاصله‌ی بالا */}
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  IP آدرس
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تاریخ
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  ساعت
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((log, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell className="text-right">{idx + 1}</Table.Cell>
                      <Table.Cell className="text-right">{log.ipAddress}</Table.Cell>
                      <Table.Cell className="text-right">
                        {getDate(log.time) || '—'}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {getTime(log.time) || '—'}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center text-gray-500 py-4">
                      هیچ لاگی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>

          {/* صفحه بندی */}
          <div className=" relative flex justify-center p-8">
            {' '}
            <PaginationComponet
              total={response?.pagination?.total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>

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

        </div>

      </div>
    </>
  );
}

export default Account;
