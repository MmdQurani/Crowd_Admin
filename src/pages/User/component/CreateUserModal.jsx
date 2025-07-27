/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import CountdownTimer from 'component/NewTimer/Timer';
import { CreateSejamOtpReq, UserRegisterReq } from '../Api/UserReq';

function CreateUserModal({ isOpen, setIsOpen }) {
  const [nationalId, setNationalId] = useState();
  const [otp, setOtp] = useState();
  const [sejamCodeStatus, setSejamCodeStatus] = useState();
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  function closeModal() {
    setIsOpen(false);
    setNationalId('');
    setOtp('');
    setSejamCodeStatus(false);
    setResponse(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  useEffect(() => {
    setTimeout(() => {
      setTimer(0);
      setSejamCodeStatus(false);
      setResponse(false);
      setNationalId('');
      setOtp('');
    }, 2000);
  }, [isOpen, response]);

  const SendSejamCode = async () => {
    setIsLoading(true);
    const response = await CreateSejamOtpReq({ nationalId });
    if (response) {
      setSejamCodeStatus('success');
      setTimer(2 * 60);
    } else {
      setSejamCodeStatus('failed');
    }
    setIsLoading(false);
  };

  const CreateUser = async () => {
    setIsLoading(true);
    const response = await UserRegisterReq({ nationalId, otp });
    if (response) {
      setResponse('success');
    } else {
      setResponse('failed');
    }
    setIsLoading(false);
  };

  const HandleOnChange = (e, stateSetter, maxLength = 13) => {
    let value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '');
    const truncatedValue = cleanedValue.slice(0, maxLength);
    e.target.value = truncatedValue;
    stateSetter(truncatedValue);
  };

  console.log('response', response);

  return (
    <>
      <button
        className="text-white border border-white rounded-md h-[40px] text-sm font-normal w-[150px]"
        onClick={openModal}>
        ثبت نام کاربر جدید
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
                <Dialog.Panel className="w-[500px]  transform  shadow-2xl overflow-hidden rounded-lg p-6 text-left align-middle bg-white transition-all gap-y-5 min-h-[300px] h-auto flex flex-col items-center justify-start ">
                  <Dialog.Title
                    as="h3"
                    className="text-base flex  font-normal leading-6 text-accent text-start justify-between w-full">
                    <span className="w-full border-b-2 border-accent-500 pb-2">
                      ثبت نام کاربر جدید
                    </span>
                  </Dialog.Title>

                  <div className="w-full flex flex-col gap-y-10 items-center justify-between h-full ">
                    <div
                      className={` w-[80%] flex flex-col gap-y-2 justify-between  h-auto ${
                        sejamCodeStatus == 'success' ? 'opacity-50' : ''
                      }`}>
                      <label className="text-xs text-gray-500 w-full items-start flex justify-start ">
                        کد ملی
                      </label>
                      <input
                        readOnly={sejamCodeStatus == 'success'}
                        type="text"
                        className="w-full h-[40px] rounded-md border border-gray-500 p-2 text-center placeholder:text-gray-400 placeholder:text-xs"
                        placeholder="کد ملی"
                        value={nationalId}
                        onChange={(e) => HandleOnChange(e, setNationalId)}
                      />
                    </div>
                    {sejamCodeStatus == 'success' && (
                      <div className=" w-[80%] flex flex-col gap-y-2 justify-between  h-auto">
                        <label className="text-xs text-gray-500 w-full items-start flex justify-start ">
                          کدارسالی از سجام
                        </label>
                        <input
                          type="text"
                          className="w-full h-[40px] rounded-md border border-gray-500 p-2 text-center placeholder:text-gray-400 placeholder:text-xs"
                          placeholder="کد را وارد کنید "
                          value={otp}
                          onChange={(e) => HandleOnChange(e, setOtp)}
                        />
                        <div className="w-full  flex items-center justify-center py-2 ">
                          {timer == 0 ? (
                            <button onClick={SendSejamCode} className="text-sm  text-red-500">
                              ارسال مجدد
                            </button>
                          ) : (
                            <CountdownTimer time={timer} setTime={setTimer} />
                          )}
                        </div>
                      </div>
                    )}
                    {sejamCodeStatus && sejamCodeStatus == 'failed' ? (
                      <div className="w-[80%] h-[40px] rounded-md    text-xs  text-center justify-center flex items-center  text-red-500  ">
                        مشکلی در ارسال کد ار سجام رخ داده است! در زمانی دیگر تلاش کنید
                      </div>
                    ) : (
                      sejamCodeStatus == 'success' && (
                        <div className="w-[80%] h-[40px] rounded-md    text-xs  text-center justify-center flex items-center  text-green-500  ">
                          کد ارسال شد
                        </div>
                      )
                    )}
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
                          onClick={sejamCodeStatus == 'success' ? CreateUser : SendSejamCode}
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

export default CreateUserModal;
