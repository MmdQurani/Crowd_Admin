/* eslint-disable no-unused-vars */
import FindUser from 'component/AutoComplete/FindUser';
import Axios from 'component/Axios/Axios';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import DropDown from 'component/DropDown/DropDown';
import Sidebar from 'component/layout/sidebar/SideBar';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useEffect, useMemo, useState } from 'react';
import MainModal from './MainModal';

function ManageProjectReviewForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [status, setStatus] = useState();
  const [userId, setUserId] = useState();
  const [responseStatus, setResponseStatus] = useState(false);

  useEffect(() => {
    GetAllRequestForms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [userId, status]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);
  const headers = [
    { name: 'ردیف', key: 'index' },
    { name: 'نام شرکت', key: 'companyName' },
    { name: 'نوع شخص حقوقی', key: 'legalEntityType' },
    { name: 'سرمایه مورد نیاز (ریال)', key: 'requiredCapital' },
    { name: 'گارانتی های ارائه شده', key: 'offeredGuarantees' },
    { name: 'درآمد سالانه (ریال)', key: 'annualRevenue' },
    { name: 'تعداد کارمندان', key: 'employeeCount' },
    { name: 'تاریخ تاسیس', key: 'establishmentDate' },
    { name: 'شناسه ملی', key: 'nationalId' },
    { name: 'شماره ثبت', key: 'registrationNumber' },
    { name: 'زمینه فعالیت ', key: 'businessNature' },
    { name: 'سایت', key: 'website' },
    { name: 'زمان ایجاد', key: 'createDate' },
    { name: 'نام رابط', key: 'contactPersonName' },
    { name: 'موقعیت شغلی رابط', key: 'contactPersonPosition' },
    { name: 'شماره همراه رابط', key: 'contactPersonMobileNumber' },
    { name: 'ایمیل رابط', key: 'contactPersonEmail' },
    { name: 'شماره تلفن رابط', key: 'contactPersonLandlineNumber' },
    { name: 'وضعیت', key: 'status' },
    { name: 'ثبت نظر ', key: 'note' },
    { name: 'توضیح', key: 'proposalDescription' }
  ];
  const GetAllRequestForms = async () => {
    setIsloading(true);
    await Axios.post('/PlanReviewRequestManagement/GetAll', {
      userId,
      status: status?.key,
      pagination: {
        take: 10,
        skip: Skip
      }
    })
      .then((res) => setResponse(res))
      .catch(() => setResponse(false))
      .finally(() => setIsloading(false));
  };
  useMemo(() => {
    GetAllRequestForms();
  }, [responseStatus, currentPage, userId, status]);

  const StatusEnum = [
    { name: 'همه', key: null, color: ' text-gray-300 ' },
    { name: 'بارگذاری شده', key: 1, color: ' text-yellow-500 ' },
    { name: ' تایید شده', key: 2, color: ' text-green-500 ' },
    { name: 'رد شده', key: 3, color: ' text-red-500' }
  ];
  //   const FinancialStatementsUpdateState = async (id, status) => {
  //     const res = await FinancialStatementsUpdateStateReq({
  //       financialStatementId: id,
  //       status
  //     });
  //     if (res) {
  //       setTimeout(() => {
  //         GetAllRequestForms();
  //       }, 1000);
  //       toast.success('ثبت شد');
  //     } else {
  //       toast.error('ثبت ناموفق');
  //     }
  //   };

  //   const FindName = (arr, id) => arr?.find((item) => item?.key == id);

  //   const toggleModal = (id) => {
  //     setOpenModals((prevState) => ({
  //       ...prevState,
  //       [id]: !prevState[id]
  //     }));
  //   };

  const HandelClearFilter = () => {
    setUserId();
    setStatus();
  };

  const ItemsFinder = (array, id, key) => array?.find((item) => item?.[key] == id);
  return (
    <div className="flex flex-row items-start h-auto  w-full ">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500   rounded-lg  w-full flex justify-start gap-x-2 p-3 items-end">
          <div className="w-[20%] flex gap-x-2 justify-start ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>
          <div className="w-[20%] flex flex-col gap-y-1 items-start ">
            <label className="   text-white  text-xs   text-start">وضعیت فرم درخواست </label>
            <DropDown arrey={StatusEnum} select={status} setSelect={setStatus} />
          </div>{' '}
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8  w-full ">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm  text-right shadow-xl rounded-md  text-dominant-500">
              <tr className=" text-center">
                {headers.map((item, index) => (
                  <th key={index} className=" p-4 text-xs  whitespace-nowrap">
                    {item?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="p-5 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b text-center  border-gray-300 rounded-md font-semibold text-xs items-end text-dominant-500  ">
                    <td className="p-2 font-normal h-[42px] ">{Skip + index + 1}</td>
                    <td className="p-2 font-normal h-[42px] ">{item?.companyName || 'نامشخص'}</td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.legalEntityType || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.requiredCapital && Number(item?.requiredCapital).toLocaleString()) ||
                        'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.offeredGuarantees || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.annualRevenue && Number(item?.annualRevenue).toLocaleString()) ||
                        'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.employeeCount && Number(item?.employeeCount).toLocaleString()) ||
                        'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.establishmentDate &&
                        DateFunction2.getDate(item?.establishmentDate)) ||
                        'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">{item?.nationalId || 'نامشخص'}</td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.registrationNumber || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.businessNature || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      <a
                        className="text-sm text-accent-500 hover:underline underline-offset-8 hover:font-semibold font-normal"
                        target="_blank"
                        href={
                          item?.website.startsWith('http')
                            ? item.website
                            : `https://${item.website}`
                        }
                        rel="noreferrer">
                        لینک
                      </a>
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {(item?.createDate && DateFunction2.getDate(item?.createDate)) || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.contactPersonName || 'نامشخص'}
                    </td>

                    <td className="p-2 font-normal h-[42px] ">
                      {item?.contactPersonPosition || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.contactPersonMobileNumber || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.contactPersonEmail || 'نامشخص'}
                    </td>
                    <td className="p-2 font-normal h-[42px] ">
                      {item?.contactPersonLandlineNumber || 'نامشخص'}
                    </td>
                    <td
                      className={`p-2 font-normal h-[42px] whitespace-nowrap ${
                        ItemsFinder(StatusEnum, item?.status, 'key')?.color
                      }`}>
                      <div className="w-full flex justify-between gap-x-2 flex-nowrap">
                        {' '}
                        {(item?.status && ItemsFinder(StatusEnum, item?.status, 'key'))?.name ||
                          'نامشخص'}
                        <div className="border-l-2 border-gray-600 " />
                        <MainModal
                          StatusEnum={StatusEnum}
                          response={responseStatus}
                          setResponse={setResponseStatus}
                          type={2}
                          data={item}
                        />
                      </div>
                    </td>
                    <td className="p-2 font-normal h-[42px] whitespace-nowrap ">
                      <div className="w-full flex justify-center items-center ">
                        <MainModal
                          type={3}
                          data={item}
                          response={responseStatus}
                          setResponse={setResponseStatus}
                        />
                      </div>
                    </td>
                    <td className="p-2 font-normal h-[42px] whitespace-nowrap ">
                      {(item?.proposalDescription && (
                        <div className="w-full flex justify-center items-center ">
                          <MainModal type={1} data={item} />
                        </div>
                      )) ||
                        'توضیحاتی یافت نشد'}
                    </td>

                    <td className="p-2 h-[42px] gap-x-2 flex justify-center  ">
                      {/* {item?.status == 1 && (
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
                      )} */}
                    </td>
                    <td className=" py-1 gap-x-2 flex justify-center  ">
                      {/* <FinanciaStatementModal
                            data={item}
                            type={2}
                            isOpen={!!openModals[item.id]}
                            setIsOpen={() => toggleModal(item.id)}
                          /> */}
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
          {(!response || response?.data?.length == 0) && (
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

export default ManageProjectReviewForm;
