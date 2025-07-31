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
import { IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { Table } from 'flowbite-react';

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

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 justify-start gap-y-5 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div className="w-full flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="w-full flex flex-wrap items-end justify-start gap-6">

            {/* جستجوی کاربر */}
            <div className="w-full sm:w-[200px]">
              <FindUser
                setUserId={setUserId}
                userId={userId}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* از تاریخ */}
            <div className="w-full sm:w-[200px]">
              <DatePickerPersian
                value={startDate}
                onchange={setStartDate}
                title="از تاریخ"
                titleStyle="block mb-1 text-sm text-gray-700 dark:text-gray-300"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* تا تاریخ */}
            <div className="w-full sm:w-[200px]">
              <DatePickerPersian
                value={endDate}
                onchange={setEndDate}
                title="تا تاریخ"
                titleStyle="block mb-1 text-sm text-gray-700 dark:text-gray-300"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* نام طرح */}
            <div className="w-full sm:w-[200px] flex flex-col gap-1">
              <label htmlFor="planId" className="text-sm text-gray-700 dark:text-gray-300">
                نام طرح
              </label>
              <DropDown
                arrey={allPlans}
                select={planId}
                setSelect={setPlanId}
                height="h-[200px]"
                className="w-full h-[200px] px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* دانلود اکسل */}
            <div className="w-full sm:w-auto">
              <DownloadExcelBtn
                Rout="ComplaintsManagement/GetAll"
                filename="گزارش شکایات"
                body={{
                  userId: response?.data?.id,
                  planId: planId?.key,
                  startDate,
                  endDate,
                  pagination: { take: 100000, skip: 0 },
                }}
                className="w-full px-6 h-10 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium focus:outline-none"
              />
            </div>

            {/* حذف فیلتر */}
            <button
              onClick={HandelClearFilter}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium focus:outline-none"
            >
              حذف فیلتر
            </button>

          </div>
        </div>



        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          <div className="w-full min-w-max">
            <Table className="table-auto font-IRANYekanX rounded-lg w-full whitespace-nowrap">
              <Table.Head className="font-bold  bg-white text-sm text-right text-gray-500">
                {TableHeader?.map((item, index) => (
                  <Table.HeadCell
                    key={index}
                    className="text-start text-sm text-gray-170 font-semibold whitespace-pre-line p-3 h-10"
                  >
                    {item?.name}
                  </Table.HeadCell>
                ))}
              </Table.Head>

              <Table.Body className="divide-y p-10 w-full">
                {complaints?.data &&
                  complaints.data.length > 0 &&
                  complaints.data.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {/* Main Row */}
                      <Table.Row className="text-start border-b border-gray-150">
                        <Table.Cell
                          className="lg:text-sm text-xs text-gray-700 whitespace-pre-line p-3 cursor-pointer"
                          onClick={() => toggleRow(idx)}
                        >
                          {item?.plan?.title}
                        </Table.Cell>
                        <Table.Cell
                          className="lg:text-sm text-xs text-gray-700 whitespace-pre-line p-3 cursor-pointer"
                          onClick={() => toggleRow(idx)}
                        >
                          {item?.createDate && DateFunction2.getDate(item.createDate)}
                        </Table.Cell>
                        <Table.Cell
                          className="lg:text-sm text-xs text-gray-700 whitespace-pre-line p-3 cursor-pointer"
                          onClick={() => toggleRow(idx)}
                        >
                          {item?.subject ?? 'ندارد'}
                        </Table.Cell>
                        <Table.Cell
                          className="lg:text-sm text-xs text-gray-700 whitespace-pre-line p-3 cursor-pointer"
                          onClick={() => toggleRow(idx)}
                        >
                          {item?.user?.name}
                        </Table.Cell>
                        <Table.Cell
                          className="lg:text-sm text-xs text-gray-700 whitespace-pre-line p-3 cursor-pointer"
                          onClick={() => toggleRow(idx)}
                        >
                          {item?.user?.username}
                        </Table.Cell>
                        <Table.Cell className="flex justify-start items-center p-3">
                          <InlineSVG
                            src={arrowBlack}
                            className={`cursor-pointer transition-transform scale-50 ${expandedRow === idx ? 'rotate-180' : ''
                              }`}
                            onClick={() => toggleRow(idx)}
                          />
                        </Table.Cell>
                      </Table.Row>

                      {/* Expanded Row */}
                      <Table.Row
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedRow === idx ? 'border-b border-accent-700' : ''
                          }`}
                      >
                        <Table.Cell colSpan={6} className="p-0">
                          <div
                            ref={(el) => (contentRefs.current[idx] = el)}
                            className={`overflow-hidden flex flex-col gap-y-1 text-xs text-gray-170 transition-all duration-500 ease-in-out ${expandedRow === idx ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                              }`}
                          >
                            <p className="p-3 border-b border-gray-150 w-full">
                              {item?.content
                                ? item.content
                                : 'توضیحاتی برای این مورد یافت نشده'}
                            </p>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </React.Fragment>
                  ))}
              </Table.Body>
            </Table>

            {(complaints?.data?.length == 0 || complaints?.length == 0) && (
              <span className=" text-center justify-center flex w-full items-center text-gray-600 mt-16 font-bold text-sm">
                موردی یافت نشد{' '}
              </span>
            )}

            {isloading && (
              <div className="w-full flex justify-center items-center py-8">
                <BouncingDotsLoader />
              </div>
            )}
          </div>
        </div>
        <div className="relative flex justify-center py-8">
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
