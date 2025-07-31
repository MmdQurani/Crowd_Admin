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
import Tooltip from 'component/Tooltip/Tooltip';
import { truncateDescription } from 'component/GlobalyTools/UseAbleFunction';
import { Table } from 'flowbite-react';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

function InvesteeEvaluation() {
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

        <div dir='rtl' className="bg-white dark:bg-gray-800 rounded-lg w-full flex flex-wrap justify-start gap-5 gap-x-10 p-4 items-end shadow-sm">

          <div className="w-full sm:w-[250px]">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>

          <div className="w-full sm:w-[250px]">
            <label className="block mb-1 text-sm text-gray-700">نام طرح</label>
            <DropDown
              arrey={allPlans}
              select={planId}
              setSelect={setPlanId}
              height="h-[200px]"
              className="w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <DownloadExcelBtn
            Rout="InvesteeAssessments/GetAll"
            filename="ارزیابی ها"
            body={{
              userId,
              planId: planId?.key,
              pagination: { take: 1000000, skip: 0 }
            }}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium py-2 px-4 rounded-lg"
          />

          <button
            onClick={HandelClearFilter}
            className="w-full md:w-auto py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-600 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            حذف فیلتر
          </button>

          <div className="w-auto">
            <CreateEvaluationModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              allPlans={allPlans}
            />
          </div>

        </div>

        <div dir="rtl" className="relative w-full sm:w-[100%] mx-auto overflow-x-auto md:rounded-lg p-10">
          <div className="min-w-max w-full">
            <Table hoverable={false} className="whitespace-nowrap min-w-full">
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-right py-4 text-gray-700">ردیف</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">عنوان</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">تاریخ ایجاد</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">کاربر</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">نام کاربری</Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">عملیات</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((item, index) => (
                    <Table.Row key={item.id ?? index}>
                      <Table.Cell className="text-right">{Skip + index + 1}</Table.Cell>
                      <Table.Cell className="text-right">
                        {updateTitleId === item?.id ? (
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
                                  <div className="w-full h-[38px] rounded-md border border-green-500 flex items-center justify-center text-green-500">
                                    ثبت شد
                                  </div>
                                ) : (
                                  <div className="w-full h-[38px] rounded-md border border-red-500 flex items-center justify-center text-red-500">
                                    خطا ! ثبت ناموفق
                                  </div>
                                )
                              ) : (
                                <div className="flex w-full justify-between items-center">
                                  <button
                                    type="submit"
                                    className={`w-[40%] h-[35px] flex items-center justify-center rounded-md text-white text-sm ${isLoading ? 'border border-accent-500' : 'bg-accent-500'
                                      }`}
                                  >
                                    {isLoading ? <BouncingDotsLoader /> : 'ثبت'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setUpdateTitleId(null)}
                                    className="w-[40%] h-[35px] border border-accent-500 flex items-center justify-center rounded-md text-accent-500 text-sm"
                                  >
                                    انصراف
                                  </button>
                                </div>
                              )}
                            </div>
                          </form>
                        ) : (
                          <Tooltip text={item?.title}>
                            <span className="w-auto text-center">
                              {truncateDescription(item?.title)}
                            </span>
                          </Tooltip>
                        )}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {DateFunction2.getDate(item?.createDate)}
                      </Table.Cell>
                      <Table.Cell className="text-right">{item?.user?.name}</Table.Cell>
                      <Table.Cell className="text-right">{item?.user?.username}</Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex justify-center gap-x-3">
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
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center text-gray-500 py-4">
                      موردی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex flex-col items-center justify-center h-screen">
                <BouncingDotsLoader />
              </div>
            )}
          </div>

          {response?.pagination?.total > 10 && (
            <div className="relative flex justify-center p-8">
              <PaginationComponet
                total={response.pagination.total}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default InvesteeEvaluation;
