/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import DropDown from 'component/DropDown/DropDown';
import InvestmentCalendarModal from './component/InvestmentCalendarModal';
import {
  DeleteInverstmentCalendarReq,
  GetAllInverstmentCalendarReq
} from './Api/InverstmentCalendar';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DataContext from 'comon/context/MainContext';
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
  const [investmentPlanId, setInvestmentPlanId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [openModals, setOpenModals] = useState({});

  useEffect(() => {
    GetAllInverstmentCalendar();
  }, [startDate, EndDate, currentPage, isOpen, openModals, investmentPlanId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllInverstmentCalendar = async () => {
    setResponse();
    setIsloading(true);
    const res = await GetAllInverstmentCalendarReq({
      startDate: startDate && startDate?.split('T')[0],
      endDate: EndDate && EndDate?.split('T')[0],
      planId: investmentPlanId?.key,
      // type: type?.key,
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
  console.log(response);

  const DeleteInverstmentCalendar = async (id) => {
    const res = await DeleteInverstmentCalendarReq({
      planTimelineId: id
    });
    if (res) {
      GetAllInverstmentCalendar();
      toast.success('ثبت شد');
    } else {
      toast.error('ثبت ناموفق');
    }
  };

  const toggleModal = (id) => {
    setOpenModals((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const HandelClearFilter = () => {
    setEndDate();
    setStartDate();
    setInvestmentPlanId();
  };

  console.log('open modal', openModals);

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

        <div className="bg-white dark:bg-gray-800 rounded-lg w-full flex flex-wrap justify-start gap-5 p-4 items-end shadow-sm">

          <div className="w-full md:w-2/5 flex flex-wrap md:flex-nowrap justify-between gap-4">
            <DatePickerPersian
              value={startDate}
              onchange={setStartDate}
              titleStyle='text-gray-700'
              title="از تاریخ"
              className="w-full md:w-[200px] rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <DatePickerPersian
              value={EndDate}
              onchange={setEndDate}
              titleStyle='text-gray-700'
              title="تا تاریخ"
              className="w-full md:w-[200px] rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full md:w-[200px] flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              طرح
            </label>
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              height="h-[200px]"
              className="w-full rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <DownloadExcelBtn
            Rout="TimelineManagement/GetAll"
            filename="تقویم های سرمایه گذاری"
            body={{
              startDate: startDate?.split('T')[0],
              endDate: EndDate?.split('T')[0],
              planId: investmentPlanId?.key,
              pagination: { take: 1000000, skip: 0 }
            }}
            className="w-full md:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={HandelClearFilter}
            className="w-full md:w-auto py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-600 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            حذف فیلتر
          </button>

          <InvestmentCalendarModal
            type={1}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>

        <div dir="rtl" className="relative w-full sm:w-[100%] mx-auto overflow-x-auto mt-8 p-2">
          <div className="min-w-max w-full">
            <Table hoverable={false} className="whitespace-nowrap min-w-full">
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-right py-4 text-gray-700">ردیف</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">عنوان</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">عنوان طرح</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">تاریخ</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">وضعیت</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700"></Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700"></Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((item, index) => (
                    <Table.Row key={item.id ?? index}>
                      <Table.Cell className="text-right">{Skip + index + 1}</Table.Cell>
                      <Table.Cell className="text-right">{item?.title}</Table.Cell>
                      <Table.Cell className="text-right">
                        {item?.planTitle ? item.planTitle : '-'}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item?.date && DateFunction2.getDate(item.date)}
                      </Table.Cell>
                      <Table.Cell
                        className={`text-right ${item?.status ? 'text-green-500' : 'text-red-600'
                          }`}
                      >
                        {item?.status ? 'تایید شده' : 'رد شده'}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <InvestmentCalendarModal
                          data={item}
                          type={2}
                          isOpen={!!openModals[item.id]}
                          setIsOpen={() => toggleModal(item.id)}
                        />
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <span
                          className="text-red-500 cursor-pointer"
                          onClick={() => DeleteInverstmentCalendar(item.id)}
                        >
                          حذف
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center text-gray-500 py-4">
                      گزارشی یافت نشد
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
          </div>
        </div>
        <div className="relative flex justify-center p-8">
          {response?.data?.length > 10 && (
            <PaginationComponet
              total={response?.pagination?.total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>


      </div>
    </div>
  );
}

export default InvestmentCalendar;
