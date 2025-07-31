/* eslint-disable no-unused-vars */
import { getDate } from 'component/DateFunctions/DateFunctions';
import Sidebar from 'component/layout/sidebar/SideBar';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  FinancialStatementsUpdateStateReq,
  GetAllFinancialStatementsReq
} from './Api/FinancialStatementsReq';
import { Link } from 'react-router-dom';
import { FinancialStatementsStatus, FinancialStatementsType } from './component/FinancialEnum';
import { toast } from 'react-toastify';
import DropDown from 'component/DropDown/DropDown';
import FinanciaStatementModal from './component/FinanciaStatementModal';
import getBaseUrl from 'component/Axios/getBaseUrl';
import FindUser from 'component/AutoComplete/FindUser';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DataContext from 'comon/context/MainContext';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';
import { Table } from 'flowbite-react';

function FinancialStatementsManagement() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState();
  const [userId, setUserId] = useState();
  const [investmentPlanId, setInvestmentPlanId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [openModals, setOpenModals] = useState({});

  useEffect(() => {
    GetAllFinancialStatements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [userId, type, status]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllFinancialStatements = async () => {
    setResponse();
    setIsloading(true);
    const res = await GetAllFinancialStatementsReq({
      userId,
      status: status?.key,
      planId: investmentPlanId?.key,
      type: type?.key,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    setIsloading(false);
    setResponse(res);
  };

  useMemo(() => {
    !isOpen && GetAllFinancialStatements();
  }, [userId, type, status, currentPage, isOpen, investmentPlanId]);

  const FinancialStatementsUpdateState = async (id, status) => {
    const res = await FinancialStatementsUpdateStateReq({
      financialStatementId: id,
      status
    });
    if (res) {
      setTimeout(() => {
        GetAllFinancialStatements();
      }, 1000);
      toast.success('ثبت شد');
    } else {
      toast.error('ثبت ناموفق');
    }
  };

  const FindName = (arr, id) => arr?.find((item) => item?.key == id);

  const toggleModal = (id) => {
    setOpenModals((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const HandelClearFilter = () => {
    setUserId();
    setStatus();
    setInvestmentPlanId();
    setType();
  };

  console.log(response);

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

            {/* طرح */}
            <div className="w-full sm:w-[200px] flex flex-col gap-1">
              <label htmlFor="investmentPlanId" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                طرح
              </label>
              <DropDown
                arrey={allPlans}
                select={investmentPlanId}
                setSelect={setInvestmentPlanId}
                height="h-[200px]"
                className="w-full h-[200px] px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* وضعیت صورت مالی */}
            <div className="w-full sm:w-[200px] flex flex-col gap-1">
              <label htmlFor="status" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                وضعیت صورت مالی
              </label>
              <DropDown
                arrey={[
                  { name: 'همه', key: null },
                  { name: 'بارگذاری شده', key: 1 },
                  { name: 'تایید شده', key: 2 },
                  { name: 'رد شده', key: 3 }
                ]}
                select={status}
                setSelect={setStatus}
                className="w-full h-[200px] px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* فیلتر نوع */}
            <div className="w-full sm:w-[200px] flex flex-col gap-1">
              <label htmlFor="type" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                فیلتر نوع
              </label>
              <DropDown
                arrey={FinancialStatementsType}
                select={type}
                setSelect={setType}
                height="h-[200px]"
                className="w-full h-[200px] px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* حذف فیلتر */}
            <button
              onClick={HandelClearFilter}
              className="w-full sm:w-auto px-6 h-10 bg-red-50 text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium focus:outline-none"
            >
              حذف فیلتر
            </button>

            {/* مودال صورت مالی */}
            <FinanciaStatementModal type={1} isOpen={isOpen} setIsOpen={setIsOpen} />

          </div>
        </div>


        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          <div className='w-full min-w-max'>
            <Table className="table-auto font-IRANYekanX rounded-lg w-full whitespace-nowrap">
              <Table.Head className="bg-white text-sm text-right text-dominant-500">
                <Table.HeadCell className="p-4">ردیف</Table.HeadCell>
                <Table.HeadCell className="p-4">عنوان</Table.HeadCell>
                <Table.HeadCell className="p-4">عنوان طرح</Table.HeadCell>
                <Table.HeadCell className="p-4">نام کاربر</Table.HeadCell>
                <Table.HeadCell className="p-4">کدملی / شناسه ملی</Table.HeadCell>
                <Table.HeadCell className="p-4">تاریخ بارگذاری</Table.HeadCell>
                <Table.HeadCell className="p-4">توضیحات</Table.HeadCell>
                <Table.HeadCell className="p-4">وضعیت صورت مالی</Table.HeadCell>
                <Table.HeadCell className="p-4">وضعیت نمایش</Table.HeadCell>
                <Table.HeadCell className="p-4">نوع صورت مالی</Table.HeadCell>
                <Table.HeadCell className="p-4">فایل مستندات</Table.HeadCell>
                <Table.HeadCell className="p-4">عملیات</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y bg-white dark:bg-gray-800">
                {response?.data?.map((item, index) => (
                  <Table.Row
                    key={item.id || index}
                    className="border-b border-gray-300 text-center text-xs font-semibold text-dominant-500"
                  >
                    <Table.Cell className="p-2">{Skip + index + 1}</Table.Cell>
                    <Table.Cell className="p-2">{item?.title || '-'}</Table.Cell>
                    <Table.Cell className="p-2">{item?.planTitle || '-'}</Table.Cell>
                    <Table.Cell className="p-2">{item?.user?.name || '-'}</Table.Cell>
                    <Table.Cell className="p-2">{item?.user?.username || '-'}</Table.Cell>
                    <Table.Cell className="p-2">
                      {(item?.createDate && getDate(item.createDate)) || '-'}
                    </Table.Cell>
                    <Table.Cell className="p-2">{item?.description || '-'}</Table.Cell>
                    <Table.Cell className="p-2">
                      {FindName(FinancialStatementsStatus, item?.status)?.name || '-'}
                    </Table.Cell>
                    <Table.Cell
                      className={`p-2 ${item?.isPublic ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {item?.isPublic ? 'قابل نمایش' : 'غیر قابل نمایش'}
                    </Table.Cell>
                    <Table.Cell className="p-2">
                      {FindName(FinancialStatementsType, item?.type)?.name || '-'}
                    </Table.Cell>
                    <Table.Cell className="p-3 text-accent">
                      <Link
                        to={getBaseUrl() + item?.path}
                        target="_blank"
                        className="text-indigo-500 hover:text-indigo-600 transition-colors"
                      >
                        دریافت
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="p-2 flex justify-center gap-x-2">
                      {item?.status === 1 && (
                        <button
                          onClick={() =>
                            FinancialStatementsUpdateState(item.id, 2)
                          }
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded transition-colors"
                        >
                          تایید
                        </button>
                      )}
                      {item?.status === 1 && (
                        <button
                          onClick={() =>
                            FinancialStatementsUpdateState(item.id, 3)
                          }
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                        >
                          رد
                        </button>
                      )}
                    </Table.Cell>
                    <Table.Cell className="py-1 flex justify-center">
                      <FinanciaStatementModal
                        data={item}
                        type={2}
                        isOpen={!!openModals[item.id]}
                        setIsOpen={() => toggleModal(item.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex justify-center py-3">
                <BouncingDotsLoader />
              </div>
            )}

            {response?.pagination?.total === 0 && !isloading && (
              <span className="w-full flex justify-center py-5 text-base font-medium text-gray-600">
                گزارشی یافت نشد
              </span>
            )}

          </div>
        </div>
        <div className="relative flex justify-center py-5">
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

export default FinancialStatementsManagement;
