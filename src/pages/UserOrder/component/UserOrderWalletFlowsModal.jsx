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
import { Table } from 'flowbite-react';

import {IoMdClose } from 'react-icons/io';

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
          <div className="fixed inset-0 overflow-y-auto bg-black/40 backdrop-blur-sm backdrop-filter">
            <div className="flex min-h-full h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel
                  className="relative bg-white min-h-[90%] overflow-y-auto rounded-lg shadow-2xl w-full max-w-5xl p-8 flex flex-col gap-8"
                >
                  {/** Close button, now a sleek icon/text in top-right **/}
                  <button
                    onClick={closeModal}
                    className="absolute p-2 bg-slate-50 hover:bg-slate-100 rounded-lg top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <IoMdClose className="text-2xl" />
                  </button>

                  {/** Filters wrapper with modern card style **/}
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/** Status Dropdown **/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="walletflowstatus"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        وضعیت تراکنش
                      </label>
                      <DropDown
                        arrey={walletflowstatus}
                        select={status}
                        setSelect={setStatus}
                        name="walletflowstatus"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/** Start Date **/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        از تاریخ
                      </label>
                      <DatePickerPersian
                        titleStyle=""
                        value={startDate}
                        onchange={setStartDate}
                        title=""
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/** End Date **/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        تا تاریخ
                      </label>
                      <DatePickerPersian
                        titleStyle=""
                        value={endDate}
                        onchange={setEndDate}
                        title=""
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/** Clear Filters Button **/}
                    <div className="md:col-span-3 flex justify-start">
                      <button
                        onClick={HandelClearFilter}
                        className="bg-white text-accent border border-accent hover:bg-accent hover:text-white font-medium px-5 py-2 rounded-md transition"
                      >
                        حذف فیلترها
                      </button>
                    </div>
                  </div>

                  {/** Table container (unchanged) **/}
                  <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 mt-2 p-2">
                    <div className='w-max'>
                      <Table hoverable={false} className="whitespace-nowrap ">
                        <Table.Head className="bg-gray-200 border-b border-gray-400">
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            ردیف
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            عنوان طرح
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            نام
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            نام کاربری
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            تاریخ تراکنش
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            زمان تراکنش
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            توضیح تراکنش
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            مبلغ تراکنش
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            نوع تراکنش
                          </Table.HeadCell>
                          <Table.HeadCell className="text-center py-4 text-gray-700">
                            وضعیت تراکنش
                          </Table.HeadCell>
                        </Table.Head>

                        <Table.Body className="divide-y">
                          {ordersWalletFlows?.data?.map((item, index) => (
                            <Table.Row
                              key={index}
                              className="text-center font-normal text-xs text-dominant-500"
                            >
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {Skip + index + 1}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.planTitle || "-"}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.user?.name}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.user?.username}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.createDate && getDate(item.createDate)}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.createDate?.split("T")?.[1]}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {item?.flowDescription || "-----"}
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {Number(item?.moneyAmount).toLocaleString()} ریال
                              </Table.Cell>
                              <Table.Cell className="py-3 whitespace-nowrap">
                                {FindType(OperationType, item?.operationType)?.name}
                              </Table.Cell>
                              <Table.Cell
                                className={`py-3 font-medium whitespace-nowrap ${FindType(walletflowstatus, item?.status)?.textcolor
                                  }`}
                              >
                                {FindType(walletflowstatus, item?.status)?.name}
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

                      {(!ordersWalletFlows || ordersWalletFlows?.pagination?.total === 0) && (
                        <span className="w-full flex items-center justify-center py-5 text-base font-medium text-gray-500">
                          گزارشی یافت نشد
                        </span>
                      )}

                      <div className="relative flex justify-center py-8">
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
