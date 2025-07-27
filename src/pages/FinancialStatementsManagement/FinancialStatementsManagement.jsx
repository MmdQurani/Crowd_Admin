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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500   rounded-lg  w-full flex justify-start gap-x-2 p-3 items-end">
          <div className="w-[20%] flex gap-x-2 justify-start ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>
          <div className="w-[200px] flex flex-col gap-y-1 items-start ">
            <label className="   text-white  text-xs   text-start">طرح </label>
            <DropDown
              arrey={allPlans}
              select={investmentPlanId}
              setSelect={setInvestmentPlanId}
              height="h-[200px]"
            />
          </div>
          <div className="w-[20%] flex flex-col gap-y-1 items-start ">
            <label className="   text-white  text-xs   text-start">وضعیت صورت مالی </label>
            <DropDown
              arrey={[
                { name: 'همه', key: null },
                { name: 'بارگذاری شده', key: 1 },
                { name: ' تایید شده', key: 2 },
                { name: 'رد شده', key: 3 }
              ]}
              select={status}
              setSelect={setStatus}
            />
          </div>{' '}
          <div className=" flex justify-center bg-gray-500  items-start flex-col w-[20%]  gap-y-1">
            <label className="w-full text-xs text-white ">فیلتر نوع </label>
            <DropDown
              arrey={FinancialStatementsType}
              setSelect={setType}
              select={type}
              height="h-[200px]"
            />
          </div>
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>
          <FinanciaStatementModal type={1} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8  w-full ">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm  text-right shadow-xl rounded-md  text-dominant-500">
              <tr className=" text-center whitespace-nowrap text-sm font-normal ">
                <th className=" p-4">ردیف</th>
                <th className=" p-4">عنوان </th>
                <th className=" p-4">عنوان طرح </th>
                <th className=" p-4">نام کاربر </th>
                <th className=" p-4"> کدملی / شناسه ملی</th>
                <th className=" p-4">تاریخ بارگذاری</th>
                <th className=" p-4">توضیحات</th>
                <th className=" p-4">وضعیت صورت مالی </th>
                <th className=" p-4">وضعیت نمایش </th>
                <th className=" p-4">نوع صورت مالی </th>
                <th className=" p-4">فایل مستندات</th>
                <th className=" p-4">عملیات</th>
              </tr>
            </thead>
            <tbody className="p-5 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b text-center  border-gray-300 rounded-md font-semibold text-xs items-end text-dominant-500  ">
                    <td className="p-2 ">{Skip + index + 1}</td>
                    <td className="p-2 ">{item?.title || '-'}</td>
                    <td className="p-2 ">{item?.planTitle || '-'}</td>
                    <td className="p-2 ">{item?.user?.name || '-'}</td>
                    <td className="p-2 ">{item?.user?.username || '-'}</td>
                    <td className="p-2 ">
                      {(item?.createDate && getDate(item?.createDate)) || '-'}
                    </td>
                    <td className="p-2 ">{item?.description || '-'}</td>
                    <td className="p-2 ">
                      {FindName(FinancialStatementsStatus, item?.status)?.name || '-'}
                    </td>
                    <td className={`p-2  ${item?.isPublic ? ' text-green-700' : ' text-red-600'} `}>
                      {item?.isPublic ? 'قابل نمایش ' : ' غیر قابل نمایش '}
                    </td>
                    <td className="p-2 ">
                      {FindName(FinancialStatementsType, item?.type)?.name || '-'}
                    </td>
                    <td className="p-3  text-accent">
                      <Link to={getBaseUrl() + item?.path} target="_blank">
                        دریافت{' '}
                      </Link>
                    </td>
                    <td className="p-2 gap-x-2 flex justify-center  ">
                      {item?.status == 1 && (
                        <button
                          className="rounded-lg bg-satisfication-85 text-white px-2 h-[30px]"
                          onClick={() => {
                            FinancialStatementsUpdateState(item?.id, 2);
                          }}>
                          تایید{' '}
                        </button>
                      )}
                      {item?.status == 1 && (
                        <button
                          className="rounded-lg  bg-satisfication-60 text-white  px-4 h-[30px] "
                          onClick={() => {
                            FinancialStatementsUpdateState(item?.id, 3);
                          }}>
                          رد
                        </button>
                      )}
                    </td>
                    <td className=" py-1 gap-x-2 flex justify-center  ">
                      <FinanciaStatementModal
                        data={item}
                        type={2}
                        isOpen={!!openModals[item.id]}
                        setIsOpen={() => toggleModal(item.id)}
                      />
                    </td>
                    {/* {item?.status == 2 && item?.type == 6 && item?.walletFlow == null && (
                      <td className="p-2 mb-3">
                        <FinancialStatementsModal
                          id={item?.id}
                          username={item?.user?.username}
                          Alert={Alert}
                          setAlert={setAlert}
                          amount={item?.amount}
                        />
                      </td>
                    )} */}
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full justify-center py-3 flex items-center">
              <BouncingDotsLoader />
            </div>
          )}
          {response?.pagination?.total == 0 && isloading === false && (
            <span className=" w-full  flex items-center justify-center  py-5 text-base  font-medium text-gray-600">
              گزارشی یافت نشد
            </span>
          )}
          <div className=" relative flex justify-center py-5">
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

export default FinancialStatementsManagement;
