/* eslint-disable no-unused-vars */
import Axios from 'component/Axios/Axios';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import Sidebar from 'component/layout/sidebar/SideBar';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useEffect, useMemo, useState } from 'react';
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

  const ItemsFinder = (array, id, key) => array?.find((item) => item?.[key] == id);
  return (
    <div className="flex flex-row items-start h-auto  w-full ">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">

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


        <div className="relative overflow-x-auto md:rounded-lg mt-8  w-full ">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm  text-right shadow-xl rounded-md  text-dominant-500">
              <tr className=" text-center">
                {headers.map((item, index) => (
                  <th key={index} className=" p-4 text-xs  whitespace-nowrap">
                    {item?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="p-5 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b text-center  border-gray-300 rounded-md font-semibold text-xs items-end text-dominant-500  ">
                    <td className="p-2 font-normal h-[42px] ">{Skip + index + 1}</td>
                    <td className="p-2 font-normal h-[42px] ">{item?.fullName || 'نامشخص'}</td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.date && DateFunction2.getDate(item?.date)) || 'نامشخص'}
                    </td>{' '}
                    <td className="p-2 font-normal h-[42px] ">{item?.phoneNumber || 'نامشخص'}</td>
                    <td
                      className={`p-2 ${ItemsFinder(StatusEnum, item?.status, 'key')?.color
                        } font-normal h-[42px] `}>
                      {(item?.status && ItemsFinder(StatusEnum, item?.status, 'key')?.name) ||
                        'نامشخص'}
                    </td>
                    <td className="p-2 w-[200px] font-normal h-[42px] ">
                      {selectedId == item?.id ? (
                        <div className="w-full flex h-auto flex-col gap-y-3 items-center justify-center">
                          <DropDown
                            width="w-[200px]"
                            arrey={StatusEnum}
                            select={status}
                            setSelect={setStatus}
                            height="h-[100px]"
                          />
                          <div className="w-full gap-x-3 flex justify-between items-center">
                            {' '}
                            <button
                              onClick={UpdateRequestStaus}
                              className="w-[50%] rounded-md h-[28px] items-center flex justify-center text-center text-green-700 border border-green-600  text-sm  font-bold">
                              ثبت{' '}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId();
                                setStatus();
                              }}
                              className="w-[50%] rounded-md h-[28px] items-center flex justify-center text-center text-gray-500 border border-gray-500  text-sm  font-bold">
                              انصراف{' '}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="w-[80%] rounded-md h-[28px] items-center flex justify-center text-center text-green-700  text-xs font-medium border border-green-700  ">
                          تغییر وضعیت{' '}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading?.main && (
            <div className=" w-full justify-center py-3 flex items-center">
              <BouncingDotsLoader />
            </div>
          )}
          {(!response || response?.data?.length == 0) && (
            <span className=" w-full  flex items-center justify-center  py-5 text-base  font-medium text-gray-600">
              گزارشی یافت نشد
            </span>
          )}
          <div className=" relative flex justify-center py-5">
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

export default ConsultingRequests;
