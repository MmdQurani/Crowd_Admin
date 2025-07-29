/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { GetAllUsersReq, GetImpersonateTokenReq, GetUserByNationalIdReq } from './Api/UserReq';
import PaginationComponet from 'component/pagination/paginationComponent';
import { getDate } from 'component/DateFunctions/DateFunctions';
import ImpersonateModal from 'component/modal/ImpersonateModal';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import CreateUserModal from './component/CreateUserModal';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import { toast } from 'react-toastify';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

function Users() {
  const navigate = useNavigate();

  //user type => real : false , legal : true
  const [usertype, setUsertype] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [search, setSearch] = useState();
  const [searchActive, setsearchActive] = useState(false);

  const ImpersonatLink = process.env.REACT_APP_IMPERSONATE;

  useEffect(() => {
    !isOpen && GetUsers();
  }, [currentPage, usertype, isOpen, search]);

  useEffect(() => {
    setResponse();
    setCurrentPage(1);
  }, [usertype]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const ApiHandler = usertype
    ? 'AccountsManagement/GetAllLegalUsers'
    : 'AccountsManagement/GetAllRealUsers';

  const GetUsers = async () => {
    setsearchActive(false);
    setIsloading(true);
    const Skip = currentPage == 1 ? 0 : 10 * (currentPage - 1);
    const res = await GetAllUsersReq(ApiHandler, {
      usernameQuery: search,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    if (res) {
      setResponse(res);
    } else {
      setResponse(false);
    }
    setIsloading(false);
  };

  const GetImpersonateToken = async (username) => {
    const res = await GetImpersonateTokenReq({ username });
    if (res?.token) {
      window.open(ImpersonatLink + `impersonate?token=${res?.token}`);
    } else {
      toast.error('خطلا! لطفا در لحطاتی دیگر تلاش کنید ');
    }
  };

  console.log('users', response);

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

      {/* محتوای صفحه */}
      <div className="flex-1 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button
          className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        {/* فیلتر ها */}
        <div className="w-full bg-white rounded-lg p-6 shadow-lg overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Search Input */}
            <div className="col-span-1 md:col-span-5 flex flex-col justify-end">
              <label htmlFor="search" className="block mb-2 text-gray-700 text-lg">
                جست‌وجو
              </label>
              <input
                id="search"
                type="text"
                className="
          w-full px-4 py-2
          bg-gray-50 border border-gray-200
          rounded-md text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          transition
        "
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="نام کاربر را وارد کنید"
              />
            </div>

            {/* Filters + Actions */}
            <div className="col-span-1 md:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6">

              {/* User Type Toggles + Export */}
              <div className="col-span-1 sm:col-span-12 flex flex-wrap items-center justify-between gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2"
                    checked={!usertype}
                    onClick={() => setUsertype(!usertype)}
                  />
                  <span className="mr-2 text-gray-700">کاربر حقیقی</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2"
                    checked={usertype}
                    onClick={() => setUsertype(!usertype)}
                  />
                  <span className="mr-2 text-gray-700">کاربر حقوقی</span>
                </label>

                <DownloadExcelBtn // دانلود فایل اکسل
                  Rout={ApiHandler}
                  filename="گزارش کاربران"
                  body={{
                    usernameQuery: search,
                    pagination: { take: 10000000, skip: 0 }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-span-1 sm:col-span-12 flex md:flex-nowrap flex-wrap md:flex-row flex-col items-center gap-4">
                <ImpersonateModal /> {/* ورود به حساب کاربری */}
                <CreateUserModal isOpen={isOpen} setIsOpen={setIsOpen} /> {/* ایجاد کاربر */}
              </div>

            </div>
            
          </div>
        </div>


        {/* جدول */}
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          {usertype ? (
            <table className="table-auto bordered font-IRANYekanX w-full">
              <thead className="font-normal  text-base text-right text-dominant-500 bg-white shadow-xl">
                <tr className="">
                  <th className="  bg-secondary p-4">ردیف</th>
                  <th className="  bg-secondary p-4">تاریخ ایجاد</th>
                  <th className="  bg-secondary p-4">نام شرکت </th>
                  <th className="  bg-secondary p-4"> تاریخ تاسیس</th>
                  <th className="  bg-secondary p-4">شناسه اقتصادی</th>
                  <th className="  bg-secondary p-4">شماره ثبت </th>
                  <th className="  bg-secondary p-4">محل ثبت </th>
                  <th className="  bg-secondary p-4">نام کاربری </th>
                  <th className="  bg-secondary p-4"></th>
                  <th className="  bg-secondary p-4"></th>
                </tr>
              </thead>
              {searchActive ? (
                <tbody>
                  {response && (
                    <tr
                      key={1}
                      className=" border-t-2 p-10   rounded-md font-semibold text-caption text-right text-dominant-500">
                      <td className="p-3 ">1</td>
                      <td className="p-3 ">
                        {response?.createDate && getDate(response?.createDate)}
                      </td>
                      <td className="p-3 ">{response?.legalPerson?.companyName}</td>
                      <td className="p-3 ">
                        {response?.legalPerson
                          ? getDate(response?.legalPerson?.registerDate)
                          : '----'}
                      </td>
                      <td className="p-3 ">{response?.legalPerson?.economicCode}</td>
                      <td className="p-3 ">{response?.legalPerson?.registerNumber}</td>
                      <td className="p-3 ">{response?.legalPerson?.registerPlace}</td>
                      <td className="p-3 ">{response?.username}</td>
                      <td
                        className="p-3 hover:text-accent cursor-pointer border-b-2 border-accent"
                        onClick={() =>
                          navigate(`/users/details/${response?.username}/${usertype}`)
                        }>
                        جزییات
                      </td>
                      <td
                        className="p-3 text-accent cursor-pointer "
                        onClick={() => GetImpersonateToken(response?.username)}>
                        ورود به پنل کاربر{' '}
                      </td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  {response &&
                    response?.data?.map((data, index) => (
                      <tr
                        key={index}
                        className=" border-b-2 border-gray-300   rounded-md font-semibold text-caption text-right text-dominant-500">
                        <td className="p-5 ">{index + 1}</td>
                        <td className="p-5 ">{data?.createDate && getDate(data?.createDate)}</td>
                        <td className="p-5 ">{data?.legalPerson?.companyName}</td>
                        <td className="p-5 ">
                          {data?.legalPerson ? getDate(data?.legalPerson?.registerDate) : '----'}
                        </td>
                        <td className="p-5 ">{data?.legalPerson?.economicCode}</td>
                        <td className="p-5 ">{data?.legalPerson?.registerNumber}</td>
                        <td className="p-5 ">{data?.legalPerson?.registerPlace}</td>
                        <td className="p-5 ">{data?.username}</td>
                        <td
                          className="p-5 hover:text-accent cursor-pointer border-b-2 border-accent "
                          onClick={() => navigate(`/users/details/${data?.username}/${usertype}`)}>
                          جزییات
                        </td>
                        <td
                          className="p-5 text-accent cursor-pointer "
                          onClick={() => GetImpersonateToken(data?.username)}>
                          ورود به پنل کاربر{' '}
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          ) : (
            <table className="table-auto bordered font-IRANYekanX w-full ">
              <thead className="w-full shadow-xl font-normal bg-white  text-base text-right text-dominant-500">
                <tr className=" bg-white">
                  <th className="p-4">ردیف</th>
                  <th className="p-4">تاریخ ایجاد</th>
                  <th className="p-4">نام خانوادگی</th>
                  <th className="p-4"> تاریخ تولد</th>
                  <th className="p-4"> محل تولد</th>
                  <th className="p-4">شماره شناسنامه</th>
                  <th className="p-4">نام کاربری</th>
                  <th className="p-4">تلفن همراه </th>
                  <th className="p-4"></th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              {searchActive ? (
                <tbody>
                  {response && (
                    <tr
                      key={1}
                      className=" rounded-md font-semibold text-caption text-right text-dominant-500">
                      <td className="p-5 ">1</td>
                      <td className="p-5 ">
                        {response?.createDate && getDate(response?.createDate)}
                      </td>
                      <td className="p-5 ">
                        {/* {response?.realPerson?.firstName +
                          '' +
                          response?.realPerson?.lastName} */}
                      </td>
                      <td className="p-5 ">
                        {response?.realPerson ? getDate(response?.realPerson?.birthDate) : '----'}
                      </td>
                      <td className="p-5 ">{response?.realPerson?.placeOfBirth}</td>
                      <td className="p-5 ">{response?.realPerson?.shNumber}</td>
                      <td className="p-5 ">{response?.username}</td>
                      <td className="p-5 ">{response?.phoneNumber}</td>
                      <td
                        className="p-5 hover:text-accent cursor-pointer border-b-2 border-accent "
                        onClick={() =>
                          navigate(`/users/details/${response?.username}/${usertype}`)
                        }>
                        جزییات
                      </td>
                      <td
                        className="p-5 text-accent cursor-pointer "
                        onClick={() => GetImpersonateToken(response?.username)}>
                        ورود به پنل کاربر{' '}
                      </td>{' '}
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  {response &&
                    response?.data?.map((data, index) => (
                      <tr
                        key={index}
                        className=" border-b-2 border-gray-300  rounded-md font-semibold text-caption text-right text-dominant-500">
                        <td className="p-5 ">{index + 1}</td>
                        <td className="p-5 ">{getDate(data?.createDate)}</td>
                        <td className="p-5 ">
                          {data?.realPerson?.firstName + '  ' + data?.realPerson?.lastName}
                        </td>
                        <td className="p-5 ">
                          {data?.realPerson ? getDate(data?.realPerson?.birthDate) : '----'}
                        </td>
                        <td className="p-5 ">{data?.realPerson?.placeOfBirth}</td>
                        <td className="p-5 ">{data?.realPerson?.shNumber}</td>
                        <td className="p-5 ">{data?.username}</td>
                        <td className="p-5 ">{data?.phoneNumber}</td>

                        <td
                          className="p-5 hover:text-accent cursor-pointer border-b-2 border-accent "
                          onClick={() => navigate(`/users/details/${data?.username}/${usertype}`)}>
                          جزییات
                        </td>
                        <td
                          className="p-5 text-accent cursor-pointer "
                          onClick={() => GetImpersonateToken(data?.username)}>
                          ورود به پنل کاربر{' '}
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          )}
          {isloading && (
            <div className=" w-full flex-col flex items-center">
              <BouncingDotsLoader />
            </div>
          )}
          {(response?.pagination?.total == 0 || response?.length == 0) && (
            <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
              <p className="">کاربری یافت نشد </p>
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

export default Users;
