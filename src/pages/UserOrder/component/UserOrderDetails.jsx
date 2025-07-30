/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router';
import { GetUsersOrderDetailsReq } from '../Api/userOrderReq';
import { useEffect, useState } from 'react';
import Sidebar from 'component/layout/sidebar/SideBar';
import { getDate } from 'component/DateFunctions/DateFunctions';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

const UserOrderDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    GetUsersOrderDetails();
  }, []);

  const GetUsersOrderDetails = async () => {
    const res = await GetUsersOrderDetailsReq(id);
    setDetails(res);
  };
  console.log(details);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-auto">
      {/* سایدبار */}
      <div className="min-w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 w-full h-full flex flex-col gap-y-5 items-center align-middle p-10">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div dir="rtl" className="w-full flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className=" inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150">
            <span className="ml-2">بازگشت</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>


        <div className="w-full max-w-[90%] mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8">
          {/** Section: طرح */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">نام طرح</span>
            <span className="mt-2 sm:mt-0 text-gray-600">
              {details?.data?.investment?.title}
            </span>
          </div>

          <div className="border-t border-gray-200" />

          {/** Section: جزئیات سرمایه‌گذاری */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                تاریخ شروع طرح
              </label>
              <p className="mt-1 text-gray-700">
                {details?.data?.investment?.createDate &&
                  getDate(details.data.investment.createDate)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                نرخ سالانه سود
              </label>
              <p className="mt-1 text-gray-700">
                {details?.data?.investment?.annualRate
                  ? `${(details.data.investment.annualRate * 100).toFixed()}٪`
                  : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                تعداد دوره پرداخت سود
              </label>
              <p className="mt-1 text-gray-700">
                {details?.data?.investment?.installmentCount}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                فاصله بین اقساط
              </label>
              <p className="mt-1 text-gray-700">
                {details?.data?.investment?.installmentPeriod} ماه
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                زمان کل دوره
              </label>
              <p className="mt-1 text-gray-700">
                {details?.data?.investment?.investmentPeriod} ماه
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/** Section: برنامه پرداخت سود */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              برنامه پرداخت سود طرح
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details?.data?.investment?.scheduledPayments?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">تاریخ پرداخت</span>
                    <span className="text-gray-700">
                      {item?.date && getDate(item.date)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">مبلغ پرداختی</span>
                    <span className="text-gray-700">
                      {item?.amount && Number(item.amount).toLocaleString()} ریال
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">درصد سود دوره</span>
                    <span className="text-gray-700">
                      {item?.percent != null
                        ? `${(item.percent * 100).toFixed()}٪`
                        : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/** Section: توضیحات طرح */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">
              توضیحات طرح
            </label>
            <p className="text-gray-700 text-justify leading-relaxed">
              {details?.data?.investment?.description}
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default UserOrderDetails;
