/* eslint-disable no-unused-vars */
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DropDown from 'component/DropDown/DropDown';
import Axios from 'component/Axios/Axios';

function MainModal({ type, data, Formstatus, response, setResponse, StatusEnum }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState(data?.note || '');
  const [status, setStatus] = useState();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const ChangeFormStatus = async () => {
    setIsLoading(true);
    await Axios.patch(
      `/PlanReviewRequestManagement/UpdateStatus?id=${data?.id}&status=${status?.key}`,
      {}
    )
      .then(() => setResponse('success'))
      .catch(() => setResponse('faield'))
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setResponse(false);
          setIsOpen(false);
        }, 1500);
      });
  };
  const CreateNote = async () => {
    setIsLoading(true);
    await Axios.put('PlanReviewRequestManagement/Update', { id: data?.id, note: note })
      .then(() => setResponse('success'))
      .catch(() => setResponse('faield'))
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setResponse(false);
          setIsOpen(false);
        }, 1500);
      });
  };

  const ItemsFinder = (array, id, key) => array?.find((item) => item?.[key] == id);

  console.log(!note, data?.note == note);

  return (
    <>
      {type == 1 ? (
        <button
          onClick={openModal}
          className=" w-fit hover:underline underline-offset-8 font-normal text-accent-500 text-center flex justify-center border-none focus:outline-none focus:ring-0 focus:border-none  text-xs items-center   ">
          مشاهده
        </button>
      ) : (
        <button
          onClick={openModal}
          className=" w-fit hover:underline underline-offset-8 font-normal text-accent-500 text-center flex justify-center border-none focus:outline-none focus:ring-0 focus:border-none  text-xs items-center   ">
          {type == 3 ? ' مشاهده/ایجاد' : ' مشاهده'}
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
                      {type == 1
                        ? `توضیحات  ( شرکت: ${data?.companyName} ) `
                        : type == 2
                          ? `ویرایش  ( شرکت: ${data?.companyName} ) `
                          : `نظرات برای  شرکت: ${data?.companyName}  `}
                    </span>
                  </Dialog.Title>
                  {/*  main part  */}
                  {type == 1 && (
                    <p className="w-[95%] h-auto min-h-[300px] max-h-[320px] overflow-y-auto text-justify text-sm font-normal text-gray-500    ">
                      {data?.proposalDescription}
                    </p>
                  )}
                  {type == 2 && (
                    <div className="w-full flex flex-col items-center justify-start  h-[300px] gap-y-5  ">
                      <span
                        className={` ${
                          ItemsFinder(StatusEnum, data?.status, 'key')?.color
                        } text-sm font-semibold text-center `}>
                        وضعیت فعلی درخواست :{' '}
                        {ItemsFinder(StatusEnum, data?.status, 'key')?.name || 'نامشخص'}{' '}
                      </span>
                      <DropDown
                        arrey={StatusEnum}
                        select={status}
                        setSelect={setStatus}
                        width="w-[30%]"
                      />
                    </div>
                  )}
                  {type == 3 && (
                    <div className="w-full flex justify-center items-center h-auto ">
                      <textarea
                        className="w-[80%] rounded-lg text-start pr-3 border text-sm  border-green-700 focus:border-green-700 resize-none h-[180px] focus:outline-none focus:ring-0 placeholder:text-xs"
                        placeholder="نکته و نظر خود را واردکنید  ...  "
                        maxLength={450}
                        dir="rtl"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="w-full flex flex-col items-center justify-end  gap-y-5 h-auto ">
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
                      <div className="py-5 flex w-[80%] justify-center  items-center h-auto gap-x-5">
                        {(type == 2 || type == 3) && (
                          <button
                            disabled={type == 2 ? !status : !note && data?.note == note}
                            onClick={type == 2 ? ChangeFormStatus : CreateNote}
                            className={`w-[48%] flex justify-center items-center ${
                              (type == 2 ? !status : !note && data?.note == note) && 'opacity-50'
                            } ${
                              isLoading ? 'border border-gray-500' : 'bg-green-500 '
                            }  h-[40px] rounded-md  text-center text-white `}>
                            {' '}
                            {isLoading ? <BouncingDotsLoader /> : 'ثبت'}
                          </button>
                        )}
                        <button
                          className="w-[48%] flex justify-center items-center border border-gray-500 h-[40px] rounded-md  focus:outline-none focus:ring-0  text-center text-gray-700 "
                          onClick={closeModal}>
                          بستن{' '}
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

export default MainModal;
