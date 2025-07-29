/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import Button from 'component/button/Button';
import { Fragment, useState } from 'react';
import { GetImpersonateTokenReq } from 'pages/User/Api/UserReq';
import getBaseUrl from 'component/Axios/getBaseUrl';
import { toast } from 'react-toastify';

export default function ImpersonateModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState();

  const baseUrl = getBaseUrl();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const GetImpersonateToken = async () => {
    const res = await GetImpersonateTokenReq({ username });
    if (res?.token) {
      window.open(baseUrl + `impersonate/?token=${res?.token}`);
    } else {
      toast.error('خطا! ورودی ها درست نمی باشد ');
    }
  };
  const disable = Boolean(username?.length == 10) || Boolean(username?.length == 11);

  return (
    <>
      <button
        className="text-white w-full bg-accent hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        onClick={openModal}>
        ورود به صفحه کاربر
      </button>
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
                <Dialog.Panel className="w-full flex flex-col items-center justify-center gap-y-3 max-w-md transform shadow-2xl overflow-hidden h-[250px] text-left align-middle rounded-lg transition-all  bg-white ">
                  <Dialog.Title
                    as="h3"
                    className="text-sm w-[90%] flex  font-medium leading-6 text-gray-500 text-start justify-between">
                    <p>کدملی مورد نظر را وارد کنید </p>
                    <p
                      className=" text-sm cursor-pointer h-7 w-fit text-center  inset-0  px-3 border border-gray-500 rounded-md  flex justify-center items-center  "
                      onClick={closeModal}>
                      {' '}
                      بستن
                    </p>
                  </Dialog.Title>
                  <div className="mt-2 p-1">
                    <div className="flex justify-center w-full">
                      <div className="relative" style={{ direction: 'rtl' }}>
                        <div className="text-border relative z-10 " style={{ direction: 'rtl' }}>
                          <label
                            className="text-label font-normal  bg-light text-dominant-500 px-2 flex"
                            style={{ direction: 'rtl' }}>
                            نام کاربری
                          </label>
                        </div>
                        <input
                          className="h-[42px] rounded bg-gray-100 px-4 text-6 text-dominant direction-ltr text-right border-2  border-gray-400 focus:outline-none  focus:ring-0"
                          value={username}
                          placeholder="نام کاربری کاربر را وارد کنید "
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    name="ورود"
                    width="w-[50%]"
                    disable={disable}
                    func={GetImpersonateToken}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
