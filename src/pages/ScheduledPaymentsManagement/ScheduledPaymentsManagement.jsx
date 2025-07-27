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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500 rounded-lg  w-full flex justify-between gap-x-3 p-3 flex-wrap items-end ">
          {' '}
          <DatePickerPersian
            value={startDate}
            onchange={setStartDate}
            title="از تاریخ"
            style="w-[200px]"
          />{' '}
          <DatePickerPersian
            value={EndDate}
            onchange={setEndDate}
            title="تا تاریخ"
            style="w-[200px]"
          />{' '}
          <DropDown
            arrey={allPlans}
            select={investmentPlanId}
            setSelect={setInvestmentPlanId}
            height="h-[200px]"
            width="w-[200px]"
          />
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>
          <DownloadExcelBtn
            Rout="OfflinePaymentManagement/GetAll"
            filename=" گزارش واریز سود"
            body={{
              startDate: startDate && startDate?.split('T')[0],
              endDate: EndDate && EndDate?.split('T')[0],
              planId: investmentPlanId?.key,
              pagination: {
                take: 1000000,
                skip: 0
              }
            }}
          />
          <CreateAndEditScheduledPaymentsModal type={1} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full ">
          <div className="relative overflow-x-auto md:rounded-lg mt-8">
            <table className="   w-full  rounded-md">
              <thead className=" shadow-xl bg-white text-xs font-light text-right  ">
                <tr className=" font-normal ">
                  <th className="  font-normal  border-gray-600   p-3 ">ردیف</th>
                  <th className=" font-semibold border-gray-600   p-3  text-center">نام طرح</th>
                  <th className=" font-semibold border-gray-600   p-3  text-center">
                    مبلغ سرمایه گذاری شده{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">
                    تاریخ واریز اعلامی{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">
                    درصد سود محقق شده{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">
                    درصد سود تخمینی{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">مبلغ سود</th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">
                    {' '}
                    تاریخ واریز{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">
                    تعداد سرمایه گذار{' '}
                  </th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">وضعیت</th>
                  <th className=" font-semibold border-gray-600   p-3  text-center ">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {response &&
                  response?.data?.map((data, index) => (
                    <tr key={index} className="  p-10 text-xs text-right text-dominant-500">
                      <td className="p-3  border-b  border-gray-300 text-center ">
                        {Skip + index + 1}{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center">
                        {data?.planTitle}{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {Number(data?.amountRaised)?.toLocaleString()} ریال
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {data?.estimatedPayoutDate &&
                          DateFunction2.getDate(data?.estimatedPayoutDate)}{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {data?.achievedPayoutPercentage
                          ? Number(data?.achievedPayoutPercentage * 100).toFixed()
                          : 0}
                        {' %'}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {data?.estimatedPayoutPercentage
                          ? Number(data?.estimatedPayoutPercentage * 100).toFixed()
                          : 0}
                        {' %'}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {' '}
                        {data?.estimatedTotalPayout
                          ? Number(data?.estimatedTotalPayout).toLocaleString()
                          : 0}{' '}
                        ریال{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {data?.investeeDepositDate
                          ? DateFunction2.getDate(data?.investeeDepositDate)
                          : '--'}{' '}
                      </td>{' '}
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {' '}
                        {data?.totalInvestors
                          ? Number(data?.totalInvestors).toLocaleString()
                          : 0}{' '}
                        نفر{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        {' '}
                        {data?.status &&
                          FindName(scheduledPaymentsManagementStatus, data?.status)?.name}{' '}
                      </td>
                      <td className="p-3 border-b  border-gray-300 text-center ">
                        <Link
                          className="text-sm text-accent-500  border-b border-accent-500 py-1 cursor-pointer"
                          to={`/scheduled_payments_management_details/${data?.id}`}>
                          جزییات
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {isloading && (
              <div className=" w-full justify-center flex items-center">
                <BouncingDotsLoader />
              </div>
            )}
            {response?.pagination?.total == 0 && (
              <span className=" w-full  flex items-center py-5 text-sm justify-center text-center   font-medium text-gray-800">
                گزارشی یافت نشد{' '}
              </span>
            )}
            <div className=" relative flex justify-center py-5">
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
    </div>
  );
}

export default ScheduledPaymentsManagement;
