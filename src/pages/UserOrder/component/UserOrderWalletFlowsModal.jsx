/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import DropDown from 'component/DropDown/DropDown';
import DatePickerPersian from 'component/Datepicker/datepicker';
import { OperationType, walletflowstatus } from 'pages/transactions/enum/transaction';
import FindUser from 'component/AutoComplete/FindUser';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { GetOrderWalletFlows } from '../Api/userOrderReq';
import { getDate } from 'component/DateFunctions/DateFunctions';

function UserOrderWalletFlowsModal({ orderId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ordersWalletFlows, setOrdersWalletFlows] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [status, setStatus] = useState();
  const [operationType, setOperationType] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [userId, setUserId] = useState();

  function closeModal() {
    setEndDate();
    setOperationType();
    setStartDate();
    setCurrentPage(1);
    setStatus();
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    isOpen && GetAllOrderWalletFlows();
  }, [userId, currentPage, status, operationType, startDate, endDate, isOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userId, status, operationType]);
  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllOrderWalletFlows = async () => {
    setIsloading(true);
    const res = await GetOrderWalletFlows({
      userId: userId,
      orderId: orderId,
      operationTypes: operationType?.key ? [operationType?.key] : [],
      startDate: startDate?.split('T')?.[0],
      endDate: endDate?.split('T')?.[0],
      status: status?.key || null,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    if (res) {
      setOrdersWalletFlows(res);
    } else {
      setOrdersWalletFlows(false);
    }
    setIsloading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const FindType = (array, id) => array.find((item) => item.key == id);

  const HandelClearFilter = () => {
    setEndDate();
    setStartDate();
    setUserId();
    setStatus();
    setOperationType();
  };

  console.log(ordersWalletFlows);

  return (
    <>
      <button
        onClick={openModal}
        className="w-auto text-center text-base font-semibold  text-blue-500 underline  ">
        جزییات{' '}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-100"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="relative inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="min-w-[1000px] w-auto   transform  shadow-2xl overflow-hidden rounded-lg p-7 text-left align-middle bg-white transition-all gap-y-5 min-h-[500px] h-auto flex flex-col items-center justify-between ">
                  <div className="w-full flex flex-col items-center justify-startgap-y-3  ">
                    <div className="w-full flex justify-end items-center">
                      {' '}
                      <button
                        onClick={closeModal}
                        className="w-auto focus:outline-none  focus:ring-0 border-b border-accent-500 text-accent-500">
                        بستن
                      </button>
                    </div>
                    <div className="w-full flex flex-col justify-start  gap-3 items-center  ">
                      <div className="w-full flex justify-between ">
                        {' '}
                        <div className="w-[30%] flex flex-col justify-center items-center gap-y-1 ">
                          <label
                            htmlFor="walletflowstatus"
                            className=" text-start w-full text-xs text-white">
                            وضعیت تراکنش
                          </label>
                          <DropDown
                            arrey={walletflowstatus}
                            select={status}
                            width="border border-gray-400 w-full  rounded-md"
                            name="walletflowstatus"
                            setSelect={setStatus}
                          />
                        </div>
                        <DatePickerPersian
                          titleStyle=" text-gray-600"
                          value={startDate}
                          onchange={setStartDate}
                          title="از تاریخ"
                          style="w-[30%]"
                        />{' '}
                        <DatePickerPersian
                          titleStyle=" text-gray-600"
                          value={endDate}
                          onchange={setEndDate}
                          title="تا تاریخ"
                          style="w-[30%]"
                        />
                      </div>

                      <div className="w-full flex justify-start items-end gap-x-3">
                        <button
                          onClick={HandelClearFilter}
                          className="w-[150px] text-center flex justify-center items-center border border-accent focus:outline-none focus:ring-0 rounded-md h-[42px] text-accent">
                          {' '}
                          حذف فیلتر ها
                        </button>
                      </div>
                    </div>

                    <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
                      <table className="table-auto bordered font-IRANYekanX w-full ">
                        <thead className="font-normal w-full text-sm   text-center text-dominant-500">
                          <tr className=" bg-white shadow-2xl rounded-md ">
                            <th className="   p-2 bg-white">ردیف</th>
                            <th className="   p-2 bg-white">عنوان طرح</th>
                            <th className="   p-2 bg-white">نام </th>
                            <th className="   p-2 bg-white">نام کاربری</th>
                            <th className="   p-2 bg-white">تاریخ تراکنش</th>
                            <th className="   p-2 bg-white">زمان تراکنش</th>
                            <th className="   p-2 bg-white">توضیح تراکنش</th>
                            <th className="   p-2 bg-white">مبلغ تراکنش</th>
                            <th className="   p-2 bg-white">نوع تراکنش</th>
                            <th className="   p-2 bg-white">وضعیت تراکنش</th>
                          </tr>
                        </thead>
                        <tbody className="p-10 w-full">
                          {ordersWalletFlows &&
                            ordersWalletFlows?.data?.map((item, index) => (
                              <tr
                                key={index}
                                className=" border-t text-center rounded-md font-normal text-xs items-end text-dominant-500  ">
                                <td className="p-3">{Skip + index + 1}</td>
                                <td className="p-3">{item?.planTitle ? item?.planTitle : '-'}</td>
                                <td className="p-3">{item?.user?.name}</td>
                                <td className="p-3">{item?.user?.username}</td>
                                <td className="p-3">
                                  {item?.createDate && getDate(item?.createDate)}
                                </td>
                                <td className="p-3">
                                  {item?.createDate && item?.createDate?.split('T')?.[1]}
                                </td>
                                <td className="p-3">
                                  {item?.flowDescription ? item?.flowDescription : '-----'}
                                </td>
                                <td className="p-3">
                                  {Number(item?.moneyAmount)?.toLocaleString()} ریال
                                </td>
                                <td className="p-3">
                                  {item?.operationType &&
                                    FindType(OperationType, item?.operationType)?.name}
                                </td>
                                <td
                                  className={`p-3 ${
                                    FindType(walletflowstatus, item?.status)?.textcolor
                                  } font-medium`}>
                                  {FindType(walletflowstatus, item?.status)?.name}
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
                      {(!ordersWalletFlows || ordersWalletFlows?.pagination?.total == 0) && (
                        <span className=" w-full flex items-center py-5 text-base font-medium justify-center  text-gray-500">
                          گزارشی یافت نشد
                        </span>
                      )}
                      <div className=" relative flex justify-center py-8">
                        <PaginationComponet
                          total={ordersWalletFlows?.pagination?.total}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default UserOrderWalletFlowsModal;
