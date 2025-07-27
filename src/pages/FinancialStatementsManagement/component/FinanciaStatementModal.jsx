/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import {
  CreateFinancialStatementsManagementReq,
  UpdateFinancialStatementsManagementReq
} from '../Api/FinancialStatementsReq';
import { FinancialStatementsType } from './FinancialEnum';
import FileUploadPage from 'component/input/uploadInput';
import DataContext from 'comon/context/MainContext';

function FinanciaStatementModal({ type, isOpen, setIsOpen, data = false }) {
  const { allPlans } = useContext(DataContext);

  const [description, setDescription] = useState(); //
  const [investmentPlanId, setInvestmentPlanId] = useState(); //
  const [date, setDate] = useState(); //
  const [isPublic, setIsPublic] = useState(false); //
  const [doucumentsType, setDoucumentsType] = useState(); //
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
        setDoucumentsType();
        setIsPublic();
        setStatus();
        setInvestmentPlanId();
        setPath();
        closeModal();
      }, 3000);
  }, [response]);

  useEffect(() => {
    isOpen &&
      type == 2 &&
      (setTitle(data?.title),
      setDescription(data?.description),
      setDoucumentsType(FinancialStatementsType?.find((item) => item.key == data?.type)),
      setIsPublic(
        [
          { name: 'قابل مشاهده', key: true },
          { name: 'غیر قابل مشاهده', key: false }
        ]?.find((item) => item.key == data?.isPublic)
      ),
      setStatus(
        [
          { name: 'بارگذاری شده', key: 1 },
          { name: ' تایید شده', key: 2 },
          { name: 'رد شده', key: 3 }
        ]?.find((item) => item.key == data?.status)
      ),
      setDate(DateFunction2.getDate(data?.createDate)));
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  console.log('data', data);

  const convertDate = (date) => {
    if (date?.includes('T')) {
      return date?.split('T')?.[0];
    } else if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else {
      return date;
    }
  };

  const HandleFinancialStatementsManagementReq = async () => {
    setIsLoading(true);
    const handleRequest =
      type == 2
        ? UpdateFinancialStatementsManagementReq({
            description,
            financialStatementId: data?.id,
            status: status?.key,
            type: doucumentsType?.key,
            isPublic: isPublic?.key,
            title
          })
        : CreateFinancialStatementsManagementReq({
            description,
            type: doucumentsType?.key,
            investmentPlanId: investmentPlanId?.key,
            date: convertDate(date),
            title,
            path,
            isPublic: isPublic?.key
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
          className="w-[200px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-sm items-center   ">
          ایجاد
        </button>
      ) : (
        <button
          onClick={openModal}
          className="w-[100px] bg-accent-500 h-[30px] text-center flex justify-center rounded-md text-white text-sm items-center   ">
          ویرایش
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
                      {type == 1 ? 'ایجاد مستندات مالی' : 'ویرایش مستندات مالی'}
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
                        <label className=" text-xs   text-start"> نوع فایل</label>
                        <DropDown
                          height="h-[200px]"
                          arrey={FinancialStatementsType.filter((item) => item.key != null)}
                          select={doucumentsType}
                          setSelect={setDoucumentsType}
                        />
                      </div>
                      <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                        <label className=" text-xs  text-green-700  font-bold  text-start">
                          وضعیت نمایش{' '}
                        </label>
                        <DropDown
                          arrey={[
                            { name: 'قابل مشاهده', key: true },
                            { name: 'غیر قابل مشاهده', key: false }
                          ]}
                          select={isPublic}
                          setSelect={setIsPublic}
                        />
                      </div>
                      {type == 2 && (
                        <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                          <label className=" text-xs  text-green-700  font-bold  text-start">
                            وضعیت سند{' '}
                          </label>
                          <DropDown
                            arrey={[
                              { name: 'بارگذاری شده', key: 1 },
                              { name: ' تایید شده', key: 2 },
                              { name: 'رد شده', key: 3 }
                            ]}
                            select={status}
                            setSelect={setStatus}
                          />
                        </div>
                      )}
                      {type == 1 && (
                        <>
                          <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                            <label className=" text-xs   text-start"> طرح</label>
                            <DropDown
                              arrey={allPlans}
                              select={investmentPlanId}
                              setSelect={setInvestmentPlanId}
                            />
                          </div>
                          <div className="w-[28%] flex flex-col gap-y-1 items-start ">
                            <label className=" text-xs   text-start"> طرح</label>
                            <FileUploadPage
                              setFileAddress={setPath}
                              id={1}
                              requiresSigning={true}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className=" w-full flex flex-col items-start  justify-start h-auto gap-y-1 ">
                      <label htmlFor="startDate" className=" text-xs  ">
                        توضیحات
                      </label>
                      <textarea
                        className="w-full h-[100px] pr-2 text-start border border-gray-300 text-sm rounded-md resize-none "
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      />
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
                          onClick={HandleFinancialStatementsManagementReq}
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
