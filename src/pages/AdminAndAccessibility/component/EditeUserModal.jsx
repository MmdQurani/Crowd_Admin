/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import axios from 'axios';
import getBaseUrl from 'component/Axios/getBaseUrl';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { toast } from 'react-toastify';

function EditeUserModal({ setEditeUser, token, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [accessibility, setAccessibility] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [isloading, setIsloading] = useState({});

  useEffect(() => {
    isOpen && GetPolicies();
  }, [isOpen]);

  useEffect(() => {
    data?.policies && setAccessibility([...(data?.policies || [])]);
  }, [data]);

  const GetPolicies = async () => {
    setIsloading('policies', true);
    try {
      const res = await axios.get(getBaseUrl() + 'AccountsManagement/GetPolicies', {
        headers: { Authorization: 'Bearer  ' + token }
      });
      setAllPolicies(res?.data?.data);
    } catch (er) {
      setAllPolicies(false);
    } finally {
      setIsloading('policies', false);
    }
  };

  console.log(allPolicies);

  const RemoveUserFromPolicy = async (policyId) => {
    try {
      await axios.post(
        getBaseUrl() + 'AccountsManagement/RemoveUserFromPolicy',
        { userId: data?.userId, policyId: policyId },
        {
          headers: { Authorization: 'Bearer  ' + token }
        }
      );
    } catch (er) {
      toast.error('خطایی در انجام درخواست شما رخ داده است لطفا کمی دیگر تلاش کنید ');
    }
  };

  const AddUserToPolicy = async (policyId) => {
    try {
      await axios.post(
        getBaseUrl() + 'AccountsManagement/AddUserToPolicy',
        { userId: data?.userId, policyId: policyId },
        {
          headers: { Authorization: 'Bearer  ' + token }
        }
      );
    } catch (er) {
      toast.error('خطایی در انجام درخواست شما رخ داده است لطفا کمی دیگر تلاش کنید ');
    }
  };

  const RemoveFromRole = async () => {
    setIsloading('remove', true);
    try {
      await axios.post(
        getBaseUrl() +
          `AccountsManagement/RemoveFromRole?nationalId=${data?.username}&roleName=Admin`,
        {},
        {
          headers: { Authorization: 'Bearer  ' + token }
        }
      );
      toast.success(' دسترسی ادمین کاربر مورد نظر با موفقیت برداشته شد ');
      closeModal();
    } catch (er) {
      toast.error('خطایی در انجام درخواست شما رخ داده است لطفا کمی دیگر تلاش کنید ');
    } finally {
      setIsloading('remove', false);
    }
  };

  function closeModal() {
    setIsOpen(false);
    setEditeUser(false);
  }

  function openModal() {
    setIsOpen(true);
    setEditeUser(data);
  }

  const hasAccessibility = (key) => accessibility?.includes(key);

  const handleAssignmentAccessibility = (id) => {
    const hasAccess = hasAccessibility(id);
    console.log(hasAccessibility(id));

    if (hasAccess) {
      setAccessibility((prev) => prev.filter((item) => item !== id));
      RemoveUserFromPolicy(id);
    } else {
      setAccessibility((prev) => [...prev, id]);
      AddUserToPolicy(id);
    }
  };

  console.log(accessibility, hasAccessibility(41));
  return (
    <>
      <button
        onClick={openModal}
        className=" text-accent  hover:underline-offset-8 hover:underline hover:text-green-800 text-sm  cursor-pointer">
        {' '}
        ویرایش دسترسی ها{' '}
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
                <Dialog.Panel
                  dir="rtl"
                  className="w-[1000px]  transform  shadow-2xl overflow-hidden rounded-lg p-6 text-left align-middle bg-white transition-all gap-y-5 min-h-[500px] h-auto flex flex-col items-center justify-between ">
                  <div className="w-full flex flex-col justify-between items-center gap-y-5 h-auto ">
                    <span className="w-full justify-start items-center text-start text-base text-gray-800 border-b border-accent-500 py-3 ">
                      کاربر : {data?.title}
                    </span>

                    <div className=" w-full flex justify-between items-center border-b border-accent-500 py-3 h-auto">
                      <span className="w-auto text-base  text-gray-700  ">حذف کاربر :</span>
                      <button
                        onClick={RemoveFromRole}
                        disabled={isloading?.remove}
                        className=" w-[20%] text-red-600 border border-red-600 text-center font-medium flex justify-center items-center h-[38px] rounded-lg   text-base ">
                        {isloading?.remove ? <BouncingDotsLoader /> : 'حذف'}{' '}
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center min-h-[200px] relative  h-auto gap-y-5  ">
                      {' '}
                      {isloading?.policies ? (
                        <BouncingDotsLoader />
                      ) : (
                        <>
                          <span className="w-auto text-sm font-medium text-gray-700  ">
                            دسترسی های مدنظر خود را برای کاربر مورد نظر انتخاب کنید{' '}
                          </span>
                          <div className="w-full flex flex-wrap justify-start gap-x-1 h-auto gap-y-5 border-b border-accent-500 py-2  ">
                            {allPolicies?.map((item, index) => (
                              <div
                                key={index}
                                onClick={() => handleAssignmentAccessibility(item?.id)}
                                className="w-auto cursor-pointer flex justify-start gap-x-2 items-center border border-gray-500 p-2  rounded-md  ">
                                <span className="w-auto text-sm text-gray-500">{item?.title}</span>
                                <input
                                  type="checkbox"
                                  checked={hasAccessibility(item?.id)}
                                  onClick={() => handleAssignmentAccessibility(item?.id)}
                                  className="w-4 h-4 rounded-md  focus:outline-none focus:ring-0 border border-accent-600 text-green-600  "
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={closeModal}
                      className=" w-[50%] text-gray-600 border border-gray-600 text-center font-medium flex justify-center items-center h-[42px] rounded-lg   text-base ">
                      {' '}
                      بستن{' '}
                    </button>
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

export default EditeUserModal;
