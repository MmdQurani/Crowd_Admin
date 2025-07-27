/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import Button from 'component/button/Button';
import { Fragment, useEffect, useState } from 'react';
import { DepositeReceiptReq } from 'pages/FinancialStatementsManagement/Api/FinancialStatementsReq';
import { GetUserWalletBalanceReq } from '../Api/UserReq';

export default function DepositModal({ username, setWalletBalance, id }) {
  let [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState();
  const [explain, setExplain] = useState();
  const [Alert, setAlert] = useState();
  console.log(username);

  useEffect(() => {
    setAmount();
    setExplain();
    setAlert();
  }, [isOpen]);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const DepositeReceipt = async () => {
    const res = await DepositeReceiptReq({
      nationalId: username,
      amount: Number(amount),
      description: explain
    });
    if (res) {
      GetUserWalletBalance();
      setAlert({ color: 'text-satisfication-85', des: 'افزازش اعتبار موفق' });
      setTimeout(() => {
        setAlert();
        setAmount();
        setExplain();
        closeModal();
      }, 1000);
    } else {
      setAlert({ color: 'text-satisfication-60', des: 'افزازش اعتبار ناموفق' });
    }
    console.log(res?.token);
  };

  const GetUserWalletBalance = async () => {
    const res = await GetUserWalletBalanceReq({ userId: id });
    setWalletBalance(res?.data);
  };

  const disable = Boolean(amount) && Boolean(explain);
  console.log(disable);

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
                <Dialog.Panel className="w-full max-w-md transform  shadow-2xl overflow-hidden rounded-2xl rounded-md p-6 text-left align-middle bg-white transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg flex  font-medium leading-6 text-gray-500 text-start justify-between">
                    <p>مبلغ مورد تاییدتان را وارد کنید </p>
                    <p
                      className="font-extrabold text-base cursor-pointer border-2 border-gray-500 rounded-full h-6 w-6 text-center items-center inset-0  "
                      onClick={closeModal}>
                      {' '}
                      X{' '}
                    </p>
                  </Dialog.Title>
                  <div className="mt-2 pt-5">
                    <div className="flex justify-end w-full flex-col  gap-y-5">
                      <div className="relative flex flex-col " style={{ direction: 'rtl' }}>
                        <div className="text-border relative z-10 " style={{ direction: 'rtl' }}>
                          <label
                            className="text-label font-normal  bg-light text-dominant-500 px-2 flex"
                            style={{ direction: 'rtl' }}>
                            مبلغ مورد تایید{' '}
                          </label>
                        </div>
                        <input
                          className="h-[48px] rounded border border-dominant-200 bg-gray-100 px-4 text-6 text-dominant direction-ltr text-right focus:outline-none  focus:ring-0"
                          value={amount}
                          placeholder="مبلغ به ریال"
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="relative flex flex-col" style={{ direction: 'rtl' }}>
                        <div className="text-border relative z-10 " style={{ direction: 'rtl' }}>
                          <label
                            className="text-label font-normal  bg-light text-dominant-500 px-2 flex"
                            style={{ direction: 'rtl' }}>
                            توضیحات{' '}
                          </label>
                        </div>
                        <textarea
                          className="h-[80px] rounded border border-dominant-200 bg-gray-100 px-4 text-6 text-dominant direction-ltr text-right focus:outline-none  focus:ring focus:ring-accent"
                          value={explain}
                          placeholder="توضیحات"
                          onChange={(e) => setExplain(e.target.value)}
                        />
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
                      name="ثبت"
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
