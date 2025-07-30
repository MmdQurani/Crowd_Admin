/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useEffect, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import Input from 'component/input/Input';
import Button from 'component/button/Button';
import { getDate } from 'component/DateFunctions/DateFunctions';
import { GetAllGetwayReq, GetAllPaymentReq } from './Api/paymentReq';
import { payStatusEnum } from 'component/db/PlanStatusEnum';
import FindUser from 'component/AutoComplete/FindUser';
import { Table } from 'flowbite-react';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

function Payment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [nationalId, setNationalId] = useState();
  const [gatway, setGatway] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    GetAllPayment();
    GetAllGetway();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetAllPayment = async () => {
    setIsloading(true);
    const res = await GetAllPaymentReq({
      userId,
      pagination: {
        take: 10,
        skip: Skip
      }
    });
    setIsloading(false);
    setResponse(res);
  };
  const GetAllGetway = async () => {
    const res = await GetAllGetwayReq();
    setGatway(res?.data);
  };

  const fundPayStatus = (key) => {
    return payStatusEnum.find((item) => item?.key == key)?.name;
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
      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div dir="rtl" className="min-w-[90%] sm:min-w-[50%] mx-auto  bg-gray-50 border border-gray-200  rounded-lg p-4  flex items-center gap-4">
          <div className="flex-1">
            <FindUser
              setUserId={setUserId}
              userId={userId}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>


        <div dir="rtl" className="relative w-full sm:w-[90%] mx-auto overflow-x-auto mt-4">
          <Table hoverable={false} className="min-w-full whitespace-nowrap">
            <Table.Head className="bg-secondary sticky top-0">
              <Table.HeadCell className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                ردیف
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                نام کاربر
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                نوع کاربری
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                نام کاربری
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                درگاه
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                تاریخ پرداخت
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                مبلغ پرداخت
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                وضعیت پرداخت
              </Table.HeadCell>
              <Table.HeadCell className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="bg-white divide-y divide-gray-200">
              {response?.data?.length > 0 ? (
                response.data.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                  >
                    <Table.Cell className="px-4 py-3 text-right text-sm text-gray-600">
                      {Skip + index + 1}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-center text-sm text-gray-600">
                      {item.user?.name}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right text-sm text-gray-600">
                      {item.user?.type === 1 || item.user?.type === 3 ? 'حقیقی' : 'حقوقی'}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right text-sm text-gray-600">
                      {item.user?.username}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-center text-sm text-gray-600">
                      {gatway.find(g => g.id === item.gatewayId)?.gatewayTypeName || '-'}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right text-sm text-gray-600">
                      {item.payDate ? getDate(item.payDate) : '----'}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-center text-sm text-gray-600">
                      {Number(item.amount).toLocaleString()} ریال
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right text-sm text-gray-600">
                      {fundPayStatus(item.payStatus)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-center">
                      {/* دکمه یا آیکون عملیات */}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9} className="px-4 py-10 text-center text-sm text-gray-500">
                    گزارشی یافت نشد
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          {isloading && (
            <div className="w-full flex flex-col items-center py-10">
              <div className="h-12 w-12 border-8 border-gray-300 border-t-accent rounded-full animate-spin"></div>
              <span className="mt-2 text-sm text-gray-600">در حال بارگذاری...</span>
            </div>
          )}

          {response?.data?.length > 0 && (
            <div className="flex justify-center py-6">
              <PaginationComponet
                total={response.pagination.total}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Payment;
