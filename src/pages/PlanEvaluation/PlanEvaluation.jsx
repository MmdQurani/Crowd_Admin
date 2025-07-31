/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DropDown from 'component/DropDown/DropDown';
import FindUser from 'component/AutoComplete/FindUser';
import {
  GetAllEvaluationReq,
  RemoveEvaluationReq,
  UpdateEvaluationReq
} from './Api/EvaluationApiCall';
import CreateEvaluationModal from './component/CreateEvaluationModal';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import DataContext from 'comon/context/MainContext';
import { findStatusTitle } from 'component/db/PlanStatusEnum';
import Tooltip from 'component/Tooltip/Tooltip';
import {
  FormatTextWithLineBreaks,
  truncateDescription
} from 'component/GlobalyTools/UseAbleFunction';
import { IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { Table } from 'flowbite-react';

function PlanEvaluation() {
  const { allPlans } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [userId, setUserId] = useState();
  const [planId, setPlanId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [updateTitleId, setUpdateTitleId] = useState();
  const [title, setTitle] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    isOpen == false && GetAllEvaluation();
  }, [currentPage, isOpen, userId, planId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 5 * (currentPage - 1);

  const GetAllEvaluation = async () => {
    setIsloading(true);
    const res = await GetAllEvaluationReq({
      userId,
      planId: planId?.key,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    console.log(res);

    setIsloading(false);
    setResponse(res);
  };

  const RemoveEvaluation = async (id) => {
    const res = await RemoveEvaluationReq({ id });
    if (res) {
      GetAllEvaluation();
    }
  };

  const UpdateEvaluation = async (id) => {
    setIsLoading(true);
    const res = await UpdateEvaluationReq({ id: updateTitleId, title });
    if (res) {
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        setUpdateTitleId(null);
        setTitle('');
        GetAllEvaluation();
      }, 2000);
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
        setUpdateTitleId(null);
        setTitle('');
        GetAllEvaluation();
      }, 2000);
    }

    setIsLoading(false);
  };

  const HandelClearFilter = () => {
    setPlanId();
    setUserId();
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


        <div className="flex flex-wrap items-end justify-start gap-4 xl:gap-x-10 w-full bg-white rounded-lg shadow-md p-4">
          <div className="w-full md:w-1/5 flex items-center gap-2">
            <FindUser
              setUserId={setUserId}
              userId={userId}
            />
          </div>

          <div className="w-full md:w-1/4 flex flex-col items-start gap-1">
            <label className="text-sm text-gray-700">نام طرح</label>
            <DropDown
              arrey={allPlans}
              select={planId}
              setSelect={setPlanId}
              height="h-[200px]"
              className="w-full"
            />
          </div>

          <DownloadExcelBtn
            Rout="InvesteeAssessments/GetAll"
            filename="ارزیابی ها"
            body={{
              userId,
              planId: planId?.key,
              pagination: { take: 1000000, skip: 0 },
            }}
            className="h-10 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          />

          <button
            onClick={HandelClearFilter}
            className="w-full md:w-auto py-2.5 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-600 font-semibold text-sm flex justify-center items-center focus:outline-none transition"
          >
            حذف فیلتر
          </button>

          <CreateEvaluationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            allPlans={allPlans}
            className="h-10 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          />
        </div>


        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          <div className="w-full min-w-max">
            <Table className="table-auto font-IRANYekanX rounded-lg w-full">
              <Table.Head className="font-normal bg-white p-5 rounded-lg shadow-lg text-sm text-center text-dominant-500">
                <Table.HeadCell className="rounded-r-lg p-4">ردیف</Table.HeadCell>
                <Table.HeadCell className="p-4">ارزیابی</Table.HeadCell>
                <Table.HeadCell className="p-4">تاریخ ایجاد</Table.HeadCell>
                <Table.HeadCell className="p-4">طرح</Table.HeadCell>
                <Table.HeadCell className="p-4">زمان ایجاد طرح</Table.HeadCell>
                <Table.HeadCell className="p-4">وضعیت طرح</Table.HeadCell>
                <Table.HeadCell className="rounded-l-lg p-4">عملیات</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y p-10 w-full">
                {response?.data?.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="border-b border-gray-300 text-center font-semibold text-sm text-gray-500"
                  >
                    <Table.Cell className="p-3">
                      {Skip + index + 1}
                    </Table.Cell>

                    <Table.Cell className="p-3">
                      {updateTitleId == item?.id ? (
                        <form
                          className="w-full flex flex-col items-center gap-y-1"
                          onSubmit={UpdateEvaluation}
                        >
                          <input
                            autoFocus
                            className="w-full h-[40px] pr-1 text-sm text-dominant-500 border border-gray-600 rounded-md focus:outline-none focus:ring-0 focus:border-accent-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <div className="flex w-full justify-between items-center gap-x-2">
                            {status ? (
                              status === 'success' ? (
                                <div className="w-full h-[38px] border border-green-500 rounded-md flex items-center justify-center text-green-500">
                                  ثبت شد
                                </div>
                              ) : (
                                <div className="w-full h-[38px] border border-red-500 rounded-md flex items-center justify-center text-red-500">
                                  خطا ! ثبت ناموفق
                                </div>
                              )
                            ) : (
                              <div className="flex w-full justify-between items-center">
                                <button
                                  type="submit"
                                  className={`w-[40%] h-[35px] flex items-center justify-center rounded-md text-sm text-white ${isLoading
                                      ? 'border border-accent-500'
                                      : 'bg-accent-500'
                                    }`}
                                >
                                  {isLoading ? <BouncingDotsLoader /> : 'ثبت'}
                                </button>
                                <button
                                  onClick={() => setUpdateTitleId(null)}
                                  className="w-[40%] h-[35px] flex items-center justify-center rounded-md border border-accent-500 text-sm text-accent-500"
                                >
                                  انصراف
                                </button>
                              </div>
                            )}
                          </div>
                        </form>
                      ) : (
                        <Tooltip text={item?.title}>
                          <span className="inline-block max-w-xs truncate">
                            {truncateDescription(item?.title)}
                          </span>
                        </Tooltip>
                      )}
                    </Table.Cell>

                    <Table.Cell className="p-3">
                      {DateFunction2.getDate(item?.createDate) || '-'}
                    </Table.Cell>

                    <Table.Cell className="p-3 text-center">
                      {item?.plan?.title}
                    </Table.Cell>

                    <Table.Cell className="p-3">
                      {DateFunction2.getDate(item?.createDate) || '-'}
                    </Table.Cell>

                    <Table.Cell className="p-3">
                      {findStatusTitle(item?.plan?.state)?.name || '-'}
                    </Table.Cell>

                    <Table.Cell className="p-3">
                      <div className="flex items-center justify-center gap-x-3">
                        <button
                          className="text-red-600 hover:text-red-800 font-medium"
                          onClick={() => RemoveEvaluation(item?.id)}
                        >
                          حذف
                        </button>
                        <button
                          className="text-accent-500 hover:text-accent-600 font-medium"
                          onClick={() => setUpdateTitleId(item?.id)}
                        >
                          ویرایش
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex justify-center items-center py-8">
                <BouncingDotsLoader />
              </div>
            )}

            {response?.pagination?.total === 0 && !isloading && (
              <span className="w-full flex justify-center items-center py-5 text-base font-medium text-gray-500">
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

export default PlanEvaluation;
