/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import {
  CreateInverstmentCalendarReq,
  UpdateInverstmentCalendarReq
} from '../Api/InverstmentCalendar';
import DataContext from 'comon/context/MainContext';

function FinanciaStatementModal({ type, isOpen, setIsOpen, data = false }) {
  const { allPlans } = useContext(DataContext);

  const [description, setDescription] = useState(); //
  const [investmentPlanId, setInvestmentPlanId] = useState(); //
  const [date, setDate] = useState(); //
  const [title, setTitle] = useState(); //
  const [path, setPath] = useState(null); //
  const [status, setStatus] = useState(); //
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    response &&
      setTimeout(() => {
        setResponse(false);
        setDescription('');
        setTitle('');
        setStatus();
        setInvestmentPlanId();
        setPath();
        closeModal();
      }, 1000);
  }, [response]);

  useEffect(() => {
    isOpen &&
      type == 2 &&
      (setTitle(data?.title),
      setDescription(data?.description),
      setStatus(data?.status ? { name: 'تایید شده', key: true } : { name: 'رد شده', key: false }),
      setDate(DateFunction2.getDate(data?.date)));
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const convertDate = (date) => {
    if (date?.includes('T')) {
      return date?.split('T')?.[0];
    } else if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else {
      return date;
    }
  };

  const HandleInverstmentCalendarReq = async () => {
    setIsLoading(true);
    const handleRequest =
      type == 2
        ? UpdateInverstmentCalendarReq({
            planTimelineId: data?.id,
            status: status?.key,
            date: convertDate(date),
            title: title
          })
        : CreateInverstmentCalendarReq({
            status: status?.key,
            date: convertDate(date),
            title: title,
            planId: investmentPlanId?.key
          });
    const res = await handleRequest;
    if (res) {
      setResponse('success');
    } else {
      setResponse('failed');
    }
    setIsLoading(false);
  };

  return (
    <>
      {type == 1 ? (
        <button
          onClick={openModal}
          className="w-[200px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-xs items-center   ">
          ایجاد تقویم سرمایه گذاری
        </button>
      ) : (
        <button
          onClick={openModal}
          className="w-[150px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-xs items-center   ">
          ویرایش تقویم سرمایه گذاری
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
                      {type == 1 ? 'ایجاد تقویم سرمایه گذاری' : 'ویرایش تقویم سرمایه گذاری'}
                    </span>
                  </Dialog.Title>
                  <div className="h-full w-full flex flex-col  items-center justify-between gap-5 p-5">
                    <div className="w-full flex flex-wrap gap-5 h-auto justify-between ">
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="startDate" className=" text-xs  ">
                          عنوان
                        </label>
                        <input
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          className="w-full pr-3 h-[40px] border border-gray-300 text-sm rounded-md"
                        />
                      </div>{' '}
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="startDate" className=" text-xs  ">
                          تاریخ{' '}
                        </label>
                        <DatePickerPersian onchange={setDate} value={date} />
                      </div>
                      <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                        <label className=" text-xs   text-start">وضعیت </label>
                        <DropDown
                          arrey={[
                            { name: 'رد شده', key: false },
                            { name: 'تایید شده', key: true }
                          ]}
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
                          onClick={HandleInverstmentCalendarReq}
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

export default FinanciaStatementModal;
