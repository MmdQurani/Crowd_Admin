/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import {
  CreateScheduledPaymentsReq,
  UpdateScheduledPaymentsReq
} from '../Api/ScheduledPaymentsReq';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import { scheduledPaymentsManagementStatus } from 'component/db/PlanStatusEnum';
import DataContext from 'comon/context/MainContext';

function CreateAndEditScheduledPaymentsModal({ id, type, isOpen, setIsOpen, data = false }) {
  const { allPlans } = useContext(DataContext);

  const [estimatedPayoutDate, setEstimatedPayoutDate] = useState();
  const [estimatedPayoutPercentage, setEstimatedPayoutPercentage] = useState();
  const [investeeDepositDate, setInvesteeDepositDate] = useState();
  const [achievedPayoutPercentage, setAchievedPayoutPercentage] = useState();
  const [investmentPlanId, setInvestmentPlanId] = useState();
  const [status, setStatus] = useState();
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isOpen &&
      type == 2 &&
      (setEstimatedPayoutPercentage(data?.estimatedPayoutPercentage * 100),
      setAchievedPayoutPercentage(data?.achievedPayoutPercentage * 100),
      setEstimatedPayoutDate(
        data?.estimatedPayoutDate && DateFunction2.getDate(data?.estimatedPayoutDate)
      ),
      setInvesteeDepositDate(
        data?.investeeDepositDate && DateFunction2.getDate(data?.investeeDepositDate)
      ),
      setInvestmentPlanId(data?.investmentPlanId),
      setStatus(
        data?.status &&
          [
            { name: 'درانتظار', key: 1 },
            { name: 'تایید شده', key: 2 },
            { name: 'رد شده', key: 3 }
          ]?.find((item) => item?.key == data?.status)
      ));
  }, [isOpen]);

  console.log(isOpen, type);

  useEffect(() => {
    response &&
      setTimeout(() => {
        setResponse(false);
        setIsOpen(false);
      }, 3000);
    !isOpen &&
      (setEstimatedPayoutPercentage(),
      setAchievedPayoutPercentage(),
      setEstimatedPayoutDate(),
      setInvesteeDepositDate(),
      setInvestmentPlanId(),
      setStatus());
  }, [response, isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  console.log(data);

  const convertDate = (date) => {
    if (date?.includes('T')) {
      return date?.split('T')?.[0];
    } else if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else {
      return date;
    }
  };

  const HandleSheduledRequets = async () => {
    setIsLoading(true);
    const handleRequest =
      type == 2
        ? UpdateScheduledPaymentsReq({
            scheduledPaymentId: id,
            estimatedPayoutDate: convertDate(estimatedPayoutDate),
            estimatedPayoutPercentage: estimatedPayoutPercentage / 100,
            investeeDepositDate: convertDate(investeeDepositDate),
            achievedPayoutPercentage: achievedPayoutPercentage / 100,
            status: status?.key
          })
        : CreateScheduledPaymentsReq({
            estimatedPayoutDate: convertDate(estimatedPayoutDate),
            estimatedPayoutPercentage: estimatedPayoutPercentage / 100,
            investeeDepositDate: convertDate(investeeDepositDate),
            achievedPayoutPercentage: achievedPayoutPercentage / 100,
            status: status?.key,
            investmentPlanId: investmentPlanId?.key
          });
    const res = await handleRequest;
    if (res) {
      setResponse('success');
    } else {
      setResponse('failed');
    }
    setIsLoading(false);
  };

  const disabled = Boolean(
    estimatedPayoutPercentage &&
      estimatedPayoutDate &&
      status &&
      (type == 1 ? investmentPlanId : id)
  );

  return (
    <>
      {type == 1 ? (
        <button
          onClick={openModal}
          className="w-[200px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-sm items-center   ">
          ایجاد برنامه واریز سود
        </button>
      ) : (
        <button
          onClick={openModal}
          className="w-[200px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-sm items-center   ">
          ویرایش برنامه واریز سود
        </button>
      )}
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
                <Dialog.Panel className="w-[1000px]  transform  shadow-2xl overflow-hidden rounded-lg p-6 text-left align-middle bg-white transition-all gap-y-5 h-[500px] flex flex-col items-center justify-between ">
                  <Dialog.Title
                    as="h3"
                    className="text-base flex  font-normal leading-6 text-accent text-start justify-between w-full">
                    <span className="w-full border-b-2 border-accent-500 pb-2">
                      {type == 1 ? 'ایجاد برنامه واریز سود' : 'ویرایش برنامه واریز سود'}
                    </span>
                  </Dialog.Title>

                  <div className="h-full w-full flex flex-col  items-center justify-between gap-5 p-5">
                    <div className="w-full flex flex-wrap gap-5 h-auto justify-between ">
                      {' '}
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="symbol" className=" text-xs  ">
                          درصد تخمینی پرداخت سود{' '}
                        </label>
                        <input
                          onChange={(e) => setEstimatedPayoutPercentage(e.target.value)}
                          value={estimatedPayoutPercentage}
                          className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                        />
                      </div>
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="startDate" className=" text-xs  ">
                          تاریخ تخمینی پرداخت سود{' '}
                        </label>
                        <DatePickerPersian
                          onchange={setEstimatedPayoutDate}
                          value={estimatedPayoutDate}
                        />
                      </div>
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="startDate" className=" text-xs  ">
                          تاریخ واریز محقق شده(اختیاری)
                        </label>
                        <DatePickerPersian
                          onchange={setInvesteeDepositDate}
                          value={investeeDepositDate}
                        />
                      </div>
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="symbol" className=" text-xs  ">
                          درصد واریز محقق شده(اختیاری)
                        </label>
                        <input
                          onChange={(e) => setAchievedPayoutPercentage(e.target.value)}
                          value={achievedPayoutPercentage}
                          className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                        />
                      </div>
                      <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                        <label className=" text-xs   text-start"> وضعیت</label>
                        <DropDown
                          arrey={scheduledPaymentsManagementStatus}
                          height="h-[200px]"
                          select={status}
                          setSelect={setStatus}
                        />
                      </div>
                      {type == 1 && (
                        <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                          <label className=" text-xs   text-start"> طرح</label>
                          <DropDown
                            arrey={allPlans}
                            select={investmentPlanId}
                            setSelect={setInvestmentPlanId}
                          />
                        </div>
                      )}
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
                          disabled={!disabled}
                          className={`w-[48%] flex justify-center items-center ${
                            disabled ? 'opacity-100' : ' opacity-50'
                          } ${
                            isLoading ? 'border border-gray-500' : 'bg-green-500 '
                          }  h-[40px] rounded-md  text-center text-white `}
                          onClick={HandleSheduledRequets}>
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

export default CreateAndEditScheduledPaymentsModal;
