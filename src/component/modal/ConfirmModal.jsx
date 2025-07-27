/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import { UpdateWalletFlowStatusReq } from 'pages/transactions/Api/transactionReq';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';

export default function ConfirmModal({ id, Alert, type, setAlert, setModalStatus }) {
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
    setModalStatus(false);
  }

  function openModal() {
    setIsOpen(true);
    setModalStatus(true);
  }

  const UpdateWallFlowetStatus = async (walletFlowId, status) => {
    const res = await UpdateWalletFlowStatusReq({
      walletFlowId,
      status
    });
    if (res) {
      setAlert(true);
      closeModal();
    } else {
      toast.warning('عملیات انجام نشد ');
    }
  };

  // const DepositeReceipt = async () => {
  //   const res = await DepositeReceiptReq({
  //     amountChange: Number(amount),
  //     description: `شماره سند : ${id}`,
  //     financialStatementId: id
  //   });
  //   if (res) {
  //     setAlert({ color: 'text-satisfication-85', des: 'افزازش اعتبار موفق' });
  //     setTimeout(() => {
  //       closeModal();
  //     }, 1000);
  //   } else {
  //     setAlert({ color: 'text-satisfication-60', des: 'افزازش اعتبار ناموفق' });
  //   }

  //   console.log(res?.token);
  // };
  console.log(type);
  return (
    <>
      <>
        <button
          className="rounded-lg  bg-satisfication-85 text-white  px-4 py-2"
          onClick={() => openModal(1)}>
          تایید
        </button>
      </>
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
                    <p className="text-gray-900">آیا از تایید این تراکنش مطمعن هستید !!</p>
                    <p
                      className="font-extrabold text-base cursor-pointer border-2 border-accent rounded-full h-6 w-6 text-center items-center inset-0  "
                      onClick={closeModal}>
                      {' '}
                      X{' '}
                    </p>
                  </Dialog.Title>
                  <div className="mt-2 pt-5 w-full">
                    <div className="flex justify-center w-full"></div>
                  </div>

                  <div className="mt-4">
                    <>
                      <button
                        className="rounded-lg  bg-satisfication-85 text-white  px-4 py-2"
                        onClick={() => {
                          UpdateWallFlowetStatus(id, 2);
                        }}>
                        تایید{' '}
                      </button>
                    </>
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
