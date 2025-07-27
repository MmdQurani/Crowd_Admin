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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500   rounded-lg  w-full flex justify-start gap-x-5 p-3 items-end">
          <div className="w-[40%] flex justify-between items-end gap-x-5">
            {' '}
            <DatePickerPersian value={startDate} onchange={setStartDate} title="از تاریخ" />
            <DatePickerPersian value={EndDate} onchange={setEndDate} title="تا تاریخ" />
          </div>
          <div className="w-[200px] flex flex-col gap-y-1 items-start ">
            <label className=" text-white  text-sm  text-start">طرح </label>
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              height="h-[200px]"
            />
          </div>
          <DownloadExcelBtn
            Rout="TimelineManagement/GetAll"
            filename="تقویم های سرمایه گذاری"
            body={{
              startDate: startDate && startDate?.split('T')[0],
              endDate: EndDate && EndDate?.split('T')[0],
              planId: investmentPlanId?.key,
              // type: type?.key,
              pagination: {
                take: 1000000,
                skip: 0
              }
            }}
          />
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>{' '}
          <InvestmentCalendarModal type={1} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2  w-full">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm  text-right shadow-xl rounded-md p-5 text-dominant-500">
              <tr className=" text-center ">
                <th className=" p-4">ردیف</th>
                <th className=" p-4">عنوان </th>
                <th className=" p-4">عنوان طرح </th>
                <th className=" p-4">تاریخ </th>
                <th className=" p-4">وضعیت</th>
                <th className=" p-4"></th>
                <th className=" p-4"></th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b text-center  border-gray-300 rounded-md font-semibold text-xs items-end text-dominant-500  ">
                    <td className="p-2 ">{Skip + index + 1}</td>
                    <td className="p-2 ">{item?.title}</td>
                    <td className="p-2 ">{item?.planTitle ? item?.planTitle : '-'}</td>
                    <td className="p-2 ">{item?.date && DateFunction2.getDate(item?.date)}</td>
                    <td className={`p-2 ${item?.status ? ' text-green-500' : ' text-red-600'}`}>
                      {item?.status ? 'تایید شده' : 'رد شده'}
                    </td>

                    <td className="p-2 gap-x-2 flex justify-center ">
                      <InvestmentCalendarModal
                        data={item}
                        type={2}
                        isOpen={!!openModals[item.id]}
                        setIsOpen={() => toggleModal(item.id)}
                      />
                    </td>
                    <td
                      className="text-red-500 cursor-pointer text-sm text-center  p-2 "
                      onClick={() => DeleteInverstmentCalendar(item?.id)}>
                      {' '}
                      حذف{' '}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full justify-center flex items-center py-8">
              <BouncingDotsLoader />
            </div>
          )}
          {response?.data?.length == 0 && isloading === false && (
            <span className=" w-full flex items-center py-5 text-base font-medium justify-center  text-gray-500">
              گزارشی یافت نشد
            </span>
          )}
          <div className=" relative flex justify-center p-8">
            {' '}
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
    </div>
  );
}

export default InvestmentCalendar;
