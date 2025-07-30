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
        <div className="w-full flex justify-start items-center flex-wrap gap-8 h-auto p-3">
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">:تاریخ تخمینی پرداخت </span>
            <span className="text-sm font-bold">
              {details?.estimatedPayoutDate && DateFunction2.getDate(details?.estimatedPayoutDate)}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">:درصد پرداخت تخمینی</span>
            <span className="text-sm font-bold">
              {details?.estimatedPayoutPercentage ? details?.estimatedPayoutPercentage * 100 : 0}{' '}
              {'%'}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">:تاریخ واریز سود </span>
            <span className="text-sm font-bold">
              {details?.investeeDepositDate && DateFunction2.getDate(details?.investeeDepositDate)}{' '}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">: درصد سود محقق شده </span>
            <span className="text-sm font-bold">
              {details?.achievedPayoutPercentage ? details?.achievedPayoutPercentage * 100 : 0}
              {' %'}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">:وضعیت </span>
            <span className="text-sm font-bold">
              {details?.status &&
                FindName(scheduledPaymentsManagementStatus, details?.status)?.name}
            </span>
          </div>

          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">: مبلغ سود تخمینی </span>
            <span className="text-sm font-bold">
              {details?.estimatedTotalPayout
                ? Number(details?.estimatedTotalPayout).toLocaleString()
                : 0}{' '}
              {' ریال'}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">: مبلغ سود محقق شده </span>
            <span className="text-sm font-bold">
              {details?.achievedTotalPayout
                ? Number(details?.achievedTotalPayout).toLocaleString()
                : 0}
              {' ریال'}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">:تاریخ ایجاد </span>
            <span className="text-sm font-bold">
              {details?.createDate && DateFunction2.getDate(details?.createDate)}{' '}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">: مبلغ جمع آوری شده </span>
            <span className="text-sm font-bold">
              {details?.amountRaised ? Number(details?.amountRaised).toLocaleString() : 0} {' ریال'}
            </span>
          </div>
          <div className="flex min-w-[10%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
            <span dir="ltr">: تعداد سرمایه گذاران </span>
            <span className="text-sm font-bold">
              {details?.totalInvestors && Number(details?.totalInvestors).toLocaleString()}
            </span>
          </div>
        </div>
        {/* tab for select */}
        <div className=" w-full flex flex-col items-center justify-start   py-5 h-auto text-sm ">
          {/*  tab buttons  */}
          <div className="w-full overflow-x-auto flex justify-start items-center h-auto border-b border-gray-500">
            {' '}
            <div className="lg:w-[90%] h-14 flex items-center justify-start gap-x-6 ">
              {TabsName?.map((item, index) => (
                <div
                  onClick={() => setTabSelected(item.key)}
                  className=" w-auto cursor-pointer  h-14 justify-between flex flex-col items-center  "
                  key={index}>
                  <span
                    className={`h-[100%] w-fit  text-sm   text-nowrap text-center items-center flex px-3 justify-center ${tabSelected == item.key ? ' text-accent-600' : ' text-gray-170'
                      } `}>
                    {item.name}
                  </span>
                  {tabSelected == item.key && (
                    <div className=" w-full h-2  bg-accent-600  rounded-t-large" />
                  )}{' '}
                </div>
              ))}
            </div>
          </div>
          {/* component display  */}
          <div className="overflow-hidden w-full flex items-center flex-col justify-center rounded-lg gap-y-5  py-5 ">
            <div className="w-full flex justify-start items-center">
              {' '}
              {tabSelected == 'orders' && orders && orders?.length !== 0 && (
                <DownloadExcelBtn
                  style="w-[200px] h-[40px] border border-green-500 text-green-500 "
                  Rout={`ScheduledPaymentsManagement/GetOrdersByScheduledPaymentId/${id}`}
                  filename={`سفارشات_${details?.planTitle}`}
                />
              )}
            </div>
            <div className="w-full h-[400px] overflow-y-auto rounded-md">
              <table className="min-w-full shadow-md rounded-md">
                <thead className="bg-secondray-50">
                  <tr className="shadow-lg bg-white">
                    {TabelHeaderHandler()?.map((item, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`sticky top-0  bg-white  py-5  text-center text-xs font-semibold  uppercase  `}>
                        {' '}
                        {item?.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="p-10 w-full">{HandleTableBody()}</tbody>
              </table>
              {isloading && (
                <div className=" w-full  flex justify-center py-3 items-center">
                  <BouncingDotsLoader />
                </div>
              )}
            </div>
          </div>{' '}
        </div>{' '}
      </div>
    </div>
  );
}

export default ScheduledPaymentsManagementDetails;
