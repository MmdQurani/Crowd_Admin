/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import React, { useEffect, useState } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import Input from 'component/input/Input';
import Button from 'component/button/Button';
import { getDate } from 'component/DateFunctions/DateFunctions';
import { useNavigate } from 'react-router';
import { GetAllRefundRequestsReq, RefundRequestReq } from './Api/walletReq';
import { RefundRequestStatus } from './enum/request';
import { toast } from 'react-toastify';
import {
  ConfirmRefundRequestApi,
  DepositeRefundRequestApi,
  RejectRefundRequestApi
} from './Api/walletApi';

function Wallet() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();
  const [nationalId, setNationalId] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    GetALLUsersOrder();
  }, [currentPage]);

  useEffect(() => {
    HandleSearch();
  }, [nationalId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Skip = currentPage === 1 ? 0 : 5 * (currentPage - 1);

  const GetALLUsersOrder = async () => {
    setIsloading(true);
    const res = await GetAllRefundRequestsReq({
      nationalId,
      pagination: {
        take: 5,
        skip: Skip
      }
    });

    setIsloading(false);
    setResponse(res);
  };

  const HandleSearch = async () => {
    setIsloading(true);
    const res = await GetAllRefundRequestsReq({
      usernameQuery: nationalId,
      pagination: {
        take: 5,
        skip: Skip
      }
    });
    console.log(res);
    setIsloading(false);
    setResponse(res);
  };

  const RefundRequest = async (api, id) => {
    const res = await RefundRequestReq(api, { refundRequestId: id });
    if (res === true) {
      toast.success('ثبت شد!');
      GetALLUsersOrder();
    } else {
      toast.error(res);
    }
  };

  const handleRefundStatus = (status, id) => {
    switch (status) {
      case 1:
        return (
          <div className="flex gap-x-2">
            {' '}
            <button
              className="text-white px-3 py-2  rounded-lg bg-satisfication-85"
              onClick={() => RefundRequest(ConfirmRefundRequestApi(), id)}>
              تایید{' '}
            </button>
            <button
              className="text-white px-3 py-2 rounded-lg bg-satisfication-60"
              onClick={() => RefundRequest(RejectRefundRequestApi(), id)}>
              رد{' '}
            </button>
          </div>
        );
      case 2:
        return (
          <button
            className="text-white px-3 py-2  rounded-lg bg-accent"
            onClick={() => RefundRequest(DepositeRefundRequestApi(), id)}>
            پرداخت{' '}
          </button>
        );
      case 3:
        return;
      case 4:
        return;
    }
  };
  console.log(response);

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <div className="bg-slate-100 rounded-lg  w-1/2 flex justify-center gap-x-3 p-3">
          <Input
            label="جست و جو"
            placeholder="...نام کاربری"
            setvalue={setNationalId}
            value={nationalId}
            id="element"
          />
          <div className="flex items-end ">
            <Button
              disable={nationalId?.length === 10 || nationalId?.length === 11}
              name="جست و جو "
              func={() => HandleSearch()}
            />
          </div>
        </div>
        <div className="relative overflow-x-auto md:rounded-lg mt-8 p-2">
          <table className="table-auto bordered font-IRANYekanX w-full " id="element">
            <thead className="font-normal w-full text-base text-right text-dominant-500">
              <tr className="">
                <th className="  bg-secondary p-2">ردیف</th>
                <th className="  bg-secondary p-2">تاریخ درخواست</th>
                <th className="  bg-secondary p-2">مبلغ درخواست</th>
                <th className="  bg-secondary p-2"> آخرین تغییر درخواست</th>
                <th className="  bg-secondary p-2 flex justify-center"> نام درخواست دهنده </th>
                <th className="  bg-secondary p-2 ">نوع کاربر</th>
                <th className="  bg-secondary p-2 "> نام کاربری</th>
                <th className="  bg-secondary p-2 ">وضعیت درخواست</th>
                <th className="  bg-secondary p-2 "></th>
              </tr>
            </thead>
            <tbody className="p-10 w-full">
              {response &&
                response?.data?.map((item, index) => (
                  <tr
                    key={index}
                    className=" border-t-2 text-center  border-2 border-accent rounded-md font-semibold text-caption  text-dominant-500  ">
                    <td className="p-2 ">{Skip + index + 1}</td>
                    <td className="p-2 ">{getDate(item?.createDate)}</td>
                    <td className="p-2 ">{Number(item?.amount).toLocaleString()} ریال</td>
                    <td className="p-2  ">{getDate(item?.lastUpdateTime)}</td>
                    <td className="p-2  ">{item?.user?.name} </td>
                    <td className="p-2  ">
                      {item?.user?.type == 1 || item?.user?.type == 3 ? 'حقیقی' : 'حقوقی'}{' '}
                    </td>
                    <td className="p-2 ">{item?.user?.username} </td>
                    <td className="p-2 f ">{RefundRequestStatus[item?.refundRequestStatus]}</td>
                    <td className="p-2 ">
                      {handleRefundStatus(item?.refundRequestStatus, item?.id)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isloading && (
            <div className=" w-full flex-col flex items-center">
              <div className="border-gray-300 h-12 w-12 animate-spin rounded-full border-8 border-t-accent mt-2"></div>
            </div>
          )}
          {!response && isloading === false && (
            <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
              <p className="text-white">کاربری یافت نشد </p>
            </div>
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

export default Wallet;
