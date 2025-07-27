/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DropDown from 'component/DropDown/DropDown';
import { GetOrderPreviewReq, UpdateRecieptStatusReq } from '../Api/ReceiptsApi';
import DateFunction2 from 'component/DateFunctions/DateFunction2';

function RecieptUpdateStatusModal({ isOpen, setIsOpen, id }) {
  const [status, setStatus] = useState(); //
  const [orderPreview, setOrderPreview] = useState();
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isOpen && setStatus();
    isOpen && GetOrderPreview();
  }, [isOpen]);

  useEffect(() => {
    response &&
      setTimeout(() => {
        setResponse(false);
        setStatus();
        closeModal();
      }, 3000);
  }, [response]);

  const UpdateStatus = async () => {
    setIsLoading(true);
    const res = await UpdateRecieptStatusReq({
      offlinePaymentId: id,
      payStatus: status?.key
    });
    if (res) {
      setResponse('success');
    } else {
      setResponse('error');
    }
    setIsLoading(false);
  };

  const GetOrderPreview = async () => {
    const res = await GetOrderPreviewReq(id);
    console.log(res);
    if (res) {
      setOrderPreview(res?.data);
    } else {
      setOrderPreview(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  console.log(orderPreview);
  return (
    <>
      <button
        onClick={openModal}
        className="w-[150px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-xs items-center   ">
        تغییر وضعیت رسید{' '}
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
                <Dialog.Panel className="w-[800px] transform  shadow-2xl overflow-hidden rounded-lg p-5 text-left align-middle bg-white transition-all gap-y-5 h-[750px]  flex flex-col items-center justify-between ">
                  <Dialog.Title
                    as="h3"
                    className="text-base flex  font-normal leading-6 text-accent text-start justify-between w-full">
                    <span className="w-full border-b-2 border-accent-500 pb-2 items-baseline">
                      تغییر وضعیت رسید برای طرح (
                      <span className="text-accent-500  text-xs">{orderPreview?.plan?.title}</span>)
                    </span>
                  </Dialog.Title>
                  <div className="h-full w-full flex flex-col  items-center justify-between gap-5 gap-y-10 p-5">
                    <div className=" flex flex-col w-1/2 justify-between items-start pb-2">
                      <label htmlFor="status" className="text-gray-500 text-sm">
                        وضعیت
                      </label>
                      <DropDown
                        arrey={[
                          { name: 'تایید شده', key: 2 },
                          { name: 'رد شده', key: 3 }
                        ]}
                        select={status}
                        setSelect={setStatus}
                      />
                    </div>
                    <div className="flex flex-col w-full gap-y-7 justify-start items-center">
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center  gap-x-2">
                          <label className="text-accent-500 text-sm ">نام کاربر:</label>
                          <span className="text-accent-500 text-sm font-semibold ">
                            {orderPreview?.user?.name}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center  gap-x-2">
                          <label className="text-accent-500 text-sm ">نام کاربری کاربر:</label>
                          <span className="text-accent-500 text-sm font-semibold ">
                            {orderPreview?.user?.username}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center  gap-x-2">
                          <label className="text-accent-500 text-sm ">مبلغ درخواست(ریال) :</label>
                          <span className="text-accent-500 text-sm font-semibold ">
                            {orderPreview?.amount && Number(orderPreview?.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-accent-500 text-sm">تعداد واحد درخواست :</label>
                          <span className="text-accent-500 text-sm font-semibold ">
                            {orderPreview?.totalUnit &&
                              Number(orderPreview?.totalUnit).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            حداکثر واحد قابل خرید (حقوقی) :{' '}
                          </label>
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.maxUnitPerLegalInvestor &&
                              Number(orderPreview?.plan?.maxUnitPerLegalInvestor).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            حداکثر واحد قابل خرید (حقیقی) :{' '}
                          </label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.maxUnitPerIndividualInvestor &&
                              Number(
                                orderPreview?.plan?.maxUnitPerIndividualInvestor
                              ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            حداقل واحد قابل خرید (حقوقی) :{' '}
                          </label>
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.minUnitPerLegalInvestor &&
                              Number(orderPreview?.plan?.minUnitPerLegalInvestor).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            حداقل واحد قابل خرید (حقیقی) :{' '}
                          </label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.minUnitPerIndividualInvestor &&
                              Number(
                                orderPreview?.plan?.minUnitPerIndividualInvestor
                              ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs"> تعداد واحد باقی مانده :</label>
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.unitAvailable &&
                              Number(orderPreview?.plan?.unitAvailable).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs"> مبلغ هر واحد (ریال) :</label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.unitAmount &&
                              Number(orderPreview?.plan?.unitAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs"> تعداد واحد خریداری شده :</label>
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.unitRaised &&
                              Number(orderPreview?.plan?.unitRaised).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            مبلغ خریداری شده (ریال) :
                          </label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.amountRaised &&
                              Number(orderPreview?.plan?.amountRaised).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs"> مبلغ هدف (ریال) :</label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.goal &&
                              Number(orderPreview?.plan?.goal).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-accent-500 text-sm">
                            {' '}
                            تعداد واحد از قبل خریداری شده :
                          </label>{' '}
                          <span className="text-accent-500 text-base font-semibold ">
                            {orderPreview?.prevOrdersTotalUnit &&
                              Number(orderPreview?.prevOrdersTotalUnit).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/*  */}
                      <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            تایخ آغاز جمع آوری وجوه :
                          </label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.underwritingStartDate &&
                              DateFunction2.getDate(orderPreview?.plan?.underwritingStartDate)}
                          </span>
                        </div>
                        <div className="w-[48%] flex items-center justify-center gap-x-2">
                          <label className="text-gray-500 text-xs">
                            {' '}
                            تایخ پایان جمع آوری وجوه :
                          </label>{' '}
                          <span className="text-gray-500 text-sm font-semibold ">
                            {orderPreview?.plan?.underwritingEndDate &&
                              DateFunction2.getDate(orderPreview?.plan?.underwritingEndDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {response ? (
                      response == 'success' ? (
                        <div className="w-[70%] h-[48px] rounded-md  border border-green-500 text-center justify-center flex items-center  text-green-500  ">
                          ثبت شد
                        </div>
                      ) : (
                        <div className="w-[70%] h-[48px] rounded-md  border border-red-500 text-center justify-center flex items-center  text-red-500  ">
                          خطا ! ثبت ناموفق{' '}
                        </div>
                      )
                    ) : (
                      <div className="py-5 flex w-full justify-between items-center h-auto">
                        <button
                          onClick={UpdateStatus}
                          className={`w-[48%] flex justify-center items-center ${
                            isLoading ? 'border border-gray-500' : 'bg-green-500 '
                          }  h-[40px] rounded-md  text-center text-white `}>
                          {' '}
                          {isLoading ? <BouncingDotsLoader /> : 'ثبت'}
                        </button>
                        <button
                          className="w-[48%] flex justify-center items-center border border-gray-500 h-[40px] rounded-md  text-center text-gray-700 "
                          onClick={closeModal}>
                          انصراف{' '}
                        </button>
                      </div>
                    )}
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

export default RecieptUpdateStatusModal;
