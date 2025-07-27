/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { GetPlanDetailsReq } from '../Api/PlanReq';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { findStatusTitle } from 'component/db/PlanStatusEnum';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import getBaseUrl from 'component/Axios/getBaseUrl';

const PlanDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState();
  const [isloading, setIsloading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    GetPlanDetails();
  }, []);

  const GetPlanDetails = async () => {
    setIsloading(true);
    const res = await GetPlanDetailsReq(id);
    if (res) {
      setDetails(res);
    } else {
      setDetails(false);
    }
    setIsloading(false);
  };

  const FundingTypeEnum = [
    { name: ' همه یا هیچ', key: 1 },
    { name: 'شناور', key: 2 },
    { name: '60', key: 60 },
    { name: '70', key: 70 },
    { name: '80', key: 80 }
  ];

  const data = [
    {
      title: 'تاریخ ایجاد ',
      value: details?.createDate && DateFunction2.getDate(details?.createDate)
    },
    { title: ' عنوان طرح', value: details?.title },
    { title: ' (EN) عنوان طرح', value: details?.titleEn },
    { title: 'نماد طرح', value: details?.symbol },
    { title: '(En) نماد طرح', value: details?.symbolEn },
    { title: 'محل اجرا', value: details?.executionLocation },
    { title: 'آیدی گروه صنعتی', value: details?.industryGroupId },
    { title: ' گروه صنعتی', value: details?.industryGroupTitle },
    { title: 'آیدی زیر گروه صنعتی', value: details?.subIndustryGroupId },
    { title: 'زیر گروه صنعتی', value: details?.subIndustryGroupTitle },
    {
      title: 'تاریخ شروع ',
      value: details?.startDate && DateFunction2.getDate(details?.startDate)
    },
    { title: 'تاریخ پایان ', value: details?.endDate && DateFunction2.getDate(details?.endDate) },
    {
      title: 'تاریخ آغاز جمع آوری وجوه ',
      value: details?.underwritingStartDate && DateFunction2.getDate(details?.underwritingStartDate)
    },
    {
      title: ' تاریخ پایان جمع آوری وجوه ',
      value: details?.underwritingEndDate && DateFunction2.getDate(details?.underwritingEndDate)
    },
    { title: 'وضعیت نمایش در سامانه', value: details?.isVisible ? 'درحال نمایش' : 'عدم نمایش' },
    { title: 'تعداد اقساط', value: details?.installmentCount },
    { title: 'دوره اقساط', value: details?.installmentPeriod },
    { title: 'دوره سرمایه گذاری ', value: details?.investmentPeriod },
    {
      title: 'مبلغ هر واحد',
      value: details?.unitAmount && Number(details?.unitAmount).toLocaleString()
    },
    { title: 'تعداد واحد ', value: details?.unitCount },
    // { title: ' حداقل واحد مورد نیاز  ', value: details?.minRequiredUnit },
    {
      title: 'حداکثر واحد قابل خرید (حقوقی)',
      value:
        details?.maxUnitPerLegalInvestor &&
        Number(details?.maxUnitPerLegalInvestor).toLocaleString()
    },
    {
      title: 'حداکثر واحد قابل خرید (حقیقی)',
      value:
        details?.maxUnitPerIndividualInvestor &&
        Number(details?.maxUnitPerIndividualInvestor).toLocaleString()
    },
    {
      title: 'حداقل واحد قابل خرید (حقوقی)',
      value:
        details?.minUnitPerLegalInvestor &&
        Number(details?.minUnitPerLegalInvestor).toLocaleString()
    },
    {
      title: 'حداقل واحد قابل خرید (حقیقی)',
      value:
        details?.minUnitPerIndividualInvestor &&
        Number(details?.minUnitPerIndividualInvestor).toLocaleString()
    },
    {
      title: 'تعداد واحد خریداری شده ',
      value: details?.unitRaised && Number(details?.unitRaised).toLocaleString()
    },
    { title: 'مبلغ هدف', value: details?.goal && Number(details?.goal).toLocaleString() },
    {
      title: 'مبلغ جمع آواری شده',
      value: details?.amountRaised && Number(details?.amountRaised).toLocaleString()
    },
    {
      title: 'تعداد واحد قابل خرید ',
      value: details?.unitAvailable && Number(details?.unitAvailable).toLocaleString()
    },
    {
      title: 'سود کل دوره ',
      value: details?.totalProfitRate && Number(details?.totalProfitRate * 100).toFixed(2)
    },
    {
      title: 'سود ماهانه',
      value: details?.monthlyProfitRate && Number(details?.monthlyProfitRate * 100).toFixed(2)
    },
    {
      title: 'سود سالانه ',
      value: details?.annualProfiteRate && Number(details?.annualProfiteRate * 100).toFixed(2)
    },
    { title: 'عنوان سرمایه گذاری', value: details?.investeeTitle },
    { title: 'وضعیت طرح', value: details?.state && findStatusTitle(details?.state)?.name },
    { title: 'ضمانت نامه طرح', value: details?.warranty },
    // {
    //   title: ' نوع تامین مالی',
    //   value:
    //     details?.fundingType &&
    //     FundingTypeEnum.find((item) => item.key == details?.fundingType)?.name
    // },
    { title: 'آیدی فرابورس طرح ', value: details?.ifbProjectId },
    {
      title: '(حقیقی)تعدادسرمایه گذار  ',
      value:
        details?.individualInvestorCount &&
        Number(details?.individualInvestorCount).toLocaleString()
    },
    {
      title: '(حقیقی)تعداد واحدهای سرمایه گذاری   ',
      value:
        details?.individualInvestorUnitCount &&
        Number(details?.individualInvestorUnitCount).toLocaleString()
    },
    {
      title: '(حقیقی)ارزش واحدهای سرمایه گذاری   ',
      value:
        details?.individualInvestorValueSum &&
        Number(details?.individualInvestorValueSum).toLocaleString()
    },
    {
      title: '(حقوقی)تعدادسرمایه گذار  ',
      value: details?.legalInvestorCount && Number(details?.legalInvestorCount).toLocaleString()
    },
    {
      title: '(حقوقی)تعداد واحدهای سرمایه گذاری   ',
      value:
        details?.legalInvestorUnitCount && Number(details?.legalInvestorUnitCount).toLocaleString()
    },
    {
      title: '(حقوقی)ارزش واحدهای سرمایه گذاری   ',
      value:
        details?.legalInvestorValueSum && Number(details?.legalInvestorValueSum).toLocaleString()
    },
    {
      title: 'تعداد کل سرمایه گذاران',
      value: details?.totalInvestors && Number(details?.totalInvestors).toLocaleString()
    },
    {
      title: 'سود هر دوره ',
      value:
        details?.fixedProvisionalProfit && Number(details?.fixedProvisionalProfit * 100).toFixed(2)
    },
    { title: 'محل صرف طرح', value: details?.utilizationPlan },
    { title: 'درصد شناوری', value: `%${details?.floatingPercentage * 100}` }
  ];

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-3/4 max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 gap-y-5 ">
        {' '}
        {isloading ? (
          <div className="w-full flex flex-col items-center justify-center h-screen">
            {' '}
            <BouncingDotsLoader />
          </div>
        ) : details ? (
          <div className="w-full h-auto flex flex-col items-center justify-start gap-y-10  bg-white">
            <div className="w-full flex  items-center justify-end text-sm   cursor-pointer p-3">
              <span
                className="cursor-pointer border-b border-gray-800 p-2 text-gray-800 font-semibold "
                onClick={() => navigate(-1)}>
                {' '}
                بازگشت
              </span>
            </div>
            {/* cover pictures  */}
            <div className="w-full h-auto flex justify-center gap-x-3 items-center">
              {details?.coverImagePaths?.map((item, index) => (
                <img
                  key={index}
                  src={getBaseUrl() + item?.value}
                  className="w-[250px] h-[250px] bg-cover rounded-md shadow-lg "
                />
              ))}
            </div>
            {/*  divider  */}
            <div className="border-b-2  border-gray-300 w-[90%] " />
            {/* plan informations */}
            <div className="w-[90%] flex justify-between items-center flex-wrap gap-4 h-auto ">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className="flex min-w-[15%] justify-between items-center text-xs flex-wrap  border border-gray-500 shadow-md  min-h-[50px] p-2 rounded-lg  ">
                  <span dir="ltr" className="text-gray-800 font-bold">
                    :{item?.title}{' '}
                  </span>
                  <span className="text-sm  text-gray-600 ">
                    {item?.value ? item?.value : 'مشخص نشده '}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex w-[95%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
              <span className="text-gray-800 font-bold"> آدرس فرابورس:</span>
              <a
                href={details?.ifbUrl}
                className="text-sm font-bold underline text-blue-400 cursor-pointer  ">
                {details?.ifbUrl ? details?.ifbUrl : 'ندارد'}
              </a>
            </div>
            <div className="flex w-[95%] justify-start gap-x-5 items-center text-xs  bg-gray-100  min-h-[50px] p-2 rounded-lg  ">
              <span className="text-gray-800 font-bold">توضیحات :</span>
              <span className="text-sm  text-gray-600 ">
                {details?.descriptions ? details?.descriptions : 'مشخص نشده '}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center h-full">
            اطلاعاتی برای طرح مورد نظز یافت نشد{' '}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;
