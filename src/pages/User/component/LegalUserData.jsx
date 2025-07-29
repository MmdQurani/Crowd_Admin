/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import {
  GetUserRoleReq,
  GetUserWalletBalanceReq,
  RemoveFromRoleReq,
  UpdateUserStatusReq
} from '../Api/UserReq';
import { getDate, getTime } from 'component/DateFunctions/DateFunctions';
import { useNavigate } from 'react-router';
import { ShareHolderPosition } from '../enum/shareHolder';
import { PositionType, StackHolder } from '../enum/stackHolder';
import { UpdateWalletStatusReq } from 'pages/Wallet/Api/walletReq';
import { toast } from 'react-toastify';
import AddRoleModal from 'component/modal/AddRoleModal';
import DataContext from 'comon/context/MainContext';

const LegalUserData = ({ details, statistics }) => {
  const { reload, setReload } = useContext(DataContext);
  const [walletBalance, setWalletBalance] = useState();
  const [Userrole, setUserRole] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    details && GetUserWalletBalance();
  }, [details]);

  console.log(details);

  useEffect(() => {
    details && GetUserRole();
  }, [isOpen, details]);

  const GetUserWalletBalance = async () => {
    const res = await GetUserWalletBalanceReq({ userId: details?.id });
    setWalletBalance(res?.data);
  };

  const UpdateWalletStatus = async (nationalId, status) => {
    const res = await UpdateWalletStatusReq({ nationalId, status });
    if (res) {
      GetUserWalletBalance();
      toast.success(' ثبت شد !');
    } else {
      toast.error(' عملیات ناموفق !');
    }
  };

  const GetUserRole = async () => {
    console.log(details?.id);
    const res = details && (await GetUserRoleReq(details?.id));
    if (res) {
      setUserRole(res);
    } else {
      setUserRole(false);
    }
  };
  const RemoveFromRole = async (rolename) => {
    const res = await RemoveFromRoleReq(details?.username, rolename);
    if (res) {
      GetUserRole();
    } else {
      toast.error('مشکلی در اجرای درخواست شما رخ داده استت');
    }
  };

  const RoleName = (name) => {
    switch (name) {
      case 'Admin':
        return 'ادمین';
    }
  };

  const UpdateUserStatus = async (status) => {
    const res = await UpdateUserStatusReq({
      userId: details?.id,
      isActive: status
    });
    if (res) {
      toast.success(' ثبت شد !');
    } else {
      toast.error(' عملیات ناموفق !');
    }
    setReload(!reload);
  };
  return (
    <div className="w-full flex flex-col gap-y-5 bg-red-600">
      <div className=" w-full flex justify-end ">
        {' '}
        <div
          className="w-fit
              h-1/3 flex flex-col justify-end">
          <a className="flex cursor-pointer" onClick={() => navigate(-1)}>
            <p className="text-gray-600 border-b border-accent text-sm  font-semibold ">بازگشت</p>
          </a>
        </div>
      </div>
      {/* company account data  */}
      <div className=" rounded-md  p-5 flex justify-between  ">
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent ">نام کاربری:</p>
          <p className="text-sm text-gray-600 ">{details?.username}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent ">آخرین ورود :</p>
          <p className="text-sm text-gray-600  ">
            در تاریخ {''}
            {statistics?.lastSuccessfullLoginAttempDate &&
              getDate(statistics?.lastSuccessfullLoginAttempDate)}
          </p>
          <p className="text-sm text-gray-600  ">
            و درساعت {''}
            {statistics?.lastSuccessfullLoginAttempDate &&
              getTime(statistics?.lastSuccessfullLoginAttempDate)}
          </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent ">IP آدرس:</p>
          <p className="text-sm text-gray-600 ">{statistics?.lastSuccessfullLoginAttempIp}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent ">تاریخ ایجاد حساب کاربری:</p>
          <p className="text-sm text-gray-600 ">
            {details?.createDate && getDate(details?.createDate)}
          </p>
        </div>
      </div>
      <div className=" rounded-md  p-5 flex justify-between ">
        <div className="flex gap-x-2 items-center  ">
          <p className="font-semibold text-accent">وضعیت کابر :</p>
          <p
            className={`text-base  text-gray-600   ${
              statistics?.isActive ? 'text-green-500' : 'text-red-500'
            }`}>
            {statistics?.isActive ? 'فعال' : 'غیرفعال'}
          </p>
        </div>
        <div className="flex gap-x-2   items-center">
          <p className="font-semibold text-accent">تغییر وضعیت کاربر:</p>
          <button
            className={`${
              statistics?.isActive
                ? 'border border-red-500 text-red-500'
                : 'border border-green-500 text-green-500'
            }  px-2 rounded-md w-fit h-8 text-sm flex items-center justify-center text-center   `}
            onClick={() => UpdateUserStatus(!statistics?.isActive)}>
            {statistics?.isActive ? 'غیرفعال کردن کاربر' : 'فعال کردن کاربر'}
          </button>
        </div>
      </div>

      {/* company info  */}
      <div className="w-full p-5 flex flex-wrap justify-around gap-3">
        <div className="flex w-full justify-start">
          <p className="font-semibold pb-3 ">اطلاعات شرکت</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent ">نام شرکت:</p>
          <p className="text-sm text-gray-600 ">{details?.legalPerson?.companyName}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">کد اقتصادی :</p>
          <p className="text-sm text-gray-600   ">{details?.legalPerson?.economicCode}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">تاریخ تاسیس شرکت:</p>
          <p className="text-sm text-gray-600   ">
            {details?.legalPerson?.registerDate && getDate(details?.legalPerson?.registerDate)}{' '}
          </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">محل تاسیس شرکت:</p>
          <p className="text-sm text-gray-600   ">{details?.legalPerson?.registerPlace} </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">شماره ثبت:</p>
          <p className="text-sm text-gray-600   ">{details?.legalPerson?.registerNumber} </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">وب سایت شرکت:</p>
          <p className="text-sm text-gray-600">
            {details?.legalPerson?.website ? details?.legalPerson?.website : 'ندارد '}
          </p>
        </div>
      </div>
      {/* company bank account  info  */}
      <div className="w-full p-5 flex flex-wrap justify-between gap-3">
        <div className="flex w-full justify-start">
          <p className="font-semibold pb-3">اطلاعات حساب بانکی </p>
        </div>
        <div className="flex gap-x-1">
          <p className="font-semibold text-accent ">نام بانک : </p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.accounts[0]?.bank?.name}</p>
        </div>
        <div className="flex gap-x-1">
          <p className="font-semibold text-accent ">شماره حساب : </p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.accounts[0]?.accountNumber}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent"> شهر :</p>
          <p className="text-sm text-gray-600   ">{details?.accounts[0]?.branchCity?.name}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">نام شعبه :</p>
          <p className="text-sm text-gray-600   ">{details?.accounts[0]?.branchName} </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">کد شعبه :</p>
          <p className="text-sm text-gray-600   ">{details?.accounts[0]?.branchCode} </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">شماره شبا :</p>
          <p className="text-sm text-gray-600   ">{details?.accounts[0]?.sheba} </p>
        </div>
      </div>
      {/* company palce info  */}
      <div className="w-full rounded-lg p-5 flex flex-wrap justify-between gap-3">
        <div className="flex w-full justify-start">
          <p className="font-semibold pb-3"> اطلاعات محل شرکت</p>
        </div>
        <div className="flex gap-x-1">
          <p className="font-semibold text-accent ">آدرس محل شرکت: </p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.addresses[0]?.country?.name}</p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.addresses[0]?.city?.name}</p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.addresses[0]?.section?.name}</p>
          <p className="text-sm text-gray-600 space-x-2 ">
            {details?.addresses[0]?.remnantAddress}
          </p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.addresses[0]?.alley}</p>
          <p className="text-sm text-gray-600 space-x-2 ">{details?.addresses[0]?.plaque}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent"> کدپستی :</p>
          <p className="text-sm text-gray-600   ">{details?.addresses[0]?.postalCode}</p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">تلفن:</p>
          <p className="text-sm text-gray-600   ">{details?.addresses[0]?.tel} </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">تلفن همراه :</p>
          <p className="text-sm text-gray-600   ">
            {' '}
            {details?.addresses[0]?.countryPrefix}
            {details?.addresses[0]?.mobile}{' '}
          </p>
        </div>
        <div className="flex gap-x-2 items-center ">
          <p className="font-semibold text-accent">پست الکترونیکی:</p>
          <p className="text-sm text-gray-600   ">
            {details?.addresses[0]?.email ? details?.addresses[0]?.email : 'ندارد '}{' '}
          </p>
        </div>
      </div>

      {/* share holder info  */}
      <div className="  rounded-lg p-5 flex flex-col  justify-between gap-3">
        <p className="font-semibold pb-3">اطلاعات سهامداران </p>

        <div className="w-full flex justify-start flex-wrap gap-2 ">
          {details?.shareHolders &&
            details?.shareHolders?.map((item, index) => (
              <div
                className="rounded-lg bg-slate-200 shadow-xl min-h-[150px] min-w-[400px] flex flex-col items-center justify-center gap-y-3 py-2 w-auto h-auto"
                key={index}>
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-semibold text-gray-600 text-sm ">نام سهامدار :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">
                    {item?.firstName}
                    {''}
                    <p> {item?.lastName}</p>
                  </p>
                </div>
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-semibold text-gray-600 text-sm ">کدملی :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">{item?.uniqueIdentifier}</p>
                </div>
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-semibold text-gray-600 text-sm ">سمت :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">
                    {' '}
                    {ShareHolderPosition[item?.positionType]}
                  </p>
                </div>
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-semibold text-gray-600 text-sm ">کد پستی:</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">{item?.postalCode}</p>
                </div>
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-semibold text-gray-600 text-sm ">آدرس:</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">{item?.address}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* stake holder info  */}
      <div className="  w-full rounded-lg p-5 flex flex-col   gap-3">
        <p className="font-semibold pb-3">اطلاعات ذینفعان </p>
        <div className="w-full flex justify-start flex-wrap gap-6 ">
          {' '}
          {details?.stakeholders &&
            details?.stakeholders?.map((item, index) => (
              <div
                className="rounded-lg bg-slate-200 shadow-xl min-h-[150px] min-w-[350px] flex flex-col items-center justify-center gap-y-3 py-2 w-auto h-auto"
                key={index}>
                <div className="w-[90%] flex justify-between items-center ">
                  <p className="font-semibold text-gray-600 text-sm ">نام و نام خانوادگی :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">
                    {item?.firstName}
                    {''}
                    <p> {item?.lastName}</p>
                  </p>
                </div>
                <div className="w-[90%] flex justify-between items-center ">
                  <p className="font-semibold text-gray-600 text-sm ">کدملی :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">{item?.uniqueIdentifier}</p>
                </div>
                <div className="w-[90%] flex justify-between items-center ">
                  <p className="font-semibold text-gray-600 text-sm ">نوع ذینفع :</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">{StackHolder[item?.type]}</p>
                </div>
                <div className="w-[90%] flex justify-between items-center ">
                  <p className="font-semibold text-gray-600 text-sm ">سمت:</p>
                  <p className="text-sm text-gray-600 gap-x-1 flex ">
                    {PositionType[item?.positionType]}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LegalUserData;
