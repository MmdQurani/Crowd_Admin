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
          `درتاریخ ${getDate(statistics?.lastSuccessfullLoginAttempDate)} ودر ساعت ${statistics?.lastSuccessfullLoginAttempDate?.split('T')?.[1]
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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* بازگشت */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          بازگشت
                    <svg
            className="h-5 w-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* main data */}
      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainDetail?.map((item, index) => (
          <div key={index} className="space-y-1">
            <span className="block text-sm text-accent-700 font-semibold">
              {item.title}
            </span>
            <span className="block text-base font-medium text-gray-800 whitespace-normal break-words">
              {item.data}
            </span>
          </div>
        ))}
      </div>

      {/* user status */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-accent-700 font-semibold border-b border-accent-700 pb-1">
            وضعیت کاربر:
          </span>
          <span
            className={`${statistics?.isActive ? 'text-green-600' : 'text-red-600'
              } text-base font-medium`}
          >
            {statistics?.isActive ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
        <button
          onClick={() => UpdateUserStatus(!statistics?.isActive)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${statistics?.isActive
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
            }`}
        >
          {statistics?.isActive ? 'غیرفعال کردن کاربر' : 'فعال کردن کاربر'}
        </button>
      </div>

      {/* personal info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <span className="text-lg font-semibold border-b border-gray-200 pb-2">
          اطلاعات فردی
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalInfo?.map((item, index) => (
            <div key={index} className="space-y-1">
              <span className="block text-sm text-accent-700 font-semibold">
                {item.title}
              </span>
              <span className="block text-base font-medium text-gray-800 whitespace-normal break-words">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* bank account info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <span className="text-lg font-semibold border-b border-gray-200 pb-2">
          اطلاعات حساب بانکی
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAcccountInfo?.map((item, index) => (
            <div key={index} className="space-y-1">
              <span className="block text-sm text-accent-700 font-semibold">
                {item.title}
              </span>
              <span className="block text-base font-medium text-gray-800 whitespace-normal break-words">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* address info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <span className="text-lg font-semibold border-b border-gray-200 pb-2">
          اطلاعات محل سکونت
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAddressInfo?.map((item, index) => (
            <div key={index} className="space-y-1">
              <span className="block text-sm text-accent-700 font-semibold">
                {item.title}
              </span>
              <span className="block text-base font-medium text-gray-800 whitespace-normal break-words">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* job info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <span className="text-lg font-semibold border-b border-gray-200 pb-2">
          اطلاعات شغلی
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userJobInfo?.map((item, index) => (
            <div key={index} className="space-y-1">
              <span className="block text-sm text-accent-700 font-semibold">
                {item.title}
              </span>
              <span className="block text-base font-medium text-gray-800 whitespace-normal break-words">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>

  );
};

export default RealUserData;
