/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import { GetUserByNationalIdReq } from 'pages/User/Api/UserReq';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import InlineSVG from 'react-inlinesvg';
import arrowBlack from 'asset/image/icon/arrowDowndFaq.svg';
import { GetALLUsersOrderReq } from 'pages/UserOrder/Api/userOrderReq';
import Axios from 'component/Axios/Axios';
import DataContext from 'comon/context/MainContext';
import FindUser from 'component/AutoComplete/FindUser';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';

function Complaints() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [complaints, setComplaints] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userId, setUserId] = useState();
  const [planId, setPlanId] = useState();
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const contentRefs = useRef([]); // To store the ref of each row content for animation

  useEffect(() => {
    GetAllComplaints();
  }, []);

  // Toggle row expansion
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Expand if clicked, collapse if already expanded
  };

  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight = expandedRow === index ? `${ref.scrollHeight}px` : '0px';
        ref.style.opacity = expandedRow === index ? '1' : '0';
      }
    });
  }, [expandedRow]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 5 * (currentPage - 1);

  const GetAllComplaints = async () => {
    setIsloading(true);
    await Axios.post('ComplaintsManagement/GetAll', {
      userId: response?.data?.id,
      planId: planId?.key,
      startDate: startDate,
      endDate: endDate,
      pagination: {
        take: 10,
        skip: Skip
      }
    })
      .then((res) => setComplaints(res))
      .catch(() => setComplaints([]))
      .finally(() => setIsloading(false));
  };

  useMemo(() => {
    GetAllComplaints();
    setCurrentPage(1);
  }, [planId, startDate, endDate, response]);

  useMemo(() => {
    GetAllComplaints();
  }, [currentPage]);

  console.log(complaints);

  const TableHeader = [
    { name: 'نام طرح', key: 'title' },
    { name: 'تاریخ ایجاد ', key: 'date' },
    { name: 'موضوع', key: 'subject' },
    { name: 'کاربر', key: 'user' },
    { name: 'نام کاربری', key: 'userName' },
    { name: 'توضیحات', key: 'description' }
  ];

  const HandelClearFilter = () => {
    setEndDate();
    setPlanId();
    setStartDate();
    setUserId();
  };

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 justify-start gap-y-5 ">
        <div className="bg-gray-500 rounded-lg  w-full  flex flex-wrap justify-start gap-5 p-3 items-end  ">
          <div className="w-[20%] flex gap-x-2 justify-start ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>
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
          <DropDown
            arrey={allPlans}
            select={planId}
            setSelect={setPlanId}
            height="h-[200px]"
            width="w-[300px]"
          />
          <DownloadExcelBtn
            Rout="ComplaintsManagement/GetAll"
            filename="گزارش شکایات"
            body={{
              userId: response?.data?.id,
              planId: planId?.key,
              startDate: startDate,
              endDate: endDate,
              pagination: {
                take: 100000,
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
        <div className=" overflow-x-auto md:rounded-lg flex item flex-col justify-start gap-y-5  w-full">
          <table className="w-full min-w-[800px] h-auto rounded-t-sm">
            <thead className="font-normal w-full  bg-white text-sm shadow-lg   text-center text-dominant-500 ">
              <tr className="w-full h-12 rounded-t-sm shadow-lg">
                {TableHeader?.map((item, index) => (
                  <td
                    className="text-start text-sm text-gray-170 font-semibold whitespace-pre-line p-3 h-10 rounded-t-sm"
                    key={index}>
                    {item?.name}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints?.data &&
                complaints?.data?.length > 0 &&
                complaints?.data?.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Main Row */}
                    <tr className="text-start border-b border-gray-150 w-full ">
                      <td
                        className="lg:text-sm text-xs text-gray-700  w-auto text-wrap whitespace-pre-line text-start justify-start items-center p-3 cursor-pointer"
                        onClick={() => toggleRow(index)}>
                        {item?.plan?.title}
                      </td>
                      <td
                        className="lg:text-sm text-xs text-gray-700 w-auto text-wrap whitespace-pre-line text-start justify-start items-center p-3 cursor-pointer"
                        onClick={() => toggleRow(index)}>
                        {item?.createDate && DateFunction2.getDate(item?.createDate)}
                      </td>
                      <td
                        className="lg:text-sm text-xs text-gray-700 w-auto text-wrap whitespace-pre-line text-start justify-start items-center p-3 cursor-pointer"
                        onClick={() => toggleRow(index)}>
                        {item?.subject ?? 'ندارد '}
                      </td>
                      <td
                        className="lg:text-sm text-xs text-gray-700 w-auto text-wrap whitespace-pre-line text-start justify-start items-center p-3 cursor-pointer"
                        onClick={() => toggleRow(index)}>
                        {item?.user?.name}
                      </td>
                      <td
                        className="lg:text-sm text-xs text-gray-700 w-auto text-wrap whitespace-pre-line text-start justify-start items-center p-3 cursor-pointer"
                        onClick={() => toggleRow(index)}>
                        {item?.user?.username}
                      </td>
                      <td className="lg:text-sm text-xs text-gray-700 w-auto text-wrap whitespace-pre-line text-start flex justify-start items-center p-3">
                        <InlineSVG
                          src={arrowBlack}
                          className={`cursor-pointer transition-transform scale-50 `}
                          onClick={() => toggleRow(index)} // Toggle the row on arrow click
                        />
                      </td>
                    </tr>
                    {/* Expanded Row (Details) */}
                    <tr
                      className={`w-full ${
                        expandedRow === index ? 'border-b border-accent-700' : ''
                      }`}>
                      <td colSpan={5} className="p-0">
                        <div
                          ref={(el) => (contentRefs.current[index] = el)} // Store refs for each row content
                          className="overflow-hidden  flex flex-col  justify-start   gap-y-1 transition-all duration-500 ease-in-out  text-xs text-gray-170   w-full"
                          style={{
                            maxHeight: '0px',
                            opacity: 0
                          }}>
                          <p className="p-3 border-b border-gray-150 w-full">
                            {' '}
                            {item?.content ? item?.content : 'توضیحاتی برای این مورد یافت نشده '}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          {(complaints?.data?.length == 0 || complaints?.length == 0) && (
            <span className=" text-center justify-center flex w-full items-center text-gray-600 mt-16 font-bold text-sm">
              موردی یافت نشد{' '}
            </span>
          )}
          {isloading && (
            <div className="w-full flex justify-center items-center h-auto py-2 mt-16">
              <BouncingDotsLoader />
            </div>
          )}

          <PaginationComponet
            total={complaints?.pagination?.total}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Complaints;
