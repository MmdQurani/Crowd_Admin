/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';
import DropDown from 'component/DropDown/DropDown';
import FindUser from 'component/AutoComplete/FindUser';
import FileUploadPage from 'component/input/uploadInput';
import { GetPlanDetailsReq } from 'pages/Plans/Api/PlanReq';
import { CreateUserOrderReq, OfflinePaymentManagementReq } from '../Api/userOrderReq';
import DataContext from 'comon/context/MainContext';

function CreateOredrForUserModal({ isOpen, setIsOpen }) {
  const { allPlans } = useContext(DataContext);

  const [unitCount, setUnitCount] = useState();
  const [planDetails, setPlanDetails] = useState();
  const [receipt, setReceipt] = useState();
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [planId, setPlanId] = useState();

  useEffect(() => {
    planId && GetPlanDetails();
  }, [planId]);

  useEffect(() => {
    response &&
      setTimeout(() => {
        setResponse(false);
        setIsOpen(false);
      }, 3000);
    setUnitCount('');
    setUserId('');
    setPlanId('');
  }, [response, isOpen]);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const GetPlanDetails = async () => {
    const res = await GetPlanDetailsReq(planId?.key);
    if (res) {
      setPlanDetails(res);
    } else {
      setPlanDetails(false);
    }
  };
  console.log(planDetails);

  const OfflinePaymentManagement = async (walletFlowId) => {
    const res = await OfflinePaymentManagementReq({
      amount: unitCount * planDetails?.unitAmount,
      walletFlowId,
      filePath: receipt,
      userId: userId
    });
    if (res) {
      setResponse('success');
    } else {
      setResponse('error');
    }
  };

  const CreateUserOrder = async () => {
    setIsLoading(true);
    const res = await CreateUserOrderReq({
      investmentPlanId: planId?.key,
      unitCount: unitCount,
      userId
    });
    if (res) {
      OfflinePaymentManagement(res?.walletFlowId);
    } else {
      setResponse('error');
    }
    setIsLoading(false);
  };

  const disabled = Boolean(userId && unitCount && planId);

  return (
    <>
      <button
        onClick={openModal}
        className="w-[200px] bg-accent-500 h-[40px] text-center flex justify-center rounded-md text-white text-sm items-center mt-5  ">
        ایجاد سفارش برای کاربر
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
                <Dialog.Panel className="w-[1000px]  transform  shadow-2xl overflow-hidden rounded-lg p-6 text-left align-middle bg-white transition-all gap-y-5 h-[500px] flex flex-col items-center justify-between ">
                  <Dialog.Title
                    as="h3"
                    className="text-base flex  font-normal leading-6 text-accent text-start justify-between w-full">
                    <span className="w-full border-b-2 border-accent-500 pb-2">
                      ایجاد سفارش برای کاربر
                    </span>
                  </Dialog.Title>

                  <div className="h-full w-full flex flex-col  items-center justify-between gap-5 p-5">
                    <div className="w-full flex flex-wrap gap-5 h-auto justify-between ">
                      {' '}
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="unit" className=" text-xs  ">
                          تعداد واحد{' '}
                        </label>
                        <input
                          id="unit"
                          onChange={(e) => setUnitCount(e.target.value)}
                          value={unitCount}
                          className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                        />
                      </div>
                      <div className="w-[28%] flex flex-col items-start  justify-start h-auto ">
                        {' '}
                        <FindUser setUserId={setUserId} userId={userId} />
                      </div>
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="unit" className=" text-xs  ">
                          طرح{' '}
                        </label>
                        <DropDown arrey={allPlans} select={planId} setSelect={setPlanId} />
                      </div>
                      <div className=" w-[28%] flex flex-col items-start  justify-start h-auto gap-y-1 ">
                        <label htmlFor="receipt" className=" text-xs  ">
                          رسید سفارش
                        </label>
                        <FileUploadPage
                          multiple={false}
                          setFileAddress={setReceipt}
                          id={0}
                          requiresSigning={true}
                        />
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
                          disabled={!disabled}
                          onClick={CreateUserOrder}
                          className={`w-[48%] flex justify-center items-center ${
                            disabled ? 'opacity-100' : ' opacity-50'
                          } ${
                            isLoading ? 'border border-gray-500' : 'bg-green-500 '
                          }  h-[40px] rounded-md  text-center text-white `}>
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

export default CreateOredrForUserModal;
