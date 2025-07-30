/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import { ScheduledPaymentsManagementReq } from './Api/ScheduledPaymentsReq';
import DatePickerPersian from 'component/Datepicker/datepicker';
import { Link } from 'react-router-dom';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import { scheduledPaymentsManagementStatus } from 'component/db/PlanStatusEnum';
import CreateAndEditScheduledPaymentsModal from './component/CreateAndEditScheduledPaymentsModal';
import DropDown from 'component/DropDown/DropDown';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DataContext from 'comon/context/MainContext';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';
import { Table } from 'flowbite-react';

function ScheduledPaymentsManagement() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [startDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const [investmentPlanId, setInvestmentPlanId] = useState();

  useEffect(() => {
    ScheduledPaymentsManagement();
  }, [startDate, EndDate, currentPage, isOpen, investmentPlanId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, EndDate, isOpen, investmentPlanId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const ScheduledPaymentsManagement = async () => {
    const res = await ScheduledPaymentsManagementReq({
      startDate: startDate && startDate?.split('T')[0],
      endDate: EndDate && EndDate?.split('T')[0],
      planId: investmentPlanId?.key,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    setIsloading(false);
    setResponse(res);
  };

  const HandelClearFilter = () => {
    setEndDate();
    setStartDate();
    setInvestmentPlanId();
  };

  const FindName = (arr, id) => arr?.find((item) => item?.key == id);

  // const GetAllDataForExcel = async () => {
  //   const res = await ScheduledPaymentsManagementReq({
  //     startDate: startDate && startDate?.split('T')[0],
  //     endDate: EndDate && EndDate?.split('T')[0],
  //     planId: investmentPlanId?.key,
  //     pagination: {
  //       take: total,
  //       skip: 0
  //     }
  //   });
  //   setIsloading(false);
  //   setExcel(res?.data);
  // };

  // const ExcelHeader = [
  //   { label: 'نام طرح', key: 'planTitle' },
  //   { label: 'مبلغ سرمایه گذاری شده', key: 'amountRaised' },
  //   { label: 'تاریخ واریز اعلامی', key: 'date' },
  //   { label: 'درصد سود محقق شده', key: 'achievedPercentage' },
  //   { label: 'درصد سود تخمینی', key: 'estimatedPercentage' },
  //   { label: 'مبلغ سود', key: 'estimatedTotalPayout' },
  //   { label: 'تاریخ واریز', key: 'DepositDate' },
  //   { label: 'تعداد سرمایه گذار', key: 'totalInvestors' },
  //   { label: 'وضعیت', key: 'OrderStatus' }
  // ];
  // const ExcelData =
  //   excel &&
  //   excel?.length !== 0 &&
  //   excel?.map((item, index) => ({
  //     ...item,
  //     date: item?.estimatedPayoutDate && DateFunction2.getDate(item?.estimatedPayoutDate),
  //     achievedPercentage: item?.achievedPayoutPercentage
  //       ? Number(item?.achievedPayoutPercentage * 100).toFixed()
  //       : 0,
  //     estimatedPercentage: item?.estimatedPayoutPercentage
  //       ? Number(item?.estimatedPayoutPercentage * 100).toFixed()
  //       : 0,
  //     DepositDate: item?.investeeDepositDate
  //       ? DateFunction2.getDate(item?.investeeDepositDate)
  //       : '--',
  //     OrderStatus: item?.status && FindName(scheduledPaymentsManagementStatus, item?.status)?.name
  //   }));

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

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div
          dir="rtl"
          className=" bg-white border border-gray-200 shadow-md rounded-lg min-w-full sm:min-w-[80%] p-4 flex flex-wrap items-end gap-4
  "
        >
          {/* از تاریخ */}
          <div className="w-full md:w-[200px]">
            <DatePickerPersian
              value={startDate}
              onchange={setStartDate}
              title="از تاریخ"
              className="w-full"
            />
          </div>

          {/* تا تاریخ */}
          <div className="w-full md:w-[200px]">
            <DatePickerPersian
              value={EndDate}
              onchange={setEndDate}
              title="تا تاریخ"
              className="w-full"
            />
          </div>

          {/* طرح سرمایه‌گذاری */}
          <div className="w-full md:w-[200px]">
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              className="w-full"
              height="h-[200px]"
            />
          </div>

          {/* پاک کردن فیلتر */}
          <button
            onClick={HandelClearFilter}
            className=" w-full md:w-auto bg-red-50 text-red-600 hover:bg-red-200 border border-red-300 rounded-md px-4 py-2 text-sm font-medium transition">
            حذف فیلتر
          </button>

          {/* دانلود اکسل */}
          <DownloadExcelBtn
            Rout="OfflinePaymentManagement/GetAll"
            filename="گزارش واریز سود"
            body={{
              startDate: startDate?.split("T")[0],
              endDate: EndDate?.split("T")[0],
              planId: investmentPlanId?.key,
              pagination: { take: 1000000, skip: 0 },
            }}
            className=" w-full md:w-auto bg-accent-500 text-white hover:bg-accent-600 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition"/>

          {/* ایجاد پرداخت زمان‌بندی‌شده */}
          <div className="w-full sm:w-auto">
            <CreateAndEditScheduledPaymentsModal
              type={1}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              triggerClassName=" w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition"
              triggerText="افزودن پرداخت جدید"
            />
          </div>
        </div>



        <div
          dir="rtl"
          className="relative w-full md:w-[80%] mx-auto overflow-x-auto mt-8"
        >
          <div className="w-max">
            <Table hoverable={false} className="whitespace-nowrap">
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  نام طرح
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  مبلغ سرمایه‌گذاری‌شده
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تاریخ واریز اعلامی
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  درصد سود محقق‌شده
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  درصد سود تخمینی
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  مبلغ سود
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تاریخ واریز
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تعداد سرمایه‌گذار
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  وضعیت
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  عملیات
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((data, idx) => (
                    <Table.Row key={data.id ?? idx} className="hover:bg-gray-50">
                      <Table.Cell className="text-right">
                        {Skip + idx + 1}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.planTitle}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {Number(data.amountRaised).toLocaleString()} ریال
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.estimatedPayoutDate
                          ? DateFunction2.getDate(data.estimatedPayoutDate)
                          : "--"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.achievedPayoutPercentage
                          ? `${(data.achievedPayoutPercentage * 100).toFixed()} %`
                          : "0 %"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.estimatedPayoutPercentage
                          ? `${(data.estimatedPayoutPercentage * 100).toFixed()} %`
                          : "0 %"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.estimatedTotalPayout
                          ? `${Number(data.estimatedTotalPayout).toLocaleString()} ریال`
                          : "0 ریال"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.investeeDepositDate
                          ? DateFunction2.getDate(data.investeeDepositDate)
                          : "--"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.totalInvestors
                          ? `${Number(data.totalInvestors).toLocaleString()} نفر`
                          : "0 نفر"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {data.status
                          ? FindName(
                            scheduledPaymentsManagementStatus,
                            data.status
                          )?.name
                          : "--"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <Link
                          to={`/scheduled_payments_management_details/${data.id}`}
                          className="text-accent-500 hover:underline"
                        >
                          جزییات
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell
                      colSpan={11}
                      className="text-center text-gray-500 py-4"
                    >
                      موردی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex flex-col items-center justify-center h-40">
                <BouncingDotsLoader />
              </div>
            )}

            {response?.pagination?.total === 0 && (
              <span className="w-full flex items-center justify-center py-5 text-caption font-medium text-dominant">
                موردی یافت نشد
              </span>
            )}
          </div>

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

export default ScheduledPaymentsManagement;
