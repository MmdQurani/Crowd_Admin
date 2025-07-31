/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import DropDown from 'component/DropDown/DropDown';
import Sidebar from 'component/layout/sidebar/SideBar';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import PaginationComponet from 'component/pagination/paginationComponent';
import { Table } from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { toast } from 'react-toastify';

function ConsultingRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState(false);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [status, setStatus] = useState();
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    !selectedId && GetAllConsultingRequest();
    !selectedId && setCurrentPage(1);
  }, [selectedId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);
  const headers = [
    { name: 'ردیف', key: 'index' },
    { name: 'نام و نام خانوادگی', key: 'companyName' },
    { name: 'تاریخ درخواست ', key: 'legalEntityType' },
    { name: 'شماره همراه ', key: 'requiredCapital' },
    { name: 'وضعیت ', key: 'offeredGuarantees' },
    { name: 'عملیات ', key: 'offeredGuarantees' }
  ];

  const GetAllConsultingRequest = async () => {
    setIsloading((prev) => ({ ...prev, main: true }));
    await Axios.post('/ConsultationManagement/GetAll', {
      dateFilter: (date && date?.split('T')?.[0]) || null,
      pagination: {
        take: 10,
        skip: Skip
      }
    })
      .then((res) => setResponse(res))
      .catch(() => setResponse(false))
      .finally(() => setIsloading((prev) => ({ ...prev, main: false })));
  };
  const UpdateRequestStaus = async () => {
    setIsloading((prev) => ({ ...prev, update: true }));

    setIsloading(true);
    await Axios.patch(
      `/ConsultationManagement/UpdateStatus?id=${selectedId}&status=${status?.key}`,
      {}
    )
      .then(() => toast.success('ثبت موفق'))
      .catch(() => toast.success('ثبت ناموفق لطفا زمانی دیگر تلاش کنید '))
      .finally(() => {
        setIsloading((prev) => ({ ...prev, update: false }));
        setSelectedId();
        setStatus();
      });
  };

  useMemo(() => {
    GetAllConsultingRequest();
  }, [date, currentPage]);

  const StatusEnum = [
    { name: 'در انتظار', key: 1, color: 'text-yellow-300' },
    { name: 'پاسخ داده شده', key: 3, color: 'text-green-500' },
    { name: 'پاسخ داده نشده', key: 4, color: 'text-red-500' },
    { name: ' نیاز به مشاوره بیشتر', key: 5, color: 'text-yellow-500' }
  ];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ItemsFinder = (array, id, key) => array?.find((item) => item?.[key] == id);
  return (
    <div className="flex flex-row items-start h-auto  w-full ">

      {/* سایدبار */}
      <div className="min-w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div className="w-full flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="w-full flex flex-wrap items-end justify-start gap-6">

            {/* تاریخ */}
            <div className="w-full sm:w-[200px] flex flex-col gap-1">
              <DatePickerPersian
                value={date}
                onchange={setDate}
                title="تاریخ"
                titleStyle="block mb-1 text-sm text-gray-700 dark:text-gray-300"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* حذف فیلتر */}
            <button
              onClick={() => setDate()}
              className="w-full sm:w-auto px-6 h-10 bg-red-50 text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium focus:outline-none"
            >
              حذف فیلتر
            </button>

          </div>
        </div>



        <div className="relative overflow-x-auto md:rounded-lg p-2 w-full">
          <div className='w-full min-w-max'>
            <Table className="table-auto font-IRANYekanX rounded-lg w-full whitespace-nowrap">
              <Table.Head className="bg-secondary text-base text-right text-dominant-500">
                {headers.map((item, index) => (
                  <Table.HeadCell
                    key={index}
                    className="p-3 text-center text-xs whitespace-nowrap"
                  >
                    {item.name}
                  </Table.HeadCell>
                ))}
              </Table.Head>

              <Table.Body className="divide-y bg-white dark:bg-gray-800">
                {response?.data?.map((item, index) => (
                  <Table.Row
                    key={item.id || index}
                    className="text-center text-xs font-medium text-dominant-500"
                  >
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {Skip + index + 1}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {item.fullName || 'نامشخص'}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {(item.date && DateFunction2.getDate(item.date)) || 'نامشخص'}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {item.phoneNumber || 'نامشخص'}
                    </Table.Cell>
                    <Table.Cell
                      className={`p-3 border-b border-gray-300 ${ItemsFinder(StatusEnum, item.status, 'key')?.color
                        }`}
                    >
                      {(item.status &&
                        ItemsFinder(StatusEnum, item.status, 'key')?.name) ||
                        'نامشخص'}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-b border-gray-300">
                      {selectedId === item.id ? (
                        <div className="flex flex-col items-center gap-y-3">
                          <DropDown
                            width="w-[200px]"
                            arrey={StatusEnum}
                            select={status}
                            setSelect={setStatus}
                            height="h-[100px]"
                          />
                          <div className="flex w-full justify-between items-center gap-x-3">
                            <button
                              onClick={UpdateRequestStaus}
                              className="w-1/2 h-7 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 text-sm font-bold rounded-md"
                            >
                              ثبت
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId();
                                setStatus();
                              }}
                              className="w-1/2 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold rounded-md"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="w-4/5 h-7 flex items-center justify-center text-green-700 border border-green-700 text-xs font-medium rounded-md"
                        >
                          تغییر وضعیت
                        </button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {isloading?.main && (
              <div className="w-full flex justify-center py-8">
                <BouncingDotsLoader />
              </div>
            )}

            {(!response || response?.data?.length === 0) && !isloading?.main && (
              <div className="w-full flex justify-center py-5 text-sm font-medium text-dominant-500">
                گزارشی یافت نشد
              </div>
            )}
          </div>
        </div>
        <div className="relative flex justify-center py-5">
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

export default ConsultingRequests;
