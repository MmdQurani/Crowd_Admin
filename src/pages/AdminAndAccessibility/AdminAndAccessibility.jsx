/* eslint-disable no-unused-vars */
import DataContext from 'comon/context/MainContext';
import { getDate, getTime } from 'component/DateFunctions/DateFunctions';
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useState } from 'react';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import axios from 'axios';
import getBaseUrl from 'component/Axios/getBaseUrl';
import EditeUserModal from './component/EditeUserModal';
import FindUser from 'component/AutoComplete/FindUser';
import { toast } from 'react-toastify';

function AdminAndAccessibility() {
  const { token } = useContext(DataContext);
  const [userAdmin, setUserAdmin] = useState();
  const [isloading, setIsloading] = useState({});
  const [editeUser, setEditeUser] = useState();
  const [userId, setUserId] = useState();
  const [nationaCode, setNationaCode] = useState();

  useEffect(() => {
    !editeUser && GetAllAdmin();
  }, [editeUser]);

  const GetAllAdmin = async () => {
    setIsloading('user', true);
    try {
      const res = await axios.post(
        getBaseUrl() + 'AccountsManagement/GetAllAdminUsers',
        {},
        {
          headers: { Authorization: 'Bearer  ' + token }
        }
      );
      setUserAdmin(res?.data?.data);
    } catch (er) {
      setUserAdmin(false);
    } finally {
      setIsloading('user', false);
    }
  };

  const AddNewAdmin = async () => {
    setIsloading('add', true);
    try {
      await axios.post(
        getBaseUrl() + `AccountsManagement/AddToRole?nationalId=${nationaCode}&roleName=Admin`,
        {},
        {
          headers: { Authorization: 'Bearer  ' + token }
        }
      );
      toast.success(' دسترسی ادمین به کاربر مورد نظر داده شد ');
    } catch (er) {
      toast.error('خطایی در انجام درخواست شما رخ داده است لطفا کمی دیگر تلاش کنید ');
    } finally {
      setIsloading('add', false);
      setNationaCode(false);
      GetAllAdmin();
    }
  };

  console.log(nationaCode);

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full  max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-9 ">
        {/*  add user to admin role inb top box */}
        <div className=" w-[50%] flex justify-between p-5 h-[80px] items-center  border border-gray-400 rounded-lg  bg-white  shadow-md   ">
          <div className="w-[40%] flex justify-center items-center h-auto">
            {' '}
            <FindUser
              setUserId={setUserId}
              setNationalCode={setNationaCode}
              nationalCode={nationaCode}
            />
          </div>
          <button
            onClick={AddNewAdmin}
            disabled={!nationaCode}
            className={` w-[20%] text-green-600 border ${
              !nationaCode && 'opacity-50 '
            } border-green-600 text-center font-medium flex justify-center items-center h-[38px] rounded-lg   text-base `}>
            {isloading?.add ? <BouncingDotsLoader /> : 'ثبت'}{' '}
          </button>
        </div>
        {/* user logs table  */}
        <div className="relative overflow-x-auto md:rounded-lg mt-8 w-full ">
          {userAdmin && userAdmin?.length > 0 && (
            <table className="table-auto  font-IRANYekanX w-full  rounded-md">
              <thead className="font-bold  shadow-xl bg-white text-base text-right text-dominant-500  ">
                <tr className=" ">
                  <th className="  border-gray-600  bg-secondary p-3 text-center ">ردیف</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center  ">نام کاربری</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center  ">عنوان</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center  ">شماره همراه</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center ">آخرین ورود</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center  ">IP آدرس</th>
                  <th className="  border-gray-600  bg-secondary p-3 text-center "> عملیات</th>
                </tr>
              </thead>
              <tbody>
                {userAdmin?.map((data, index) => (
                  <tr key={index} className="  p-10  text-caption text-right text-dominant-500">
                    <td className="p-3 font-semibold border-b border-gray-300 text-center ">
                      {index + 1}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center ">{data?.username}</td>
                    <td className="p-3 border-b border-gray-300 text-center ">{data?.title}</td>
                    <td className="p-3 border-b border-gray-300 text-center ">
                      {data?.phoneNumber}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center ">
                      {(data?.lastLoginInAdminPanel && getDate(data?.lastLoginInAdminPanel)) || '-'}
                      <br />
                      {(data?.lastLoginInAdminPanel &&
                        data?.lastLoginInAdminPanel?.split('T')?.[1]) ||
                        '-'}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center  ">
                      {(data?.lastLoginInAdminPanel && data?.lastIp) || '-'}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center   ">
                      <EditeUserModal setEditeUser={setEditeUser} data={data} token={token} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {isloading?.user && (
            <div className=" w-full flex-col flex items-center">
              <BouncingDotsLoader />{' '}
            </div>
          )}
          {userAdmin?.length === 0 && isloading === false && (
            <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
              <p>تراکنشی برای شما یافت نشد </p>
            </div>
          )}
          {/* <div className=" relative flex justify-center p-8">
            {' '}
            <PaginationComponet
              total={response?.pagination?.total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AdminAndAccessibility;
