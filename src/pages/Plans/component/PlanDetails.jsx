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
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 w-full h-full flex flex-col items-center align-middle p-10 gap-y-5 ">


        <button
          className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>


        {' '}
        {isloading ? (
          <div className="w-full flex flex-col items-center justify-center h-screen">
            {' '}
            <BouncingDotsLoader />
          </div>
        ) : details ? (
          <div dir="rtl" className="w-full bg-white p-6 rounded-lg shadow-xl">
            <div className="grid grid-cols-12 gap-6">
              {/* بازگشت */}
              <div className="col-span-12 flex justify-start">
                {/* در حالت RTL، justify-start محتوا رو به سمت راست می‌برد */}
                <button
                  onClick={() => navigate(-1)}
                  className="sm:w-max w-full bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition px-6 py-1"
                >
                  بازگشت
                </button>
              </div>


              {/* تصاویر کاور */}
              <div className="col-span-12">
                <div className=" grid  grid-cols-1  sm:grid-cols-2  md:grid-cols-3   xl:grid-cols-5  gap-4">
                  {details.coverImagePaths?.map((img, idx) => (
                    <>
                      <div
                        key={idx}
                        className=" relative overflow-hidden  rounded-lg  shadow-lg  group w-full ">
                        {/* با یک wrapper برای نگه‌داشتن نسبت 4:3 */}
                        <div className="w-full h-0 pb-[75%]" />

                        <img
                          src={getBaseUrl() + img.value}
                          alt={`cover-${idx}`}
                          className=" absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </>
                  ))}
                </div>
              </div>



              {/* جداکننده */}
              <div className="col-span-12 border-b-2 border-gray-300" />

              {/* اطلاعات طرح */}
              <div className="col-span-12 grid grid-cols-12 gap-4">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 bg-white flex flex-col justify-between p-3 border border-gray-300 rounded-lg shadow-sm min-h-[60px] gap-y-2.5 hover:bg-gray-100"
                  >
                    <span className="text-xs text-gray-800 font-bold text-right">
                      {item.title}:
                    </span>
                    <span className="text-sm text-gray-600 break-words text-right">
                      {item.value || 'مشخص نشده'}
                    </span>
                  </div>
                ))}
              </div>

              {/* آدرس فرابورس و توضیحات */}
              <div className="col-span-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-6 flex flex-col p-4 bg-gray-100 rounded-lg shadow-sm min-h-[70px]">
                  <span className="text-xs text-gray-800 font-bold mb-2 text-right">
                    آدرس فرابورس:
                  </span>
                  {details.ifbUrl ? (
                    <a
                      href={details.ifbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 underline break-all text-right"
                    >
                      {details.ifbUrl}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-600 text-right">ندارد</span>
                  )}
                </div>

                <div className="col-span-12 md:col-span-6 flex flex-col p-4 bg-gray-100 rounded-lg shadow-sm min-h-[70px]">
                  <span className="text-xs text-gray-800 font-bold mb-2 text-right">
                    توضیحات:
                  </span>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap text-right">
                    {details.descriptions || 'مشخص نشده'}
                  </p>
                </div>
              </div>
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
