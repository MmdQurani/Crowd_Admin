/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useContext, useEffect, useState } from 'react';
import { GetALLUsersOrderReq } from './Api/userOrderReq';
import PaginationComponet from 'component/pagination/paginationComponent';
import { useNavigate } from 'react-router';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DatePickerPersian from 'component/Datepicker/datepicker';
import DropDown from 'component/DropDown/DropDown';
import FindUser from 'component/AutoComplete/FindUser';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import DataContext from 'comon/context/MainContext';
import UserOrderWalletFlowsModal from './component/UserOrderWalletFlowsModal';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

function UserOrder() {
  const { allPlans } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState(false);
  const [response, setResponse] = useState();
  const [userId, setUserId] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [planId, setPlanId] = useState();

  useEffect(() => {
    GetALLUsersOrder();
  }, [currentPage, planId, startDate, endDate, userId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 5 * (currentPage - 1);

  const GetALLUsersOrder = async () => {
    setIsloading(true);
    const res = await GetALLUsersOrderReq({
      investorId: userId,
      planId: planId?.key,
      startDate: startDate,
      endDate: endDate,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    console.log('response', res);

    setIsloading(false);
    setResponse(res);
  };

  const HandelClearFilter = () => {
    setEndDate();
    setPlanId();
    setStartDate();
    setUserId();
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-auto">

      {/* سایدبار */}
      <div className="w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 w-full h-full flex flex-col items-center align-middle py-5 gap-y-5 p-6 ">

        {/* باز کردن سایدبار */}
        <button
          className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div className="w-full max-w-[80%] mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6">
          {/* ردیف اول: جستجوی کاربر و دکمه‌ها */}
          <div className="flex flex-col sm:flex-row items-end justify-between flex-wrap gap-4">
            <div className="w-full md:w-1/3">
              <FindUser setUserId={setUserId} userId={userId} />
            </div>
            <div className="md:w-auto w-full flex items-center flex-wrap gap-3">
              <DownloadExcelBtn
                Rout="OrdersManagement/GetAll"
                filename="گزارش سفارشات"
                body={{
                  investorId: userId,
                  planId: planId?.key,
                  startDate,
                  endDate,
                  pagination: { take: 100000, skip: 0 }
                }}
              />
              <button
                onClick={HandelClearFilter}
                className="md:w-max w-full px-4 py-2 h-10 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                حذف فیلتر
              </button>
            </div>
          </div>

          {/* ردیف دوم: ورودی تاریخ و پلن */}
          <div className="flex flex-col sm:flex-row items-end justify-center sm:justify-start md:flex-nowrap` flex-wrap gap-4">
            <DatePickerPersian
              value={startDate}
              onchange={setStartDate}
              title="از تاریخ"
              className="w-full sm:w-auto"
            />
            <DatePickerPersian
              value={endDate}
              onchange={setEndDate}
              title="تا تاریخ"
              className="w-full sm:w-auto"
            />
            <DropDown
              arrey={allPlans}
              select={planId}
              setSelect={setPlanId}
              height="h-[200px]"
              className="w-full sm:w-48"
            />
          </div>
        </div>



        <div className=" overflow-x-auto md:rounded-lg  w-[80%]">
          <table className="table-auto  font-IRANYekanX w-full ">
            <thead className="font-normal w-full  bg-white text-sm shadow-lg   text-center text-dominant-500 ">
              <tr className="">
                <th className="  bg-secondary p-2 ">ردیف</th>
                <th className="  bg-secondary p-2 ">تاریخ سفارش</th>
                <th className="  bg-secondary p-2 ">مبلغ سفارش</th>
                <th className="  bg-secondary p-2 ">تعداد واحد سفارش</th>
                <th className="  bg-secondary p-2  flex justify-center">عنوان طرح</th>
                <th className="  bg-secondary p-2  text-xs "> شناسه ملی /کدملی</th>
                <th className="  bg-secondary p-2  ">سرمایه گذار</th>
                <th className="  bg-secondary p-2  "> سود پرداختی</th>
                <th className="  bg-secondary p-2  ">نماش نام سرمایه گذار</th>
                <th className="  bg-secondary p-2  ">جزییات </th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-b-2 border-gray-300 rounded-md  text-caption text-right text-dominant-500  ">
                    <td className="p-3 ">{Skip + index + 1}</td>
                    <td className="p-3 ">{DateFunction2.getDate(item?.createDate)}</td>
                    <td className="p-3 ">
                      {item?.totalAmount && Number(item?.totalAmount).toLocaleString()} ریال
                    </td>
                    <td className="p-3 flex justify-center ">
                      {Number(item?.totalUnit).toLocaleString()}{' '}
                    </td>
                    <td className="p-3  text-center ">{item?.plan?.title} </td>
                    <td className="p-3  text-center ">{item?.user?.username} </td>
                    <td className="p-3  text-center ">{item?.user?.name} </td>
                    <td className="p-3 ">
                      {item?.totalPayout && Number(item?.totalPayout).toLocaleString()} ریال
                    </td>
                    <td className={`p-3 ${item?.isVisible ? 'text-green-500' : 'text-red-500'}`}>
                      {item?.isVisible ? 'نمایش ' : 'عدم نمایش'}
                    </td>
                    <td className={`p-3 `}>
                      <UserOrderWalletFlowsModal orderId={item?.id} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full flex-col flex items-center justify-center h-screen">
              <BouncingDotsLoader />
            </div>
          )}

          {response?.pagination?.total == 0 && (
            <span className=" w-full flex-col flex items-center py-5 text-caption font-medium text-dominant">
              موردی یافت نشد
            </span>
          )}

          <div className=" relative flex justify-center p-8">
            {' '}
            <PaginationComponet
              total={response?.pagination?.total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOrder;
