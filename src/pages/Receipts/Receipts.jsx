/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useContext, useEffect, useState } from 'react';
import DropDown from 'component/DropDown/DropDown';
import RecieptUpdateStatusModal from './component/RecieptUpdateStatusModal';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import { GetAllRecieptReq } from './Api/ReceiptsApi';
import CreateOredrForUserModal from 'pages/UserOrder/component/CreateOredrForUserModal';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DataContext from 'comon/context/MainContext';
import getBaseUrl from 'component/Axios/getBaseUrl';

function InvestmentCalendar() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [startDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const [status, setStatus] = useState();
  const [payerId, setPayerId] = useState();
  const [investmentPlanId, setInvestmentPlanId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [openModals, setOpenModals] = useState({});

  useEffect(() => {
    !isObjectValid() && GetAllReciept();
  }, [startDate, EndDate, status, currentPage, isOpen, openModals, investmentPlanId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isObjectValid = () => {
    return (
      Object.keys(openModals).length > 0 &&
      Object.values(openModals).some((value) => Boolean(value))
    );
  };
  console.log(isObjectValid());

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllReciept = async () => {
    setResponse();
    setIsloading(true);
    const res = await GetAllRecieptReq({
      userId: userId,
      startDate: startDate?.split('T')[0],
      endDate: EndDate?.split('T')[0],
      planId: investmentPlanId?.key,
      payerId: payerId?.key,
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

  const HandelClearFilter = () => {
    setEndDate();
    setStartDate();
    setInvestmentPlanId();
    setUserId();
    setPayerId();
  };
  // const GetAllDataForExcel = async () => {
  //   const res = await GetAllRecieptReq({
  //     userId: userId,
  //     startDate: startDate?.split('T')[0],
  //     endDate: EndDate?.split('T')[0],
  //     planId: investmentPlanId?.key,
  //     payerId: payerId?.key,
  //     pagination: {
  //       take: total,
  //       skip: 0
  //     }
  //   });
  //   if (res) {
  //     setExcel(res?.data);
  //   } else {
  //     setExcel(false);
  //   }
  // };

  const toggleModal = (id) => {
    setOpenModals((prevState) => ({
      [id]: !prevState[id]
    }));
  };

  const GetPayStatus = (status) =>
    [
      { name: 'در انتظار تایید', key: 1, color: 'text-yellow-400' },
      { name: 'تایید شده', key: 2, color: 'text-green-600' },
      { name: 'ردشده', key: 3, color: 'text-red-600' }
    ]?.find((item) => item?.key == status);

  // const ExcelHeader = [
  //   { label: 'کاربر', key: 'name' },
  //   { label: 'نام کاربری', key: 'username' },
  //   { label: 'نام طرح', key: 'planTitle' },
  //   { label: 'مبلغ', key: 'totalValue' },
  //   { label: 'واحد', key: 'totalUnit' },
  //   { label: 'تاریخ', key: 'date' },
  //   { label: 'شناسه واریزی', key: 'payerId' },
  //   { label: 'وضعیت', key: 'status' }
  // ];

  // const ExcelData =
  //   excel &&
  //   excel?.length !== 0 &&
  //   excel?.map((item, index) => ({
  //     ...item,
  //     name: item?.user?.name,
  //     username: item?.user?.username,
  //     date: item?.createDate && DateFunction2.getDate(item?.createDate),
  //     status: item?.payStatus && GetPayStatus(item?.payStatus)
  //   }));

  return (
    <div className="flex flex-row items-start h-auto  ">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500   rounded-lg  w-full flex justify-between  flex-wrap gap-x-5 p-3 items-end">
          <div className="w-[30%] flex justify-between items-end gap-x-5">
            {' '}
            <DatePickerPersian value={startDate} onchange={setStartDate} title="از تاریخ" />
            <DatePickerPersian value={EndDate} onchange={setEndDate} title="تا تاریخ" />
          </div>
          <div className="w-[200px] flex flex-col gap-y-1 items-start ">
            <label className="   text-white  text-sm   text-start">طرح </label>
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              height="h-[200px]"
            />
          </div>
          <div className="w-[50%] flex gap-x-2 justify-end items-end ">
            <button
              onClick={HandelClearFilter}
              className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
              حذف فیلتر{' '}
            </button>
            <DownloadExcelBtn
              Rout="OfflinePaymentManagement/GetAll"
              filename=" رسیدها"
              body={{
                userId: userId,
                startDate: startDate?.split('T')?.[0],
                endDate: EndDate?.split('T')?.[0],
                planId: investmentPlanId?.key,
                payerId: payerId?.key,
                pagination: {
                  take: 1000000,
                  skip: 0
                }
              }}
            />
            <CreateOredrForUserModal type={1} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>{' '}
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2  w-full">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm  text-right shadow-xl rounded-md p-5 text-dominant-500">
              <tr className=" text-center ">
                <th className=" whitespace-nowrap p-3">ردیف</th>
                <th className=" whitespace-nowrap p-3"> کاربر</th>
                <th className=" whitespace-nowrap p-3"> نام کاربری </th>
                <th className=" whitespace-nowrap p-3">نام طرح </th>
                <th className=" whitespace-nowrap p-3">مبلغ </th>
                <th className=" whitespace-nowrap p-3">واحد </th>
                <th className=" whitespace-nowrap p-3">تاریخ </th>
                <th className=" whitespace-nowrap p-3">شناسه واریزی </th>
                <th className=" whitespace-nowrap p-3">وضعیت </th>
                <th className=" whitespace-nowrap p-3">فایل </th>
                <th className=" whitespace-nowrap p-3">عملیات </th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b text-center  border-gray-300 rounded-md  text-xs items-end text-dominant-500  ">
                    <td className="p-3 ">{Skip + index + 1}</td>
                    <td className="p-3 ">{item?.user?.name}</td>
                    <td className="p-3 ">{item?.user?.username}</td>
                    <td className="p-3 ">{item?.planTitle ? item?.planTitle : '-'}</td>
                    <td className="p-3 ">
                      {item?.totalValue && Number(item?.totalValue).toLocaleString()}
                    </td>
                    <td className="p-3 ">{item?.totalUnit}</td>
                    <td className="p-3 ">
                      {item?.createDate && DateFunction2.getDate(item?.createDate)}
                    </td>
                    <td className="p-3 ">{item?.payerId}</td>
                    <td className={`p-3 ${GetPayStatus(item?.payStatus)?.color} `}>
                      {item?.payStatus && GetPayStatus(item?.payStatus)?.name}
                    </td>
                    <td className="p-3 ">
                      {item?.filePath ? (
                        <a
                          href={getBaseUrl() + '/' + item?.filePath}
                          className="text-xs  text-accent-500 hover:underline underline-offset-8 hover:font-semibold font-normal whitespace-nowrap  cursor-pointer "
                          target="_blank"
                          rel="noreferrer">
                          مشاهده فایل{' '}
                        </a>
                      ) : (
                        'فایل بارگذاری نشده'
                      )}
                    </td>

                    <td className="p-3 gap-x-2 flex justify-center ">
                      {item?.payStatus == 1 ? (
                        <RecieptUpdateStatusModal
                          id={item?.id}
                          isOpen={!!openModals[item.id]}
                          setIsOpen={() => toggleModal(item.id)}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full p-3 flex items-center justify-center">
              {' '}
              <BouncingDotsLoader />
            </div>
          )}
          {response?.pagination?.total == 0 && isloading === false && (
            <span className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-gray-600">
              گزارشی یافت نشد
            </span>
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

export default InvestmentCalendar;
