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
import { IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { Table } from 'flowbite-react';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-auto  ">

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

        <div dir="rtl" className="bg-white shadow-md rounded-lg w-full p-6 flex flex-wrap items-end gap-6">
          {/* تاریخ‌ها */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2 xl:w-1/4">
            <div className="w-full sm:w-1/2">
              <DatePickerPersian
                value={startDate}
                onchange={setStartDate}
                titleStyle={'text-gray-700'}
                title="از تاریخ"
                className="w-full bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <DatePickerPersian
                value={EndDate}
                onchange={setEndDate}
                titleStyle={'text-gray-700'}
                title="تا تاریخ"
                className="w-full bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* فیلتر طرح */}
          <div className="flex flex-col gap-1 w-full md:w-1/4 lg:w-1/3 xl:w-1/4">
            <label className="text-gray-600 text-sm">طرح</label>
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              height="h-[200px]"
              className="w-full bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {/* اکشن‌ها */}
          <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
            <button
              onClick={HandelClearFilter}
              className="inline-flex md:w-max w-full justify-center items-center px-4 py-2.5 border bg-red-50  border-red-300 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100"
            >
              حذف فیلتر
            </button>

            <DownloadExcelBtn
              Rout="OfflinePaymentManagement/GetAll"
              filename="رسیدها"
              body={{
                userId: userId,
                startDate: startDate?.split('T')?.[0],
                endDate: EndDate?.split('T')?.[0],
                planId: investmentPlanId?.key,
                payerId: payerId?.key,
                pagination: { take: 1000000, skip: 0 }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
            <CreateOredrForUserModal type={1} isOpen={isOpen} setIsOpen={setIsOpen}>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition">
                ایجاد سفارش
              </button>
            </CreateOredrForUserModal>
          </div>
        </div>

        <div dir="rtl" className="relative w-full mx-auto overflow-x-auto mt-8">
          <div className="min-w-max w-full">
            <Table hoverable={false} className="whitespace-nowrap">

              {/* header */}
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  کاربر
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  نام کاربری
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  نام طرح
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  مبلغ
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  واحد
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  تاریخ
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  شناسه واریزی
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  وضعیت
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  فایل
                </Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-3 whitespace-nowrap">
                  عملیات
                </Table.HeadCell>
              </Table.Head>

              {/* body */}
              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((item, idx) => (
                    <Table.Row
                      key={item.id ?? idx}
                      className="border-b border-gray-300 text-center text-xs text-dominant-500"
                    >
                      <Table.Cell className="p-3">{Skip + idx + 1}</Table.Cell>
                      <Table.Cell className="p-3">{item.user?.name}</Table.Cell>
                      <Table.Cell className="p-3">{item.user?.username}</Table.Cell>
                      <Table.Cell className="p-3">{item.planTitle ?? '-'}</Table.Cell>
                      <Table.Cell className="p-3">
                        {item.totalValue
                          ? Number(item.totalValue).toLocaleString('fa-IR')
                          : '-'}
                      </Table.Cell>
                      <Table.Cell className="p-3">{item.totalUnit ?? '-'}</Table.Cell>
                      <Table.Cell className="p-3">
                        {item.createDate && DateFunction2.getDate(item.createDate)}
                      </Table.Cell>
                      <Table.Cell className="p-3">{item.payerId ?? '-'}</Table.Cell>
                      <Table.Cell
                        className={`p-3 font-medium ${GetPayStatus(item.payStatus)?.color
                          }`}
                      >
                        {GetPayStatus(item.payStatus)?.name ?? '-'}
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {item.filePath ? (
                          <a
                            href={`${getBaseUrl()}/${item.filePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-accent-500 hover:underline hover:font-semibold whitespace-nowrap"
                          >
                            مشاهده فایل
                          </a>
                        ) : (
                          <span className="text-xs text-red-400">فایل ندارد</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="p-3 flex justify-center gap-x-2">
                        {item.payStatus === 1 ? (
                          <RecieptUpdateStatusModal
                            id={item.id}
                            isOpen={!!openModals[item.id]}
                            setIsOpen={() => toggleModal(item.id)}
                          />
                        ) : (
                          <span className="text-gray-400">–</span>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={11} className="text-center text-gray-500 py-4">
                      گزارشی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            {/* loading */}
            {isloading && (
              <div className="w-full flex items-center justify-center py-8">
                <BouncingDotsLoader />
              </div>
            )}
          </div>
        </div>
        {/* pagination */}
        <div className="flex justify-center py-6">
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

export default InvestmentCalendar;
