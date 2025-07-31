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
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';
import { Table } from 'flowbite-react';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-auto">

      {/* سایدبار */}
      <div className="min-w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-9 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        {/*  add user to admin role inb top box */}
        <div className=" w-[50%] flex justify-between p-5 h-max items-end  border border-gray-400 rounded-lg  bg-white  shadow-md">
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
            className={` w-[20%] text-green-600 border ${!nationaCode && 'opacity-50 '
              } border-green-600 text-center font-medium flex justify-center items-center h-[38px] rounded-lg   text-base `}>
            {isloading?.add ? <BouncingDotsLoader /> : 'ثبت'}{' '}
          </button>
        </div>

        {/* user logs table  */}

        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          {userAdmin && userAdmin.length > 0 && (
            <Table className="table-auto font-IRANYekanX rounded-lg w-full whitespace-nowrap">
              <Table.Head className="bg-secondary text-base text-right text-dominant-500">
                <Table.HeadCell className="p-3 text-center">ردیف</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">نام کاربری</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">عنوان</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">شماره همراه</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">آخرین ورود</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">IP آدرس</Table.HeadCell>
                <Table.HeadCell className="p-3 text-center">عملیات</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y bg-white dark:bg-gray-800">
                {userAdmin.map((data, index) => (
                  <Table.Row
                    key={index}
                    className="text-center text-xs font-medium text-dominant-500"
                  >
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {data.username}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {data.title}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {data.phoneNumber}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {(data.lastLoginInAdminPanel &&
                        getDate(data.lastLoginInAdminPanel)) ||
                        '-'}
                      <br />
                      {(
                        data.lastLoginInAdminPanel?.split('T')?.[1] || '-'
                      )}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {data.lastIp || '-'}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      <EditeUserModal
                        setEditeUser={setEditeUser}
                        data={data}
                        token={token}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          {isloading?.user && (
            <div className="w-full flex justify-center py-8">
              <BouncingDotsLoader />
            </div>
          )}

          {userAdmin?.length === 0 && !isloading?.user && (
            <div className="w-full flex justify-center py-5 text-sm font-medium text-dominant-500">
              تراکنشی برای شما یافت نشد
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default AdminAndAccessibility;
