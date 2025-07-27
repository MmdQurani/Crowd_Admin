/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { GetUserRoleReq, RemoveFromRoleReq, UpdateUserStatusReq } from '../Api/UserReq';
import { getDate, getTime } from 'component/DateFunctions/DateFunctions';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AddRoleModal from 'component/modal/AddRoleModal';
import DataContext from 'comon/context/MainContext';

const RealUserData = ({ details, statistics }) => {
  const { reload, setReload } = useContext(DataContext);

  const [UserRole, setUserRole] = useState();
  let [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    details?.id && GetUserRole();
  }, [isOpen]);

  const GetUserRole = async () => {
    const res = await GetUserRoleReq(details?.id);
    if (res) {
      setUserRole(res);
    } else {
      setUserRole(false);
    }
  };

  const RoleName = (name) => {
    switch (name) {
      case 'Admin':
        return 'ادمین';
    }
  };

  const RemoveFromRole = async (rolename) => {
    const res = await RemoveFromRoleReq(details?.username, rolename);
    if (res) {
      GetUserRole();
    } else {
      toast.error('مشکلی در اجرای درخواست شما پیش آمده');
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

  const mainDetail = [
    { title: 'نام کاربری:', data: details?.username || 'نامشخص' },
    {
      title: 'آخرین ورود:',
      data:
        (statistics?.lastSuccessfullLoginAttempDate &&
          `درتاریخ ${getDate(statistics?.lastSuccessfullLoginAttempDate)} ودر ساعت ${
            statistics?.lastSuccessfullLoginAttempDate?.split('T')?.[1]
          }`) ||
        'نامشخص'
    },
    { title: 'IP آدرس:', data: statistics?.lastSuccessfullLoginAttempI || 'نامشخص' },
    {
      title: 'تاریخ ایجاد حساب کاربری:',
      data: (details?.createDate && getDate(details?.createDate)) || 'نامشخص'
    },
    { title: 'تلفن همراه :', data: details?.phoneNumber || 'نامشخص' }
  ];

  const personalInfo = [
    { title: 'نام :', data: details?.realPerson?.firstName || 'نامشخص' },
    { title: 'نام خانوادگی :', data: details?.realPerson?.lastName || 'نامشخص' },
    { title: 'محل تولد :', data: details?.realPerson?.placeOfBirth || 'نامشخص' },
    {
      title: 'تاریخ تولد :',
      data: (details?.realPerson?.birthDate && getDate(details?.realPerson?.birthDate)) || 'نامشخص'
    },
    { title: 'نام پدر:', data: details?.realPerson?.fatherName || 'نامشخص' },
    { title: 'شماره ملی:', data: details?.realPerson?.shNumber || 'نامشخص' },
    {
      title: 'سریال شناسنامه:',
      data:
        details?.realPerson?.seriSh +
          '/' +
          details?.realPerson?.serial +
          details?.realPerson?.seriShChar || 'نامشخص'
    }
  ];
  const bankAcccountInfo = [
    { title: 'شماره حساب :', data: details?.accounts?.[0]?.accountNumber || 'نامشخص' },
    { title: 'نام بانک :', data: details?.accounts?.[0]?.bank?.name || 'نامشخص' },
    { title: 'شهر :', data: details?.accounts?.[0]?.branchCity?.name || 'نامشخص' },
    { title: 'نام شعبه :', data: details?.accounts?.[0]?.branchName || 'نامشخص' },
    { title: 'کد شعبه :', data: details?.accounts?.[0]?.branchCode || 'نامشخص' },
    { title: 'شماره شبا :', data: details?.accounts?.[0]?.sheba || 'نامشخص' }
  ];

  const userAddressInfo = [
    { title: 'کشور :', data: details?.addresses?.[0]?.country?.name || 'نامشخص' },
    { title: 'استان :', data: details?.addresses?.[0]?.province?.name || 'نامشخص' },
    { title: 'شهر :', data: details?.addresses?.[0]?.city?.name || 'نامشخص' },
    { title: 'خیابان :', data: details?.addresses?.[0]?.alley || 'نامشخص' },
    { title: 'پلاک :', data: details?.addresses?.[0]?.plaque || 'نامشخص' },
    { title: 'کدپستی :', data: details?.addresses?.[0]?.postalCode || 'نامشخص' },
    { title: 'تلفن (ضروری) :', data: details?.addresses?.[0]?.tel || 'نامشخص' },
    {
      title: 'همراه (ضروری) :',
      data: details?.addresses?.[0]?.countryPrefix || '-' + details?.addresses?.[0]?.mobile || '-'
    },
    { title: 'پست الکترونیکی :', data: details?.addresses?.[0]?.email || 'نامشخص' }
  ];

  const userJobInfo = [
    { title: 'نام شرکت :', data: details?.jobInfo?.companyName || 'نامشخص' },
    { title: 'سمت :', data: details?.jobInfo?.position || 'نامشخص' },
    { title: 'آدرس محل کار', data: details?.jobInfo?.companyAddress || 'نامشخص' },
    { title: 'کدپستی :', data: details?.jobInfo?.companyPostalCode || 'نامشخص' },
    { title: 'تلفن محل کار :', data: details?.jobInfo?.companyPhone || 'نامشخص' }
  ];

  return (
    <div className="w-full flex flex-col gap-y-10 items-center  ">
      {' '}
      <div className="w-full h-auto flex  justify-end">
        <a className="flex cursor-pointer" onClick={() => navigate(-1)}>
          <p className="text-gray-600 p-2 border-b border-gray-500 text-sm font-semibold  ">
            بازگشت
          </p>
        </a>
      </div>
      {/* main data */}
      <div className=" w-[90%] flex flex-wrap gap-8 h-auto  items-center justify-between ">
        {mainDetail?.map((item, index) => (
          <div key={index} className=" w-auto justify-start items-center flex gap-x-1 flex-nowrap ">
            <span className="text-sm  text-accent-700 font-semibold ">{item.title}</span>
            <span className="text-base  font-semibold text-gray-700 ">{item.data}</span>
          </div>
        ))}
      </div>
      {/*  user status  */}
      <div className="  w-[90%] rounded-lg flex justify-between">
        <div className="flex gap-x-2 items-center">
          <span className="text-sm  text-accent-700 font-semibold border-b border-accent-700 py-1">
            وضعیت کابر :
          </span>
          <span className={`  ${statistics?.isActive ? 'text-green-500' : 'text-red-500'}`}>
            {statistics?.isActive ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
        <div className="flex gap-x-2 items-center">
          <span className="text-sm  text-accent-700 font-semibold border-b border-accent-700 ">
            تغییر وضعیت کاربر:
          </span>
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
      {/* personal info  */}
      <div className="   rounded-lg w-[90%] flex flex-wrap justify-between gap-3">
        <span className="font-semibold  w-full text-start  border-b border-accent-700">
          اطلاعات فردی
        </span>
        <div className=" w-full flex flex-wrap gap-8 h-auto  items-center justify-between ">
          {personalInfo?.map((item, index) => (
            <div
              key={index}
              className=" w-auto justify-start items-center flex gap-x-1 flex-nowrap ">
              <span className="text-sm  text-accent-700 font-semibold ">{item.title}</span>
              <span className="text-base  font-semibold text-gray-700 ">{item.data}</span>
            </div>
          ))}
        </div>
      </div>
      {/*  bank account  info  */}
      <div className="   rounded-lg w-[90%] flex flex-wrap justify-between gap-3">
        {' '}
        <span className="font-semibold  w-full text-start border-b border-accent-700 ">
          اطلاعات حساب بانکی{' '}
        </span>
        <div className=" w-full flex flex-wrap gap-8 h-auto  items-center justify-between ">
          {bankAcccountInfo?.map((item, index) => (
            <div
              key={index}
              className=" w-auto justify-start items-center flex gap-x-1 flex-nowrap ">
              <span className="text-sm  text-accent-700 font-semibold ">{item.title}</span>
              <span className="text-base  font-semibold text-gray-700 ">{item.data}</span>
            </div>
          ))}
        </div>{' '}
      </div>
      {/* user job info  */}
      <div className="   rounded-lg w-[90%] flex flex-wrap justify-between gap-3">
        <span className="font-semibold  w-full text-start border-b border-accent-700 ">
          {' '}
          اطلاعات محل سکونت
        </span>
        <div className=" w-full flex flex-wrap gap-8 h-auto  items-center justify-between ">
          {userAddressInfo?.map((item, index) => (
            <div
              key={index}
              className=" w-auto justify-start items-center flex gap-x-1 flex-nowrap ">
              <span className="text-sm  text-accent-700 font-semibold ">{item.title}</span>
              <span className="text-base  font-semibold text-gray-700 ">{item.data}</span>
            </div>
          ))}
        </div>
      </div>
      {/* user job info  */}
      <div className="   rounded-lg w-[90%] flex flex-wrap justify-between gap-3">
        <span className="font-semibold  w-full text-start border-b border-accent-700">
          اطلاعات شغلی{' '}
        </span>
        <div className=" w-full flex flex-wrap gap-8 h-auto  items-center justify-between ">
          {userJobInfo?.map((item, index) => (
            <div
              key={index}
              className=" w-auto justify-start items-center flex gap-x-1 flex-nowrap ">
              <span className="text-sm  text-accent-700 font-semibold ">{item.title}</span>
              <span className="text-base  font-semibold text-gray-700 ">{item.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealUserData;
