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

function Evaluation() {
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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500 rounded-lg items-end w-full flex flex-wrap justify-start gap-x-5 p-3">
          <div className="w-[20%] flex gap-x-2 justify-start ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>
          <div className="w-[25%] flex  justify-center gap-y-1 items-start flex-col ">
            <label className="text-xs text-white">نام طرح</label>
            <DropDown arrey={allPlans} select={planId} setSelect={setPlanId} height="h-[200px]" />
          </div>
          <CreateEvaluationModal isOpen={isOpen} setIsOpen={setIsOpen} allPlans={allPlans} />
          <DownloadExcelBtn
            Rout="InvesteeAssessments/GetAll"
            filename="ارزیابی ها"
            body={{
              userId,
              planId: planId?.key,
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
          </button>
        </div>
        <div className=" w-full overflow-x-auto md:rounded-lg p-10 ">
          <table className="table-auto  font-IRANYekanX w-full ">
            <thead className="font-normal w-full  bg-white text-sm shadow-lg   text-center text-dominant-500 ">
              <tr className="">
                <th className="  bg-secondary p-2 ">ردیف</th>
                <th className="  bg-secondary p-2 ">عنوان </th>
                <th className="  bg-secondary p-2 ">تاریخ ایجاد </th>
                <th className="  bg-secondary p-2 ">کاربر</th>
                <th className="  bg-secondary p-2 ">نام کاربری </th>
                <th className="  bg-secondary p-2 ">عملیات </th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b border-gray-300 rounded-md  text-sm text-right text-gray-600  ">
                    <td className="p-3 ">{Skip + index + 1}</td>
                    <td className="p-3 text-center  ">
                      {updateTitleId == item?.id ? (
                        <form
                          className="w-full flex justify-center items-center flex-col gap-y-1 "
                          onSubmit={UpdateEvaluation}>
                          <input
                            autoFocus
                            className=" w-full h-[40px] pr-1 text-sm  text-dominant-500 focus:outline-none focus:ring-0 focus:border-accent-500 border border-gray-600 rounded-md  "
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <div className="flex w-full  justify-between items-center gap-x-2">
                            {status ? (
                              status == 'success' ? (
                                <div className="w-full h-[38px] rounded-md  border border-green-500 text-center justify-center flex items-center  text-green-500  ">
                                  ثبت شد
                                </div>
                              ) : (
                                <div className="w-full h-[38px] rounded-md  border border-red-500 text-center justify-center flex items-center  text-red-500  ">
                                  خطا ! ثبت ناموفق{' '}
                                </div>
                              )
                            ) : (
                              <div className=" flex w-full justify-between items-center h-auto">
                                <button
                                  type="submit"
                                  className={`w-[40%] h-[35px] text-center flex justify-center rounded-md text-white text-sm items-center   ${
                                    isLoading ? 'border border-accent-500' : 'bg-accent-500 '
                                  } `}>
                                  {isLoading ? <BouncingDotsLoader /> : 'ثبت'}
                                </button>
                                <button
                                  onClick={() => setUpdateTitleId(null)}
                                  className="w-[40%]  border border-accent-500 h-[35px] text-center flex justify-center rounded-md text-accent-500  text-sm items-center   ">
                                  انصراف{' '}
                                </button>
                              </div>
                            )}
                          </div>
                        </form>
                      ) : (
                        item?.title
                      )}
                    </td>
                    <td className="p-3 ">{DateFunction2.getDate(item?.createDate)}</td>
                    <td className="p-3 ">{item?.user?.name}</td>
                    <td className="p-3 ">{item?.user?.username}</td>
                    <td className="p-3 ">
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => RemoveEvaluation(item?.id)}>
                        حذف
                      </button>
                      <button
                        className="text-accent-500 hover:text-accent-600 font-medium"
                        onClick={() => setUpdateTitleId(item?.id)}>
                        ویرایش
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full flex-col flex items-center justify-center h-screen">
              <BouncingDotsLoader />
            </div>
          )}

          {response?.pagination?.total == 0 && (
            <div className=" w-full flex-col flex items-center py-5 text-caption font-medium text-dominant">
              <p className="">موردی یافت نشد </p>
            </div>
          )}

          {response?.pagination?.total > 10 && (
            <div className=" relative flex justify-center p-8">
              {' '}
              <PaginationComponet
                total={response?.pagination?.total}
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

export default Evaluation;
