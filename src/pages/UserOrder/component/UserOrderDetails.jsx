/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router';
import { GetUsersOrderDetailsReq } from '../Api/userOrderReq';
import { useEffect, useState } from 'react';
import Sidebar from 'component/layout/sidebar/SideBar';
import { getDate } from 'component/DateFunctions/DateFunctions';

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

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col gap-y-5 items-center align-middle p-10">
        <div className="w-full flex justify-end ">
          <p
            className="border-b-2 border-gray-400 p-2   text-gray-600 font-bold text-sm cursor-pointer"
            onClick={() => navigate(-1)}>
            بازگشت
          </p>
        </div>
        <div className=" w-full bg-white shadow-xl rounded-lg text-black  p-10 flex  flex-col  flex-wrap items-center  gap-y-5">
          <div className="flex  gap-x-2 items-center shadow-2xl ">
            <p className="font-semibold text-base text-gray-600">نام طرح:</p>
            <p>{details?.data?.investment?.title} </p>
          </div>
          <div className="border-b  border-dashed border-gray-500 w-full " />
          <div className="flex  flex-wrap gap-x-6 p-4">
            <div className="flex  gap-x-2 items-center shadow-2xl ">
              <p className="font-semibold text-base text-gray-600">تاریخ شروع طرح:</p>
              <p>
                {details?.data?.investment?.createDate &&
                  getDate(details?.data?.investment?.createDate)}{' '}
              </p>
            </div>
            <div className="flex  gap-x-2 items-center shadow-2xl ">
              <p className="font-semibold text-base text-gray-600">نرخ سالانه سود:</p>
              <p>
                {details?.data?.investment?.annualRate &&
                  Number(details?.data?.investment?.annualRate * 100).toFixed()}{' '}
                درصد{' '}
              </p>
            </div>
            <div className="flex  gap-x-2 items-center shadow-2xl ">
              <p className="font-semibold text-base text-gray-600">تعداد دوره پرداخت سود:</p>
              <p>{details?.data?.investment?.installmentCount} </p>
            </div>
            <div className="flex  gap-x-2 items-center shadow-2xl ">
              <p className="font-semibold text-base text-gray-600"> فاصله بین اقساط:</p>
              <p>{details?.data?.investment?.installmentPeriod}ماه </p>
            </div>
            <div className="flex  gap-x-2 items-center shadow-2xl ">
              <p className="font-semibold text-base text-gray-600">زمان کل دروه:</p>
              <p>{details?.data?.investment?.investmentPeriod} ماه </p>
            </div>
          </div>
          <div className="border-b border-dashed border-gray-500 w-full " />
          <p className="w-fusemfont-semiboldont-bobase text-gray-600 text-lg ">
            برنامه پرداخت سود طرح :
          </p>
          <div className=" flex flex-wrap gap-4">
            {details?.data?.investment?.scheduledPayments &&
              details?.data?.investment?.scheduledPayments?.map((item, index) => (
                <div className=" w-[200px] flex flex-wrap " key={index}>
                  <div className=" gap-y-3 text-sm rounded-lg shadow-2xl p-3">
                    <div className="flex  gap-x-2 items-center justify-between ">
                      <p className="font-normal text-sm text-dominant-500"> تاریخ پرداخت:</p>
                      <p>{item?.date && getDate(item?.date)} </p>
                    </div>
                    <div className="flex  gap-x-2 items-center justify-between">
                      <p className="font-normal text-sm text-dominant-500"> مبلغ پرداختی:</p>
                      <p>{item?.amount && Number(item?.amount)?.toLocaleString()} ریال </p>
                    </div>
                    <div className="flex  gap-x-2 items-center justify-between">
                      <p className="font-normal text-sm text-dominant-500"> درصد سود دوره:</p>
                      <p>{Number(item?.percent * 100).toFixed()} درصد </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="border-b border-dashed border-gray-500 w-full " />

          <div className="flex w-full flex-col p-2 gap-y-2 ">
            <p className="font-semibold text-base text-gray-600">توضیحات طرح:</p>
            <p className="px-5 text-justify">{details?.data?.investment?.description} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
