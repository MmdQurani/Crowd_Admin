/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import { GetAllGatewayReq, GetAllIPGPaymnetReq } from './Api/IPGPaymentReq';
import { getDate } from 'component/DateFunctions/DateFunctions';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import { payStatusEnum } from 'component/db/PlanStatusEnum';
import FindUser from 'component/AutoComplete/FindUser';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DataContext from 'comon/context/MainContext';

function IPGPayment() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [userId, setUserId] = useState();
  const [GatWay, setGatWay] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [planId, setPlanId] = useState();

  useEffect(() => {
    GetAllIPGPaymnet();
    GetAllGateway();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllIPGPaymnet = async () => {
    setResponse();
    setIsloading(true);
    const res = await GetAllIPGPaymnetReq({
      userId,
      planId: planId?.key,
      startDate: startDate?.split('/')?.[0],
      endDate: endDate?.split('/')?.[0],
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    setIsloading(false);
    setResponse(res);
  };

  console.log(response);

  useMemo(() => {
    GetAllIPGPaymnet();
  }, [userId, currentPage, startDate, endDate, planId]);

  const GetAllGateway = async () => {
    const res = await GetAllGatewayReq();
    setGatWay(res?.data);
  };

  const fundPayStatus = (key) => {
    return payStatusEnum.find((item) => item?.key == key);
  };
  // const ExcelHeader = [
  //   { label: 'نام', key: 'name' },
  //   { label: 'نام کاربری', key: 'username' },
  //   { label: 'نوع کاربری', key: 'type' },
  //   { label: 'طرح', key: 'planTitle' },
  //   { label: 'تاریخ پرداخت', key: 'date' },
  //   { label: 'ساعت پرداخت', key: 'time' },
  //   { label: 'مبلغ پرداخت', key: 'amount' },
  //   { label: 'وضعیت پرداخت', key: 'status' },
  //   { label: 'درگاه پرداخت', key: 'getway' }
  // ];

  // const ExcelData =
  //   excel &&
  //   excel?.length !== 0 &&
  //   excel?.map((item) => ({
  //     ...item,
  //     name: item?.user?.name,
  //     username: item?.user?.username,
  //     type: item?.user?.type == 1 || item?.user?.type == 3 ? 'حقیقی' : 'حقوقی',
  //     date: item?.createDate ? DateFunction2.getDate(item?.createDate) : '--',
  //     time: item?.createDate && item?.createDate?.split('T')[1],
  //     status: item?.payStatus && fundPayStatus(item?.payStatus),
  //     getway: GatWay?.filter((g) => g?.id == item?.gatewayId)?.[0]?.gatewayTypeName
  //   }));

  const HandelClearFilter = () => {
    setStartDate(null);
    setUserId();
    setPlanId();
    setEndDate();
  };

  return (
    <div className="flex flex-row items-start h-auto ">
      <div className="w-1/4 h-full  fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500 rounded-lg  w-full flex  flex-wrap justify-center gap-5 p-3 items-end">
          <div className="w-[20%] justify-start items-end ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>{' '}
          <DatePickerPersian
            value={startDate}
            onchange={setStartDate}
            title="از تاریخ"
            style="w-[200px]"
          />
          <DatePickerPersian
            value={endDate}
            onchange={setEndDate}
            title="تا تاریخ"
            style="w-[200px]"
          />
          <div className="w-[200px] flex flex-col justify-center items-center gap-y-1 ">
            <label htmlFor="operationType" className=" text-start w-[90%] text-xs text-white">
              طرح
            </label>
            <DropDown
              arrey={allPlans}
              select={planId}
              setSelect={setPlanId}
              height="h-[200px]"
              width="w-[200px]"
            />
          </div>
          <DownloadExcelBtn
            Rout="PaymentManagement/GetAll"
            filename="گزارش پرداختی های درگاه"
            body={{
              userId,
              planId: planId?.key,
              startDate: startDate?.split('/')?.[0],
              endDate: endDate?.split('/')?.[0],
              pagination: {
                take: 10000000,
                skip: 0
              }
            }}
          />
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>
        </div>

        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full ">
          <table className="table-auto  font-IRANYekanX rounded-lg w-full ">
            <thead className="font-normal w-full  bg-white p-5 rounded-lg shadow-lg text-sm text-center text-dominant-500">
              <tr className="">
                <th className="  rounded-r-lg p-4">ردیف</th>
                <th className=" whitespace-nowrap p-4">نام </th>
                <th className=" whitespace-nowrap p-4">نام کاربری</th>
                <th className=" whitespace-nowrap p-4">نوع کاربری</th>
                <th className=" whitespace-nowrap p-4">طرح</th>
                <th className=" whitespace-nowrap p-4">تاریخ پرداخت</th>
                <th className=" whitespace-nowrap p-4">زمان پرداخت</th>
                <th className=" whitespace-nowrap p-4">مبلغ پرداخت</th>
                <th className=" whitespace-nowrap p-4">وضعیت پرداخت</th>
                <th className=" whitespace-nowrap p-4">درگاه پرداخت</th>
                <th className=" whitespace-nowrap p-4">شناسه پرداخت</th>
                <th className=" whitespace-nowrap p-4"> کد رهگیری فرابورس</th>
                <th className=" rounded-l-lg  whitespace-nowrap p-4">شناسه پرداخت کننده</th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b  border-gray-300 text-center   p-3 rounded-md font-semibold text-sm items-end text-gray-500  ">
                    <td className="p-3 ">{Skip + index + 1}</td>
                    <td className="p-3 whitespace-nowrap">{item?.user?.name}</td>
                    <td className="p-3 whitespace-nowrap">{item?.user?.username}</td>
                    <td className="p-3 whitespace-nowrap ">
                      {item?.user?.type == 1 || item?.user?.type == 3 ? 'حقیقی' : 'حقوقی'}
                    </td>
                    <td className="p-3 text-xs whitespace-nowrap">{item?.planTitle}</td>

                    <td className="p-3 ">{item?.createDate && getDate(item?.createDate)}</td>
                    <td className="p-3 ">{item?.createDate && item?.createDate?.split('T')[1]}</td>
                    <td className="p-3 ">
                      {item?.amount && Number(item?.amount)?.toLocaleString()} ریال
                    </td>
                    <td className={`p-3 ${fundPayStatus(item?.payStatus)?.textColor}`}>
                      {item?.payStatus && fundPayStatus(item?.payStatus)?.name}
                    </td>
                    <td className="p-3">
                      {' '}
                      {GatWay?.filter((g) => g?.id == item?.gatewayId)[0]?.title}
                    </td>
                    {/* new */}
                    <td className="p-3"> {item?.id}</td>
                    <td className="p-3"> {item?.ifbTrackingCode || '_'}</td>
                    <td className="p-3"> {item?.payerId}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full justify-center flex items-center py-8">
              <BouncingDotsLoader />
            </div>
          )}
          {response?.pagination?.total == 0 && isloading === false && (
            <span className=" w-full flex items-center py-5 text-base font-medium justify-center  text-gray-500">
              گزارشی یافت نشد
            </span>
          )}
          <div className=" relative flex justify-center py-8">
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

export default IPGPayment;
