/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  GetOrdersDetailsReq,
  GetWalletFlowsReq,
  RemoveScheduledPaymentsReq,
  ScheduledPaymentsManagementDetailsReq
} from '../Api/ScheduledPaymentsReq';
import Sidebar from 'component/layout/sidebar/SideBar';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import { scheduledPaymentsManagementStatus } from 'component/db/PlanStatusEnum';
import CreateAndEditScheduledPaymentsModal from './CreateAndEditScheduledPaymentsModal';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import ExcelUpload from 'component/Upload/ExcelUpload';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';
import { Table } from 'flowbite-react';

function ScheduledPaymentsManagementDetails() {
  const [details, setDetails] = useState();
  const [walletFlow, setWalletFlow] = useState();
  const [tabSelected, setTabSelected] = useState('orders');
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [orders, setOrders] = useState();
  const [isloading, setIsloading] = useState(false);
  const [filename, setFilename] = useState();
  const [isloadingResponse, setIsloadingResponse] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // To track the expanded row

  const { id } = useParams();
  const contentRefs = useRef([]); // To store the ref of each row content for animation
  const navigate = useNavigate();
  // Toggle row expansion
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Expand if clicked, collapse if already expanded
  };
  useEffect(() => {
    ScheduledPaymentsManagementDetails();
    GetOrdersDetails();
  }, [id, isOpen]);

  useEffect(() => {
    tabSelected == 'payout' && GetWalletFlows();
  }, [tabSelected]);

  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight = expandedRow === index ? `${ref.scrollHeight}px` : '0px';
        ref.style.opacity = expandedRow === index ? '1' : '0';
      }
    });
  }, [expandedRow]);

  const ScheduledPaymentsManagementDetails = async () => {
    setIsloading(true);
    const res = await ScheduledPaymentsManagementDetailsReq(id);
    if (res) {
      console.log(res);
      setDetails(res?.data);
    } else {
      setDetails(false);
    }
    setIsloading(false);
  };
  const GetOrdersDetails = async () => {
    const res = await GetOrdersDetailsReq(id);
    if (res) {
      console.log(res);
      setOrders(res?.data);
    } else {
      setOrders(false);
    }
  };

  const DeleteScheduledPaymentsManagement = async () => {
    setIsloadingResponse(true);
    const res = await RemoveScheduledPaymentsReq({
      scheduledPaymentId: id
    });
    if (res) {
      setResponse('success');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } else {
      setResponse('failed');
    }
    setIsloadingResponse(false);
  };

  const GetWalletFlows = async () => {
    const res = await GetWalletFlowsReq({
      scheduledPaymentId: id,
      pagination: {
        take: 10000,
        skip: 0
      }
    });
    if (res) {
      setWalletFlow(res);
    } else {
      setWalletFlow(false);
    }
  };

  const FindName = (arr, id) => arr?.find((item) => item?.key == id);

  const TabsName = [
    { name: 'سفارشات', key: 'orders' },
    { name: 'واریزی ها ', key: 'payout' }
  ];
  const CheckBankDefault = (array) => array.filter((item) => item.isDefault == true)?.[0];

  const TabelHeaderHandler = () => {
    switch (tabSelected) {
      case 'orders':
        return [
          { name: 'ردیف', key: 'index' },
          { name: 'سرمایه گذار', key: 'name' },
          { name: 'کدملی / شناسه ملی', key: 'username' },
          { name: 'شماره حساب', key: 'bankAccounts' },
          { name: 'شماره شبا', key: 'sheba' },
          { name: ' نام بانک', key: 'bankName' },
          { name: 'تاریخ ایجاد ', key: 'createDate' },
          { name: 'تعداد واحد ها', key: 'totalUnit' },
          { name: 'مبلغ سرمایه گذاری', key: 'totalAmount' },
          { name: 'مبلغ تخمینی', key: 'estimatedPayout' },
          { name: 'سود محقق شده', key: 'achievedTotalPayout' }
        ];
      case 'payout':
        return [
          { name: 'ردیف', key: 'index' },
          { name: 'سرمایه گذار', key: 'name' },
          { name: 'کدملی / شناسه ملی', key: 'username' },
          { name: 'تاریخ تراکنش', key: 'transactioDate' },
          { name: 'مبلغ تراکنش	', key: 'transactoionAmount' },
          { name: 'تاریخ واریز', key: 'achievedTotalPayout' },
          { name: 'کد رهگیری', key: 'trackingNumber' }
        ];

      default:
        break;
    }
  };

  const HandleTableBody = () => {
    switch (tabSelected) {
      case 'orders':
        return orders && orders?.length !== 0 ? (
          orders?.map((item, index) => (
            <tr
              key={index}
              className=" text-center  border-b  border-gray-300 rounded-md  text-caption  text-dominant-500  ">
              <td className="p-4 ">{index + 1}</td>
              <td className="p-4 ">{item?.user?.name}</td>
              <td className="p-4 ">{item?.user?.username}</td>
              <td className="p-4 ">{CheckBankDefault(item?.bankAccounts)?.accountNumber}</td>
              <td className="p-4 ">{CheckBankDefault(item?.bankAccounts)?.iBan}</td>
              <td className="p-4 ">{CheckBankDefault(item?.bankAccounts)?.bank}</td>
              <td className="p-4 ">
                {item?.createDate && DateFunction2.getDate(item?.createDate)}
              </td>
              <td className="p-4 ">
                {item?.totalUnit ? Number(item?.totalUnit).toLocaleString() : 0}
              </td>
              <td className="p-4 ">
                {item?.totalAmount ? Number(item?.totalAmount).toLocaleString() : 0}
              </td>
              <td className="p-4 ">
                {item?.estimatedPayout ? Number(item?.estimatedPayout).toLocaleString() : 0}
              </td>
              <td className="p-4 ">
                {item?.achievedTotalPayout ? Number(item?.achievedTotalPayout).toLocaleString() : 0}
              </td>
            </tr>
          ))
        ) : (
          <span className=" w-full  flex items-center text-center justify-center py-3 text-caption font-bold text-gray-500">
            گزارشی یافت نشد
          </span>
        );

      case 'payout':
        return walletFlow && walletFlow?.length !== 0 ? (
          walletFlow?.map((item, index) => (
            <React.Fragment key={index}>
              {/* Main Row */}
              <tr className="text-start  w-full cursor-pointer border-b border-gray-300  ">
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {index + 1}
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {item?.user?.name}
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {item?.user?.username}
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {item?.createDate && DateFunction2.getDate(item?.createDate)}
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {Number(item?.amount)?.toLocaleString()} ریال
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {' '}
                  {item?.statementDate && DateFunction2.getDate(item?.date)}
                </td>
                <td
                  onClick={() => toggleRow(index)}
                  className="p-4 border-b border-gray-300 text-center  ">
                  {' '}
                  {item?.referenceNumber}
                </td>
              </tr>

              {/* Expanded Row (Details) */}
              <tr className={`w-full ${expandedRow === index ? 'border-b border-red-200' : ''}`}>
                <td colSpan={4} className="p-0">
                  <div
                    ref={(el) => (contentRefs.current[index] = el)} // Store refs for each row content
                    className="overflow-hidden transition-all duration-500 ease-in-out  text-xs text-gray-170  w-full"
                    style={{
                      maxHeight: '0px',
                      opacity: 0
                    }}>
                    <p className="p-3">
                      {' '}
                      {item?.description ? item?.description : 'جزییاتی برای ابین مورد یافت نشده '}
                    </p>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))
        ) : (
          <span className=" w-full  flex items-center text-center justify-center py-3 text-caption font-bold text-gray-500">
            گزارشی یافت نشد
          </span>
        );

      default:
        break;
    }
  };
  // const ExcelHeader = [
  //   { label: 'سرمایه گذاری', key: 'name' },
  //   { label: 'کدملی / شناسه ملی', key: 'username' },
  //   { label: 'شماره حساب', key: 'account' },
  //   { label: 'شماره شبا', key: 'sheba' },
  //   { label: 'نام بانک', key: 'bankName' },
  //   { label: 'تاریخ ایجاد ', key: 'date' },
  //   { label: 'تعداد واحد ها', key: 'totalUnit' },
  //   { label: 'مبلغ سرمایه گذاری', key: 'totalAmount' },
  //   { label: 'مبلغ تخمینی', key: 'estimatedPayout' },
  //   { label: 'سود محقق شده', key: 'achievedTotalPayout' }
  // ];
  // const ExcelData =
  //   orders &&
  //   orders?.length !== 0 &&
  //   orders?.map((item, index) => ({
  //     ...item,
  //     name: item?.user?.name,
  //     username: `\t${item?.user?.username}`,
  //     date: item?.createDate && DateFunction2.getDate(item?.createDate),
  //     account: `\t${CheckBankDefault(item?.bankAccounts)?.accountNumber}`,
  //     sheba: `\t${CheckBankDefault(item?.bankAccounts)?.iBan}`,
  //     bankName: `\t${CheckBankDefault(item?.bankAccounts)?.bank}`
  //   }));

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

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 gap-y-5 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        {/* بخش هدر */}
        <div className="w-full grid grid-cols-12 gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
          {/* بخش عنوان (Title) */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex items-center">
            <span className="text-gray-500 text-sm ml-2">عنوان طرح:</span>
            <span className="text-gray-900 text-base font-semibold">
              {details?.planTitle}
            </span>
          </div>

          {/* بخش دکمه‌ها (Actions) */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-4 flex items-center justify-start gap-x-4 space-x-2">
            {response ? (
              response === "success" ? (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                  حذف شد
                </span>
              ) : (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                  خطا! حذف ناموفق
                </span>
              )
            ) : (
              <button
                onClick={DeleteScheduledPaymentsManagement}
                className={`px-4 py-2 flex-1 sm:flex-none flex justify-center items-center rounded-md text-white transition ${isloadingResponse
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                  }`}
              >
                {isloadingResponse ? <BouncingDotsLoader /> : "حذف"}
              </button>
            )}
            <CreateAndEditScheduledPaymentsModal
              type={2}
              id={id}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              data={details}
            />
          </div>

          {/* بخش آپلود فایل (Upload) */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-3 flex items-center justify-start">
            <ExcelUpload
              id={id}
              filename={filename}
              setFilename={setFilename}
              placeholder="فایل را بارگذاری کنید"
              title="بارگذاری اکسل وایز سود"
            />
          </div>
        </div>


        {' '}
        {/* بخش اطلاعات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-4">
          {/* کارت تاریخ تخمینی پرداخت */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :تاریخ تخمینی پرداخت
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.estimatedPayoutDate &&
                DateFunction2.getDate(details?.estimatedPayoutDate)}
            </span>
          </div>

          {/* کارت درصد پرداخت تخمینی */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :درصد پرداخت تخمینی
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {(details?.estimatedPayoutPercentage ?? 0) * 100}%
            </span>
          </div>

          {/* کارت تاریخ واریز سود */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :تاریخ واریز سود
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.investeeDepositDate &&
                DateFunction2.getDate(details?.investeeDepositDate)}
            </span>
          </div>

          {/* کارت درصد سود محقق شده */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :درصد سود محقق شده
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {(details?.achievedPayoutPercentage ?? 0) * 100}%
            </span>
          </div>

          {/* کارت وضعیت */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :وضعیت
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.status &&
                FindName(scheduledPaymentsManagementStatus, details.status)?.name}
            </span>
          </div>

          {/* کارت مبلغ سود تخمینی */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :مبلغ سود تخمینی
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.estimatedTotalPayout
                ? Number(details.estimatedTotalPayout).toLocaleString()
                : 0} ریال
            </span>
          </div>

          {/* کارت مبلغ سود محقق شده */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :مبلغ سود محقق شده
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.achievedTotalPayout
                ? Number(details.achievedTotalPayout).toLocaleString()
                : 0} ریال
            </span>
          </div>

          {/* کارت تاریخ ایجاد */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :تاریخ ایجاد
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.createDate && DateFunction2.getDate(details.createDate)}
            </span>
          </div>

          {/* کارت مبلغ جمع‌آوری شده */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :مبلغ جمع‌آوری شده
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.amountRaised
                ? Number(details.amountRaised).toLocaleString()
                : 0} ریال
            </span>
          </div>

          {/* کارت تعداد سرمایه‌گذاران */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex gap-x-2 justify-between items-center">
            <span className="text-gray-600 text-xs" dir="ltr">
              :تعداد سرمایه‌گذاران
            </span>
            <span className="text-gray-900 text-sm font-semibold">
              {details?.totalInvestors
                ? Number(details.totalInvestors).toLocaleString()
                : 0}
            </span>
          </div>
        </div>


        {/* tab for select */}
        <div className=" w-full flex flex-col items-center justify-start   py-5 h-auto text-sm ">
          {/*  tab buttons  */}
          <div className="w-full overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 snap-x snap-mandatory">
            <nav className="flex items-center gap-x-6 px-4 lg:px-8 h-16">
              {TabsName?.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTabSelected(item.key)}
                  className="relative flex flex-col items-center justify-center px-4 py-2 snap-start transition-colors duration-200 focus:outline-none focus:text-accent-600"
                >
                  <span
                    className={`text-sm font-medium ${tabSelected === item.key
                      ? 'text-accent-600 dark:text-accent-500'
                      : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-t-lg bg-accent-600 transform transition-transform duration-300 ${tabSelected === item.key ? 'scale-x-100' : 'scale-x-0'
                      }`}
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* component display  */}
          <div className="w-full rounded-lg bg-white shadow-md p-4 flex flex-col gap-4">
            {/* دکمه دانلود اکسل */}
            <div className="flex justify-start">
              {tabSelected === 'orders' && orders?.length > 0 && (
                <DownloadExcelBtn
                  style="w-48 h-10 border border-green-500 text-green-500 rounded-md"
                  Rout={`ScheduledPaymentsManagement/GetOrdersByScheduledPaymentId/${id}`}
                  filename={`سفارشات_${details?.planTitle}`}
                />
              )}
            </div>

            {/* جدول */}
            <div className="overflow-x-auto">
              <Table
                hoverable={true}
                striped={true}
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap "
              >
                <Table.Head className="sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm">
                  {TabelHeaderHandler().map((item, idx) => (
                    <Table.HeadCell
                      key={idx}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                    >
                      {item.name}
                    </Table.HeadCell>
                  ))}
                </Table.Head>

                <Table.Body className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-700">
                  {HandleTableBody()}
                </Table.Body>
              </Table>
            </div>

            {/* لودر هنگام بارگذاری */}
            {isloading && (
              <div className="flex justify-center py-3">
                <BouncingDotsLoader />
              </div>
            )}
          </div>
          {' '}
        </div>{' '}
      </div>
    </div>
  );
}

export default ScheduledPaymentsManagementDetails;
