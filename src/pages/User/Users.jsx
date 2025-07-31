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
import { Table } from 'flowbite-react';

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
      <div className="flex-1 w-full h-full flex flex-col items-center justify-start px-4     md:px-10 py-6 md:py-10 overflow-auto ">

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
        <div
          dir="rtl"
          className="relative w-full overflow-x-auto sm:rounded-lg mt-8 p-2"
        >
          {usertype ? (
            <Table striped hoverable={false} className="min-w-full table-auto font-IRANYekanX whitespace-nowrap">
              {/* sticky header */}
              <Table.Head className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  تاریخ ایجاد
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  نام شرکت
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  تاریخ تاسیس
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  شناسه اقتصادی
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  شماره ثبت
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  محل ثبت
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  نام کاربری
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2" />
                <Table.HeadCell className="px-4 py-2" />
              </Table.Head>

              <Table.Body className="divide-y divide-gray-200 bg-white">
                {searchActive ? (
                  response && (
                    <Table.Row key="single" className="hover:bg-gray-50">
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        1
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {response.createDate && getDate(response.createDate)}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.legalPerson?.companyName || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {response.legalPerson
                          ? getDate(response.legalPerson.registerDate)
                          : '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.legalPerson?.economicCode || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.legalPerson?.registerNumber || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.legalPerson?.registerPlace || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.username}
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap border-b-2 border-accent"
                        onClick={() =>
                          navigate(`/users/details/${response.username}/${usertype}`)
                        }
                      >
                        جزییات
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap"
                        onClick={() => GetImpersonateToken(response.username)}
                      >
                        ورود به پنل کاربر
                      </Table.Cell>
                    </Table.Row>
                  )
                ) : (
                  response?.data?.map((data, idx) => (
                    <Table.Row key={idx} className="hover:bg-gray-50">
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {idx + 1}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {data.createDate && getDate(data.createDate)}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.legalPerson?.companyName || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {data.legalPerson
                          ? getDate(data.legalPerson.registerDate)
                          : '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.legalPerson?.economicCode || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.legalPerson?.registerNumber || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.legalPerson?.registerPlace || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.username}
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap border-b-2 border-accent"
                        onClick={() =>
                          navigate(`/users/details/${data.username}/${usertype}`)
                        }
                      >
                        جزییات
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap"
                        onClick={() => GetImpersonateToken(data.username)}
                      >
                        ورود به پنل کاربر
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}

                {/* empty state */}
                {!(searchActive ? response : response?.data?.length) && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={10}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      هیچ کاربری یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          ) : (
            <Table striped hoverable className="min-w-full table-auto font-IRANYekanX">
              {/* sticky header */}
              <Table.Head className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  تاریخ ایجاد
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  نام خانوادگی
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  تاریخ تولد
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  محل تولد
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  شماره شناسنامه
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  نام کاربری
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  تلفن همراه
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2" />
                <Table.HeadCell className="px-4 py-2" />
              </Table.Head>

              <Table.Body className="divide-y divide-gray-200 bg-white">
                {searchActive ? (
                  response && (
                    <Table.Row key="single-real" className="hover:bg-gray-50">
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        1
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {response.createDate && getDate(response.createDate)}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {`${response.realPerson?.firstName || ''} ${response.realPerson?.lastName || ''
                          }`.trim() || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {response.realPerson
                          ? getDate(response.realPerson.birthDate)
                          : '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.realPerson?.placeOfBirth || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.realPerson?.shNumber || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {response.username}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {response.phoneNumber || '—'}
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap border-b-2 border-accent"
                        onClick={() =>
                          navigate(`/users/details/${response.username}/${usertype}`)
                        }
                      >
                        جزییات
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap"
                        onClick={() => GetImpersonateToken(response.username)}
                      >
                        ورود به پنل کاربر
                      </Table.Cell>
                    </Table.Row>
                  )
                ) : (
                  response?.data?.map((data, idx) => (
                    <Table.Row key={idx} className="hover:bg-gray-50">
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {idx + 1}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {getDate(data.createDate) || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {`${data.realPerson?.firstName || ''} ${data.realPerson?.lastName || ''
                          }`.trim() || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {data.realPerson
                          ? getDate(data.realPerson.birthDate)
                          : '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.realPerson?.placeOfBirth || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.realPerson?.shNumber || '—'}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 truncate">
                        {data.username}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                        {data.phoneNumber || '—'}
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap border-b-2 border-accent"
                        onClick={() =>
                          navigate(`/users/details/${data.username}/${usertype}`)
                        }
                      >
                        جزییات
                      </Table.Cell>
                      <Table.Cell
                        className="px-4 py-3 text-right text-sm text-accent cursor-pointer hover:text-accent-dark whitespace-nowrap"
                        onClick={() => GetImpersonateToken(data.username)}
                      >
                        ورود به پنل کاربر
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}

                {/* empty state */}
                {!(searchActive ? response : response?.data?.length) && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={10}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      هیچ کاربری یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}

          {isloading && (
            <div className="w-full flex flex-col items-center py-8">
              <BouncingDotsLoader />
            </div>
          )}

          {response?.pagination?.total === 0 && (
            <div className="w-full flex flex-col items-center pt-5 text-caption font-medium text-dominant">
              <p>کاربری یافت نشد</p>
            </div>
          )}
        </div>
        <div className="relative flex justify-center p-8">
          <PaginationComponet
            total={response?.pagination?.total}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>


      </div>
    </div>
  );
}

export default Users;
