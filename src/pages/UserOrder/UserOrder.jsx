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
import { Table } from 'flowbite-react';

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
      <div className="min-w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle py-5 gap-y-5 p-6 overflow-x-auto">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
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

        <div dir="rtl" className="relative w-full sm:w-[80%] mx-auto overflow-x-auto mt-4" >
          <div className='w-max'>

            <Table hoverable={false} className="whitespace-nowrap">
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  ردیف
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تاریخ سفارش
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  مبلغ سفارش
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  تعداد واحد سفارش
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  عنوان طرح
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  شناسه ملی / کدملی
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  سرمایه‌گذار
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  سود پرداختی
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  نمایش نام سرمایه‌گذار
                </Table.HeadCell>
                <Table.HeadCell className="text-right py-4 text-gray-700">
                  جزییات
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((item, idx) => (
                    <Table.Row key={item.id ?? idx}>
                      <Table.Cell className="text-right">{Skip + idx + 1}</Table.Cell>
                      <Table.Cell className="text-right">
                        {DateFunction2.getDate(item.createDate)}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item.totalAmount &&
                          Number(item.totalAmount).toLocaleString()}{" "}
                        ریال
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {Number(item.totalUnit).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item.plan?.title}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item.user?.username}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item.user?.name}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {item.totalPayout &&
                          Number(item.totalPayout).toLocaleString()}{" "}
                        ریال
                      </Table.Cell>
                      <Table.Cell
                        className={`text-right ${item.isVisible ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {item.isVisible ? "نمایش" : "عدم نمایش"}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <UserOrderWalletFlowsModal orderId={item.id} />
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={10} className="text-center text-gray-500 py-4">
                      موردی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex flex-col items-center justify-center h-40">
                <BouncingDotsLoader />
              </div>
            )}

            {response?.pagination?.total === 0 && (
              <span className="w-full flex items-center justify-center py-5 text-caption font-medium text-dominant">
                موردی یافت نشد
              </span>
            )}

            <div className="relative flex justify-center p-8">
              <PaginationComponet
                total={response?.pagination?.total}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default UserOrder;
