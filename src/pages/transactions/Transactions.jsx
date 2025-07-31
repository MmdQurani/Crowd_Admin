/* eslint-disable no-unused-vars */
import PaginationComponet from 'component/pagination/paginationComponent';
import React, { useEffect, useState } from 'react';
import { GetWalletFlowsReq } from './Api/transactionReq';
import Sidebar from 'component/layout/sidebar/SideBar';
import { getDate } from 'component/DateFunctions/DateFunctions';
import { OperationType, walletflowstatus } from './enum/transaction';
import DatePickerPersian from 'component/Datepicker/datepicker';
import FindUser from 'component/AutoComplete/FindUser';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import DropDown from 'component/DropDown/DropDown';
import { IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { Table } from 'flowbite-react';

function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [userId, setUserId] = useState();
  const [status, setStatus] = useState();
  const [operationType, setOperationType] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  //   const navigate = useNavigate();

  useEffect(() => {
    GetWalletFlows();
  }, [userId, currentPage, status, operationType, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userId, status, operationType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 10 * (currentPage - 1);

  const GetWalletFlows = async () => {
    setIsloading(true);
    const res = await GetWalletFlowsReq({
      userId,
      operationTypes: operationType?.key ? [operationType?.key] : [],
      startDate: startDate?.split('T')?.[0],
      endDate: endDate?.split('T')?.[0],
      status: status?.key || null,
      pagination: {
        take: 10,
        Skip
      }
    });
    if (res) {
      setResponse(res);
    } else {
      setResponse(false);
    }
    setIsloading(false);
  };

  const FindType = (array, id) => array.find((item) => item.key == id);

  const HandelClearFilter = () => {
    setEndDate();
    setStartDate();
    setUserId();
    setStatus();
    setOperationType();
  };
  // const GetAllDataForExcel = async () => {
  //   const res = await GetWalletFlowsReq({
  //     userId,
  //     operationTypes: operationType && [operationType],
  //     startDate: startDate?.split('T')?.[0],
  //     endDate: endDate?.split('T')?.[0],
  //     pagination: {
  //       take: total,
  //       Skip: 0
  //     },
  //     status
  //   });
  //   if (res) {
  //     setExcel(res?.data);
  //   } else {
  //     setExcel(false);
  //   }
  // };

  // const UpdateWallFlowetStatus = async (walletFlowId, status) => {
  //   const res = await UpdateWalletFlowStatusReq({
  //     walletFlowId,
  //     status
  //   });
  //   if (res) {
  //     setAlert(true);
  //   } else {
  //     toast.warning('عملیات انجام نشد ');
  //   }
  // };

  // const ExcelHeader = [
  //   { label: 'عنوان طرح', key: 'planTitle' },
  //   { label: 'نام', key: 'name' },
  //   { label: 'نام کاربری', key: 'username' },
  //   { label: 'تاریخ تراکنش', key: 'date' },
  //   { label: 'ساعت تراکنش', key: 'time' },
  //   { label: 'توضیح تراکنش', key: 'flowDescription' },
  //   { label: 'مبلغ تراکنش', key: 'moneyAmount' },
  //   { label: 'نوع تراکنش', key: 'type' },
  //   { label: 'وضعیت تراکنش', key: 'walletflowstatus' }
  // ];
  // const ExcelData =
  //   excel &&
  //   excel?.length !== 0 &&
  //   excel?.map((item) => ({
  //     ...item,
  //     name: item?.user?.name,
  //     username: item?.user?.username,
  //     date: item?.createDate && DateFunction2.getDate(item?.createDate),
  //     time: item?.createDate && item?.createDate?.split('T')?.[1],
  //     type: FindType(item?.operationType),
  //     walletflowstatus: walletflowstatus[item?.status] && walletflowstatus[item?.status]
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
      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        {/* <div className="bg-gray-500 rounded-lg  w-full flex  flex-wrap justify-start gap-5 p-3 items-end">
          <div className="w-[20%] justify-start items-end ">
            <FindUser setUserId={setUserId} userId={userId} />
          </div>
          <div className="w-[20%] flex flex-col justify-center items-center gap-y-1 ">
            <label htmlFor="operationType" className=" text-start w-full text-xs text-white">
              نوع تراکنس
            </label>
            <DropDown
              height="h-[200px]"
              arrey={OperationType}
              name="OperationType"
              select={operationType}
              setSelect={setOperationType}
            />
          </div>
          <div className="w-[20%] flex flex-col justify-center items-center gap-y-1 ">
            <label htmlFor="walletflowstatus" className=" text-start w-full text-xs text-white">
              وضعیت تراکنش
            </label>
            <DropDown
              arrey={walletflowstatus}
              select={status}
              name="walletflowstatus"
              setSelect={setStatus}
            />
          </div>
          <DatePickerPersian
            value={startDate}
            onchange={setStartDate}
            title="از تاریخ"
            style="w-[200px]"
          />
          <DatePickerPersian
            value={endDate}
            onchange={setEndDate}
            title="تا تاریخ"
            style="w-[200px]"
          />
          <DownloadExcelBtn
            Rout="WalletManagement/GetWalletFlows"
            filename="گزارش تراکنش ها"
            body={{
              userId,
              operationTypes: operationType?.key ? [operationType?.key] : [],
              startDate: startDate?.split('T')?.[0],
              endDate: endDate?.split('T')?.[0],
              status: status?.key || null,
              pagination: {
                take: 10000000,
                Skip: 0
              }
            }}
          />
          <button
            onClick={HandelClearFilter}
            className="w-[100px] h-10 text-white text-center flex justify-center items-center text-sm font-semibold  focus:outline-none focus:ring-0 border border-white rounded-md ">
            حذف فیلتر{' '}
          </button>
        </div> */}

        <div dir="rtl" className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-6">

            <div className='w-full h-full flex flex-wrap gap-6'>
              {/* کاربر */}
              <div className="w-full sm:w-1/3 md:w-1/4">
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  کاربر
                </label>
                <FindUser
                  id="user"
                  setUserId={setUserId}
                  userId={userId}
                  className="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* نوع تراکنش */}
              <div className="w-full sm:w-1/3 md:w-1/4 flex flex-col justify-end">
                <label htmlFor="operationType" className="block text-sm font-medium text-gray-700 mb-1">
                  نوع تراکنش
                </label>
                <DropDown
                  id="operationType"
                  arrey={OperationType}
                  name="operationType"
                  select={operationType}
                  setSelect={setOperationType}
                  className="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  height="h-[200px]"
                />
              </div>

              {/* وضعیت تراکنش */}
              <div className="w-full sm:w-1/3 md:w-1/4 flex flex-col justify-end">
                <label htmlFor="walletflowstatus" className="block text-sm font-medium text-gray-700 mb-1">
                  وضعیت تراکنش
                </label>
                <DropDown
                  id="walletflowstatus"
                  arrey={walletflowstatus}
                  name="walletflowstatus"
                  select={status}
                  setSelect={setStatus}
                  className="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  height="h-[200px]"
                />
              </div>

              {/* از تاریخ */}
              <div className="w-full sm:w-1/2 md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  از تاریخ
                </label>
                <DatePickerPersian
                  value={startDate}
                  onchange={setStartDate}
                  title=""
                  style="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* تا تاریخ */}
              <div className="w-full sm:w-1/2 md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تا تاریخ
                </label>
                <DatePickerPersian
                  value={endDate}
                  onchange={setEndDate}
                  title=""
                  style="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="w-full flex flex-wrap sm:w-auto gap-4 items-end">
              <DownloadExcelBtn
                Rout="WalletManagement/GetWalletFlows"
                filename="گزارش تراکنش ها"
                body={{
                  userId,
                  operationTypes: operationType?.key ? [operationType.key] : [],
                  startDate: startDate?.split('T')?.[0],
                  endDate: endDate?.split('T')?.[0],
                  status: status?.key || null,
                  pagination: { take: 10000000, Skip: 0 },
                }}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={HandelClearFilter}
                className="inline-flex md:w-max w-full justify-center items-center px-4 py-2.5 border bg-red-50  border-red-300 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100"
              >
                حذف فیلتر
              </button>
            </div>

          </div>
        </div>

        <div dir="rtl" className="relative w-full overflow-x-auto md:rounded-lg mt-8 p-2">
          <div className="min-w-max w-full">

            <Table hoverable={false} className="whitespace-nowrap">
              <Table.Head className="bg-gray-200 border-b border-gray-400">
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">ردیف</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">عنوان طرح</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">نام</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">نام کاربری</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">تاریخ تراکنش</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">زمان تراکنش</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">توضیح تراکنش</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">مبلغ تراکنش</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">نوع تراکنش</Table.HeadCell>
                <Table.HeadCell className="text-center text-sm text-gray-700 p-4">وضعیت تراکنش</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {response?.data?.length > 0 ? (
                  response.data.map((item, idx) => (
                    <Table.Row
                      key={item.id ?? idx}
                      className="text-center font-normal text-xs text-dominant-500"
                    >
                      <Table.Cell className="p-3">{Skip + idx + 1}</Table.Cell>
                      <Table.Cell className="p-3">{item.planTitle ?? '-'}</Table.Cell>
                      <Table.Cell className="p-3">{item.user?.name}</Table.Cell>
                      <Table.Cell className="p-3">{item.user?.username}</Table.Cell>
                      <Table.Cell className="p-3">
                        {item.createDate && getDate(item.createDate)}
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {item.createDate?.split('T')?.[1]}
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {item.flowDescription ?? '-----'}
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {Number(item.moneyAmount).toLocaleString('fa-IR')} ریال
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {FindType(OperationType, item.operationType)?.name}
                      </Table.Cell>
                      <Table.Cell
                        className={`p-3 font-medium ${FindType(walletflowstatus, item.status)?.textcolor
                          }`}
                      >
                        {FindType(walletflowstatus, item.status)?.name}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={10} className="text-center text-gray-500 py-4">
                      گزارشی یافت نشد
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            {isloading && (
              <div className="w-full flex items-center justify-center py-8">
                <BouncingDotsLoader />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center py-8">
          <PaginationComponet
            total={response?.pagination?.total}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

      </div>
    </div>
  );
}

export default Transactions;
