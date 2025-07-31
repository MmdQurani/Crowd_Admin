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
import { IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { Table } from 'flowbite-react';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-auto ">

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

        <div className="bg-white dark:bg-gray-800 rounded-lg w-full flex flex-wrap gap-6 p-4 items-end shadow-sm">

          <div className="w-full sm:w-1/5 flex justify-start items-end">
            <FindUser
              setUserId={setUserId}
              userId={userId}
              className="w-full"
            />
          </div>

          <DatePickerPersian
            value={startDate}
            onchange={setStartDate}
            titleStyle='text-gray-700'
            title="از تاریخ"
            style="w-[200px]"
            className="rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <DatePickerPersian
            value={endDate}
            onchange={setEndDate}
            titleStyle='text-gray-700'
            title="تا تاریخ"
            style="w-[200px]"
            className="rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="w-[200px] flex flex-col justify-center items-start gap-2">
            <label
              htmlFor="operationType"
              className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
            >
              طرح
            </label>
            <DropDown
              arrey={allPlans}
              select={planId}
              setSelect={setPlanId}
              height="h-[200px]"
              width="w-[200px]"
              className="w-full rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              pagination: { take: 10000000, skip: 0 },
            }}
          />

          <button
            onClick={HandelClearFilter}
            className="w-full md:w-auto py-2.5 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-600 font-semibold text-sm flex justify-center items-center focus:outline-none transition"
          >
            حذف فیلتر
          </button>
        </div>


        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          <div className='w-full min-w-max'>
            <Table className="table-auto font-IRANYekanX rounded-lg w-full whitespace-nowrap">
              <Table.Head className="font-normal w-full bg-white p-5 rounded-lg shadow-lg text-sm text-center text-dominant-500">
                <Table.HeadCell className="rounded-r-lg p-4">ردیف</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">نام</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">نام کاربری</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">نوع کاربری</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">طرح</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">تاریخ پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">زمان پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">مبلغ پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">وضعیت پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">درگاه پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">شناسه پرداخت</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap p-4">کد رهگیری فرابورس</Table.HeadCell>
                <Table.HeadCell className="rounded-l-lg whitespace-nowrap p-4">شناسه پرداخت‌کننده</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y p-10 w-full">
                {response?.data?.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="border-b border-gray-300 text-center p-3 rounded-md font-semibold text-sm text-gray-500"
                  >
                    <Table.Cell className="p-3">{Skip + index + 1}</Table.Cell>
                    <Table.Cell className="p-3 whitespace-nowrap">
                      {item.user?.name}
                    </Table.Cell>
                    <Table.Cell className="p-3 whitespace-nowrap">
                      {item.user?.username}
                    </Table.Cell>
                    <Table.Cell className="p-3 whitespace-nowrap">
                      {(item.user?.type === 1 || item.user?.type === 3) ? 'حقیقی' : 'حقوقی'}
                    </Table.Cell>
                    <Table.Cell className="p-3 text-xs whitespace-nowrap">
                      {item.planTitle}
                    </Table.Cell>
                    <Table.Cell className="p-3">
                      {item.createDate && getDate(item.createDate)}
                    </Table.Cell>
                    <Table.Cell className="p-3">
                      {item.createDate?.split('T')[1]}
                    </Table.Cell>
                    <Table.Cell className="p-3">
                      {item.amount && Number(item.amount).toLocaleString()} ریال
                    </Table.Cell>
                    <Table.Cell className={`p-3 ${fundPayStatus(item.payStatus)?.textColor}`}>
                      {fundPayStatus(item.payStatus)?.name}
                    </Table.Cell>
                    <Table.Cell className="p-3">
                      {
                        GatWay?.find(g => g.id === item.gatewayId)?.title
                      }
                    </Table.Cell>
                    <Table.Cell className="p-3">{item.id}</Table.Cell>
                    <Table.Cell className="p-3">{item.ifbTrackingCode || '_'}</Table.Cell>
                    <Table.Cell className="p-3">{item.payerId}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full justify-center flex items-center py-8">
                <BouncingDotsLoader />
              </div>
            )}

            {response?.pagination?.total === 0 && !isloading && (
              <span className="w-full flex items-center py-5 text-base font-medium justify-center text-gray-500">
                گزارشی یافت نشد
              </span>
            )}
          </div>
        </div>
        <div className="relative flex justify-center py-8">
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

export default IPGPayment;
