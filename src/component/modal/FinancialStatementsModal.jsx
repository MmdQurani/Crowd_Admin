/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import Button from 'component/button/Button';
import { Fragment, useEffect, useState } from 'react';
import { DepositeReceiptReq } from 'pages/FinancialStatementsManagement/Api/FinancialStatementsReq';

export default function FinancialStatementsModal({ id, username, Alert, setAlert, amount }) {
  let [isOpen, setIsOpen] = useState(false);

  // useEffect(() => setAmountChange(amount), []);
  console.log(amount);
  console.log(id, username);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const DepositeReceipt = async () => {
    const res = await DepositeReceiptReq({
      nationalId: username,
      amountChange: Number(amount),
      description: `شماره سند : ${id}`,
      financialStatementId: id
    });
    if (res) {
      setAlert({ color: 'text-satisfication-85', des: 'افزازش اعتبار موفق' });
      setTimeout(() => {
        closeModal();
      }, 1000);
    } else {
      setAlert({ color: 'text-satisfication-60', des: 'افزازش اعتبار ناموفق' });
    }

    console.log(res?.token);
  };
  const disable = Boolean(username);

  return (
    <>
      <div className="text-satisfication-60">
        <Button name="افزایش اعتبار" width="w-full" disable={true} func={openModal} />
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform  shadow-2xl overflow-hidden rounded-2xl  bg-white p-6 text-left align-middle rounded-lg transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg flex  font-medium leading-6 text-accent-300 text-start justify-between">
                    <p>مبلغ مورد تاییدتان را وارد کنید </p>
                    <p
                      className="font-extrabold text-base cursor-pointer border-2 border-accent rounded-full h-6 w-6 text-center items-center inset-0  "
                      onClick={closeModal}>
                      {' '}
                      X{' '}
                    </p>
                  </Dialog.Title>
                  <div className="mt-2 pt-5 w-full">
                    <div className="flex justify-center w-full">
                      <div
                        className="w-full justify-center flex relative"
                        style={{ direction: 'rtl' }}>
                        <div className="h-[48px] rounded border-2 border-dominant-200 bg-gray-100 px-4 text-6 text-dominant items-center flex justify-center  w-4/5 ">
                          {amount} <p className="text-xs pr-1">(ریال)</p>
                        </div>
                        <div className=" flex justify-start pt-3">
                          {Alert ? (
                            <p className={`text-sm ${Alert?.color} font-bold`}>{Alert?.des}</p>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      name="تایید"
                      width="w-1/5"
                      disable={disable}
                      func={DepositeReceipt}
                    />
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
