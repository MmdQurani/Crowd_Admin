/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import Button from 'component/button/Button';
import { Fragment, useEffect, useState } from 'react';
import { DepositeReceiptReq } from 'pages/FinancialStatementsManagement/Api/FinancialStatementsReq';
import { AddToRolesReq, GetRolesReq, GetUserRoleReq } from 'pages/User/Api/UserReq';
import { toast } from 'react-toastify';

export default function AddRoleModal({ data, isOpen, setIsOpen }) {
  const [roles, setRoles] = useState();
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    GetRoles();
    data && GetUserRole();
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const GetRoles = async () => {
    const res = await GetRolesReq();
    //  userRole ? res?.filter((item) => item.name === );
    setRoles(res);
  };
  const GetUserRole = async () => {
    const res = await GetUserRoleReq(data?.id);
    setUserRole(res);
  };

  const FilterFunc = (item) => {
    return userRole?.length > 0 ? userRole?.filter((i) => i == item) : item;
  };

  const RoleName = (name) => {
    switch (name) {
      case 'Admin':
        return 'ادمین';
    }
  };

  const AddToRoles = async (rolename) => {
    const res = await AddToRolesReq(data?.username, rolename);
    if (res) {
      GetUserRole();
    } else {
      toast.error('مشکلی در اجرای درخواست شما پیش آمده است ');
    }
  };
  console.log('userrole');

  return (
    <>
      <Button
        name="افزودن سطح دسترسی "
        width=" min-w-[200px] w-auto "
        disable={true}
        func={openModal}
      />
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
                <Dialog.Panel className="w-full max-w-md transform  shadow-2xl overflow-hidden rounded-2xl b rounded-md p-6 text-left align-middle bg-white transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-base flex  font-medium leading-6 text-gray-500 py-5 text-start justify-between">
                    <p>سطح دسترسی را انتخاب کنید </p>
                    {/* <p
                      className="font-extrabold text-base cursor-pointer border-2 border-accent rounded-full h-6 w-6 text-center items-center inset-0  "
                      onClick={closeModal}>
                      {' '}
                      X{' '}
                    </p> */}
                  </Dialog.Title>
                  <div className="mt-2 py-7 flex justify-center">
                    {roles?.length === userRole?.length ? (
                      <p>تمام دسترسی ها برای این کاربر اعمال شده است </p>
                    ) : (
                      <>
                        {roles &&
                          roles?.map(
                            (item, index) =>
                              FilterFunc(item?.name)?.length > 0 && (
                                <button
                                  className={`p-2 rounded-md bg-gray-500 text-white w-1/2 `}
                                  key={index}
                                  onClick={() => AddToRoles(item?.name)}>
                                  {RoleName(item?.name)}
                                </button>
                              )
                          )}
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      name="بستن"
                      width="w-1/6"
                      disable={true}
                      func={closeModal}
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
