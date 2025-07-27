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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full  fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-gray-500 rounded-lg  w-full flex  flex-wrap justify-start gap-5 p-3 items-end">
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
        </div>

        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2 w-full">
          <table className="table-auto bordered font-IRANYekanX w-full ">
            <thead className="font-normal w-full text-sm   text-center text-dominant-500">
              <tr className=" bg-white shadow-2xl rounded-md ">
                <th className="   p-2 bg-white">ردیف</th>
                <th className="   p-2 bg-white">عنوان طرح</th>
                <th className="   p-2 bg-white">نام </th>
                <th className="   p-2 bg-white">نام کاربری</th>
                <th className="   p-2 bg-white">تاریخ تراکنش</th>
                <th className="   p-2 bg-white">زمان تراکنش</th>
                <th className="   p-2 bg-white">توضیح تراکنش</th>
                <th className="   p-2 bg-white">مبلغ تراکنش</th>
                <th className="   p-2 bg-white">نوع تراکنش</th>
                <th className="   p-2 bg-white">وضعیت تراکنش</th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-t text-center rounded-md font-normal text-xs items-end text-dominant-500  ">
                    <td className="p-3">{Skip + index + 1}</td>
                    <td className="p-3">{item?.planTitle ? item?.planTitle : '-'}</td>
                    <td className="p-3">{item?.user?.name}</td>
                    <td className="p-3">{item?.user?.username}</td>
                    <td className="p-3">{item?.createDate && getDate(item?.createDate)}</td>
                    <td className="p-3">{item?.createDate && item?.createDate?.split('T')?.[1]}</td>
                    <td className="p-3">
                      {item?.flowDescription ? item?.flowDescription : '-----'}
                    </td>
                    <td className="p-3">{Number(item?.moneyAmount)?.toLocaleString()} ریال</td>
                    <td className="p-3">
                      {item?.operationType && FindType(OperationType, item?.operationType)?.name}
                    </td>
                    <td
                      className={`p-3 ${
                        FindType(walletflowstatus, item?.status)?.textcolor
                      } font-medium`}>
                      {FindType(walletflowstatus, item?.status)?.name}
                    </td>

                    {/* {item?.status == 2 && item?.type == 6 && item?.walletFlow == null && (
                      <td className="p-2 mb-3">
                        <FinancialStatementsModal
                          id={item?.id}
                          username={item?.user?.username}
                          Alert={Alert}
                          setAlert={setAlert}
                          amount={item?.amount}
                        />
                      </td>
                    )} */}
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full justify-center flex items-center py-8">
              <BouncingDotsLoader />
            </div>
          )}
          {(!response || response?.pagination?.total == 0) && (
            <span className=" w-full flex items-center py-5 text-base font-medium justify-center  text-gray-500">
              گزارشی یافت نشد
            </span>
          )}
          <div className=" relative flex justify-center py-8">
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

export default Transactions;
