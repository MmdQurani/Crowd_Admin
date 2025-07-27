/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  CreateCommentReq,
  GetAllCommentsReq,
  GetCommentByIdReq,
  RemoveCommentReq,
  UpdateCommentReq,
  UpdateCommentStatusReq
} from './Api/CommentManagmentApiCall';
import Sidebar from 'component/layout/sidebar/SideBar';
import PaginationComponet from 'component/pagination/paginationComponent';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import { toast } from 'react-toastify';
import DataContext from 'comon/context/MainContext';

function CommentManagment() {
  const { allPlans } = useContext(DataContext);

  const [planId, setPlanId] = useState();
  const [comment, setComment] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isloading, setIsloading] = useState();
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row
  const [prop, setProp] = useState('');
  const [type, setType] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [editInput, setEditInput] = useState('');
  const [status, setStatus] = useState();
  const [response, setResponse] = useState();
  const [id, setId] = useState();
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const contentRefs = useRef([]); // To store the ref of each row content for animation

  useEffect(() => {
    GetAllComments();
  }, []);

  useEffect(() => {
    setEditInput(prop);
  }, [prop]);

  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight = expandedRow === index ? `${ref.scrollHeight}px` : '0px';
        ref.style.opacity = expandedRow === index ? '1' : '0';
      }
    });
    setInputValue('');
  }, [expandedRow]);

  const ClearAfterResponse = () => {
    setTimeout(() => {
      setExpandedRow(null);
      setResponse();
      GetAllComments();
    }, 1000);
  };

  useEffect(() => {
    type == 'id' && prop && GetRelatedComment();
  }, [type, prop]);

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllComments = async () => {
    setIsloading(true);
    const res = await GetAllCommentsReq({
      investmentPlanId: planId?.key,
      commentState: status?.key,
      startDate: startDate?.split('T')?.[0],
      endDate: endDate?.split('T')?.[0],
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    if (res) {
      setComment(res);
    } else {
      setComment(false);
    }
    setIsloading(false);
  };

  useMemo(() => {
    GetAllComments();
  }, [planId, startDate, endDate, currentPage]);

  const GetRelatedComment = async () => {
    setIsLoadingAnswer(true);
    const res = await GetCommentByIdReq(prop);
    if (res) {
      setAnswer(res?.data?.content);
    } else {
      setAnswer('پاسخی مرتبط با پیام مورد نطر یافت نشد ');
    }
    setIsLoadingAnswer(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const TruncateText = (text) => {
    if (typeof text !== 'string') return '';
    return text.length > 20 ? text.slice(0, 20) + '...' : text;
  };

  const FindState = (id) =>
    [
      { name: ' در انتطار ', key: 1 },
      { name: 'تایید شده ', key: 2 },
      { name: '  رد شده', key: 3 }
    ].find((item) => item?.key == id);

  const GenerateRelatedCursuor = (index, type, prop, id = null) => {
    return (
      setExpandedRow(expandedRow === index ? null : index), // Expand if clicked, collapse if already expanded
      setType(type),
      setProp(prop),
      setId(id)
    );
  };

  const handleCheckBox = (id) => {
    if (status == id) {
      setStatus(null);
    } else {
      setStatus(id);
    }
  };

  const UpdateCommentStatus = async () => {
    setIsLoadingAction(true);
    const res = await UpdateCommentStatusReq({
      commentId: id,
      confirmed: status
    });
    if (res) {
      setResponse('success');
      ClearAfterResponse();
    } else {
      setResponse('error');
      ClearAfterResponse();
    }
    setIsLoadingAction(false);
  };

  const CreateComment = async () => {
    setIsLoadingAction(true);
    const res = await CreateCommentReq({
      investmentPlanId: id?.plan,
      content: inputValue,
      parentCommentId: id?.comment
    });
    if (res) {
      setResponse('success');
      ClearAfterResponse();
    } else {
      setResponse('error');
      ClearAfterResponse();
    }
    setIsLoadingAction(false);
  };

  const RemoveComment = async (id) => {
    setIsLoadingAction(id);
    const res = await RemoveCommentReq({
      commentId: id
    });
    if (res) {
      toast.success('حذف باموفقیت انجام شد ');
      GetAllComments();
    } else {
      toast.error('درخواست ناموفق ! ');
    }
    setIsLoadingAction(false);
  };

  const EditeCommentContent = async () => {
    setIsLoadingAction(true);
    const res = await UpdateCommentReq({
      commentId: id,
      content: editInput
    });
    if (res) {
      setResponse('success');
      ClearAfterResponse();
    } else {
      setResponse('error');
      ClearAfterResponse();
    }
    setIsLoadingAction(false);
  };

  console.log('id', prop);

  const HandleCursor = () => {
    switch (type) {
      case 'text':
        return <p className="text-sm p-5 w-full h-auto">{prop}</p>;
      case 'id':
        return (
          <div className="w-full items-center justify-center h-auto py-5 p-3">
            {isLoadingAnswer ? <BouncingDotsLoader /> : answer}
          </div>
        );
      case 'input':
        return (
          <div className="flex flex-col justify-center items-center w-full">
            <textarea
              type="text"
              placeholder="پاسخ خود را وارد کنید"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="resize-none h-[80px] w-full rounded-md border border-cyan-500-500 bg-transparent text-sm p-2  text-gray-500 "
            />
            {response ? (
              response == 'success' ? (
                <div className="w-[70%]  rounded-md py-5  text-center justify-center flex items-center  text-green-500  ">
                  ثبت شد
                </div>
              ) : (
                <div className="w-[70%]  rounded-md  py-5 text-center justify-center flex items-center  text-red-500  ">
                  خطا ! ثبت ناموفق{' '}
                </div>
              )
            ) : (
              <div className="py-2 flex w-[50%] justify-center  gap-x-2 items-center h-auto">
                <button
                  onClick={CreateComment}
                  className={`w-[20%] flex justify-center items-center  ${
                    isLoadingAction ? 'border border-gray-500' : 'bg-green-500 '
                  }  h-[25px] rounded-md  text-center text-white `}>
                  {isLoadingAction ? <BouncingDotsLoader /> : 'ثبت'}
                </button>
                <button
                  className="w-[20%] flex justify-center items-center border border-gray-500 h-[25px] rounded-md  text-center text-gray-700 "
                  onClick={() => setExpandedRow(null)}>
                  انصراف{' '}
                </button>
              </div>
            )}
          </div>
        );
      case 'editinput':
        return (
          <div className="flex flex-col justify-center items-center w-full">
            <textarea
              type="text"
              placeholder="پاسخ خود را وارد کنید"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="resize-none h-[80px] w-full rounded-md border border-cyan-700-500 bg-transparent text-sm p-2  text-gray-500 "
            />
            {response ? (
              response == 'success' ? (
                <div className="w-[70%]  rounded-md py-5  text-center justify-center flex items-center  text-green-500  ">
                  ثبت شد
                </div>
              ) : (
                <div className="w-[70%]  rounded-md  py-5 text-center justify-center flex items-center  text-red-500  ">
                  خطا ! ثبت ناموفق{' '}
                </div>
              )
            ) : (
              <div className="py-2 flex w-[50%] justify-center  gap-x-2 items-center h-auto">
                <button
                  onClick={EditeCommentContent}
                  className={`w-[20%] flex justify-center items-center  ${
                    isLoadingAction ? 'border border-gray-500' : 'bg-green-500 '
                  }  h-[25px] rounded-md  text-center text-white `}>
                  {isLoadingAction ? <BouncingDotsLoader /> : 'ثبت'}
                </button>
                <button
                  className="w-[20%] flex justify-center items-center border border-gray-500 h-[25px] rounded-md  text-center text-gray-700 "
                  onClick={() => setExpandedRow(null)}>
                  انصراف{' '}
                </button>
              </div>
            )}
          </div>
        );
      case 'checkBox':
        return (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-full flex items-center justify-center  gap-2 p-3">
              {/* <div className="w-auto gap-x-2 flex items-center justify-start ">
                <input
                  type="checkbox"
                  className="rounded-md text-accent-500 focus:ring-0 focus:ring-offset-0 focus:outline-none "
                  onClick={() => handleCheckBox(1)}
                  checked={status == 1}
                />
                <p className="text-sm text-gray-500"> در انتظار پاسخ</p>
              </div> */}
              <div className="w-auto gap-x-2 flex items-center justify-start ">
                <input
                  type="checkbox"
                  className="rounded-md text-accent-500  focus:ring-0 focus:ring-offset-0 focus:outline-none "
                  onClick={() => handleCheckBox(true)}
                  checked={status == true}
                />
                <p className="text-sm text-green-500">تایید شده</p>
              </div>
              <div className="w-auto gap-x-2 flex items-center justify-start ">
                <input
                  type="checkbox"
                  className="rounded-md text-accent-500  focus:ring-0 focus:ring-offset-0 focus:outline-none"
                  onClick={() => handleCheckBox(false)}
                  checked={status == false}
                />
                <p className="text-sm text-red-500">رد شده</p>
              </div>
            </div>
            {response ? (
              response == 'success' ? (
                <div className="w-[70%] h-[48px] rounded-md py-5 text-center justify-center flex items-center  text-green-500  ">
                  ثبت شد
                </div>
              ) : (
                <div className="w-[70%] h-[48px] rounded-md  py-5 text-center justify-center flex items-center  text-red-500  ">
                  خطا ! ثبت ناموفق{' '}
                </div>
              )
            ) : (
              <div className="py-2 flex w-[50%] justify-center  gap-x-2 items-center h-auto">
                <button
                  onClick={UpdateCommentStatus}
                  className={`w-[20%] flex justify-center items-center  ${
                    isLoadingAction ? 'border border-gray-500' : 'bg-green-500 '
                  }  h-[25px] rounded-md  text-center text-white `}>
                  {isLoadingAction ? <BouncingDotsLoader /> : 'ثبت'}
                </button>
                <button
                  className="w-[20%] flex justify-center items-center border border-gray-500 h-[25px] rounded-md  text-center text-gray-700 "
                  onClick={() => setExpandedRow(null)}>
                  انصراف{' '}
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const HandleCheckBoxDisplay = (id) => {
    switch (id) {
      case 1:
        return { title: 'در انتظار پاسخ', color: 'text-cyan-600' };
      case 2:
        return { title: 'تایید شده', color: 'text-green-500' };
      case 3:
        return { title: 'رد شده', color: 'text-red-500' };
    }
  };

  const HandelClearFilter = () => {
    setEndDate();
    setPlanId();
    setStartDate();
  };
  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="w-full flex flex-col justify-center items-center bg-gray-500 rounded-lg p-4">
          <div className="w-full flex flex-wrap items-end justify-start gap-3">
            {' '}
            <div className="flex w-[20%] justify-between items-center">
              <DatePickerPersian value={startDate} onchange={setStartDate} title="از تاریخ" />
            </div>
            <div className="flex w-[20%] justify-between items-center">
              <DatePickerPersian value={endDate} onchange={setEndDate} title="تا تاریخ" />
            </div>
            <div className="flex w-[25%] justify-between items-center flex-col ">
              <label htmlFor="planId" className="text-white w-full text-start text-xs ">
                نام طرح
              </label>
              <DropDown arrey={allPlans} select={planId} setSelect={setPlanId} height="h-[200px]" />
            </div>{' '}
            {/* <DownloadExcelBtn
              Rout="'CommentsManagement/GetAll'"
              filename="گزارش نطرات"
              body={{
                investmentPlanId: planId?.key,
                commentState: status?.key,
                startDate: startDate?.split('T')?.[0],
                endDate: endDate?.split('T')?.[0],
                pagination: {
                  take: 10000000,
                  skip: 0
                }
              }}
            /> */}
            <button
              onClick={HandelClearFilter}
              className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
              حذف فیلتر{' '}
            </button>
          </div>
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full ">
          <div className="relative overflow-x-auto md:rounded-lg mt-8 w-full">
            <table className="table-auto  font-IRANYekanX w-full  rounded-md">
              <thead className="font-bold  shadow-xl bg-white text-sm text-right text-gray-500  ">
                <tr className=" ">
                  <th className="  border-gray-600   p-3">ردیف</th>
                  <th className="  border-gray-600   p-3 text-center">نام طرح</th>
                  <th className="  border-gray-600   p-3 text-center">کاربر</th>
                  <th className="  border-gray-600   p-3 text-center">پیام</th>
                  <th className="  border-gray-600   p-3 text-center">نوع پیام </th>
                  <th className="  border-gray-600   p-3 text-center ">وضعیت </th>
                  <th className="  border-gray-600   p-3 text-center ">پاسخ </th>
                  <th className="  border-gray-600   p-3 text-center ">تغییر وضعیت </th>
                  <th className="  border-gray-600   p-3 text-center "> </th>
                </tr>
              </thead>
              <tbody className="p-10 w-full">
                {comment &&
                  comment?.data?.map((item, index) => (
                    <React.Fragment key={index}>
                      {/* Main Row */}
                      <tr className="text-start  w-full border-b border-gray-300  text-sm">
                        <td className="p-4 border-b border-gray-300 ">{Skip + index + 1} </td>
                        <td className="p-4 border-b border-gray-300 ">
                          {item?.investmentPlanTitle}{' '}
                        </td>
                        <td className="p-4 border-b border-gray-300 ">{item?.userTitle} </td>
                        <td
                          onClick={() => GenerateRelatedCursuor(index, 'text', item?.content)}
                          className="p-4 border-b border-gray-300  cursor-pointer text-cyan-600 font-semibold">
                          {' '}
                          {item?.content && TruncateText(item?.content)}{' '}
                        </td>
                        <td className="p-4 border-b border-gray-300 ">
                          {item?.parentCommentId ? ' پاسخ' : 'نطر '}
                        </td>
                        <td className="p-4 border-b border-gray-300 ">
                          {item?.commentState && FindState(item?.commentState)?.name}{' '}
                        </td>
                        <td
                          onClick={() =>
                            GenerateRelatedCursuor(
                              index,
                              item?.parentCommentId ? 'id' : 'input',
                              item?.id,
                              {
                                comment: item?.id,
                                plan: item?.investmentPlanId
                              }
                            )
                          }
                          className="p-4 border-b border-gray-300  cursor-pointer text-cyan-600 font-semibold">
                          {item?.parentCommentId ? 'مشاهده' : 'ثبت پاسخ'}
                        </td>
                        <td
                          onClick={() =>
                            GenerateRelatedCursuor(index, 'checkBox', item?.commentState, item?.id)
                          }
                          className={`p-4 border-b border-gray-300  cursor-pointer  font-semibold  ${
                            item?.commentState && HandleCheckBoxDisplay(item?.commentState)?.color
                          }`}>
                          {item?.commentState && HandleCheckBoxDisplay(item?.commentState)?.title}
                        </td>
                        <td
                          onClick={() => RemoveComment(item.id)}
                          className={`p-4 border-b border-gray-300  cursor-pointer  font-semibold  text-xs text-red-500 `}>
                          {isLoadingAction == item.id ? <BouncingDotsLoader /> : 'حذف'}
                        </td>
                        <td
                          onClick={() =>
                            GenerateRelatedCursuor(index, 'editinput', item?.content, item?.id)
                          }
                          className={`p-4 border-b border-gray-300  cursor-pointer  font-semibold  text-xs text-cyan-600 `}>
                          {item?.parentCommentId ? 'ویرایش' : ''}
                        </td>
                      </tr>

                      {/* Expanded Row (Details) */}
                      <tr
                        className={`w-full ${
                          expandedRow === index ? 'border-b border-accent-700' : ''
                        }`}>
                        <td colSpan={10} className="p-0">
                          <div
                            ref={(el) => (contentRefs.current[index] = el)}
                            className="overflow-hidden transition-all duration-500 ease-in-out  text-xs text-gray-170  w-full"
                            style={{
                              maxHeight: expandedRow === index ? '1000px' : '0px', // Adjust max height as needed
                              opacity: expandedRow === index ? 1 : 0
                            }}>
                            {expandedRow === index && HandleCursor()}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>

            {isloading && (
              <div className=" w-full flex-col flex items-center justify-center h-screen">
                <BouncingDotsLoader />
              </div>
            )}
            {comment?.pagination?.total == 0 && isloading == false && (
              <span className=" w-full flex-col flex items-center py-5 text-caption font-medium text-gray-500">
                موردی یافت نشد
              </span>
            )}
            <div className=" relative flex justify-center py-8">
              {' '}
              <PaginationComponet
                total={comment?.pagination?.total}
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

export default CommentManagment;
