/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { GetPlanDetailsReq, UpdatePlanDetailsReq } from '../Api/PlanReq';
import FileUploadPage from 'component/input/uploadInput';
import DropDown from 'component/DropDown/DropDown';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import { planStatusEnum } from 'component/db/PlanStatusEnum';
import DatePickerPersian from 'component/Datepicker/datepicker';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import getBaseUrl from 'component/Axios/getBaseUrl';
import { HandleOnChange } from 'component/GlobalyTools/UseAbleFunction';
import { IoIosArrowBack, IoMdAdd, IoMdArrowBack, IoMdClose, IoMdMenu } from 'react-icons/io';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';

const PlanDetailsEdit = () => {
  const { id } = useParams();
  const [isloading, setIsloading] = useState();
  const [details, setDetails] = useState();
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [symbol, setSymbol] = useState('');
  const [symbolEn, setSymbolEn] = useState('');
  const [executionLocation, setExecutionLocation] = useState('');
  const [industryGroupId, setIndustryGroupId] = useState('');
  const [industryGroupTitle, setIndustryGroupTitle] = useState('');
  const [subIndustryGroupId, setSubIndustryGroupId] = useState('');
  const [subIndustryGroupTitle, setSubIndustryGroupTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [underwritingStartDate, setUnderwritingStartDate] = useState(null);
  const [underwritingEndDate, setUnderwritingEndDate] = useState(null);
  const [installmentCount, setInstallmentCount] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState(0);
  const [investmentPeriod, setInvestmentPeriod] = useState(0);
  const [unitAmount, setUnitAmount] = useState(0);
  const [unitCount, setUnitCount] = useState(0);
  // const [minRequiredUnit, setMinRequiredUnit] = useState(0);
  const [maxUnitPerLegalInvestor, setMaxUnitPerLegalInvestor] = useState(0);
  const [maxUnitPerIndividualInvestor, setMaxUnitPerIndividualInvestor] = useState(0);
  const [minUnitPerLegalInvestor, setMinUnitPerLegalInvestor] = useState(0);
  const [minUnitPerIndividualInvestor, setMinUnitPerIndividualInvestor] = useState(0);
  const [warranty, setwarranty] = useState('');
  const [ifbProjectId, setIfbProjectId] = useState('');
  const [ifbUrl, setIfbUrl] = useState('');
  const [description, setDescription] = useState('');
  const [fundingType, setFundingType] = useState('');
  const [coverImagePaths, setCoverImagePaths] = useState([]);
  const [state, setstate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [fixedProvisionalProfit, setFixedProvisionalProfit] = useState(0);
  const [totalProfitRate, setTotalProfitRate] = useState(0);
  const [monthlyProfitRate, setMonthlyProfitRate] = useState(0);
  const [annualProfiteRate, setAnnualProfiteRate] = useState(0);
  const [response, setResponse] = useState();
  const [floatingPercentage, setFloatingPercentage] = useState();
  const [utilizationPlan, setUtilizationPlan] = useState('');

  const FundingTypeEnum = [
    { name: ' همه یا هیچ', key: 1 },
    { name: 'شناور', key: 2 },
    { name: '60', key: 60 },
    { name: '70', key: 70 },
    { name: '80', key: 80 }
  ];
  const navigate = useNavigate();
  // Fetching plan details when id changes
  useEffect(() => {
    GetPlanDetails();
  }, [id]);

  useEffect(() => {
    if (details) {
      // Set the state values based on the `details` object
      setTitle(details?.title || '');
      setTitleEn(details?.titleEn || '');
      setSymbol(details?.symbol || '');
      setSymbolEn(details?.symbolEn || '');
      setExecutionLocation(details?.executionLocation || '');
      setIndustryGroupId(details?.industryGroupId || '');
      setIndustryGroupTitle(details?.industryGroupTitle || '');
      setSubIndustryGroupId(details?.subIndustryGroupId || '');
      setSubIndustryGroupTitle(details?.subIndustryGroupTitle || '');
      setStartDate(details?.startDate ? DateFunction2.getDate(details?.startDate) : null);
      setEndDate(details?.endDate ? DateFunction2.getDate(details?.endDate) : null);
      setUnderwritingStartDate(
        details?.underwritingStartDate
          ? DateFunction2.getDate(details?.underwritingStartDate)
          : null
      );
      setUnderwritingEndDate(
        details?.underwritingEndDate ? DateFunction2.getDate(details?.underwritingEndDate) : null
      );
      setInstallmentCount(details?.installmentCount || 0);
      setInstallmentPeriod(details?.installmentPeriod || 0);
      setInvestmentPeriod(details?.investmentPeriod || 0);
      setUnitAmount(details?.unitAmount || 0);
      setUnitCount(details?.unitCount || 0);
      // setMinRequiredUnit(details?.minRequiredUnit || 0);
      setFloatingPercentage(details?.floatingPercentage * 100);
      setMaxUnitPerLegalInvestor(details?.maxUnitPerLegalInvestor || 0);
      setMaxUnitPerIndividualInvestor(details?.maxUnitPerIndividualInvestor || 0);
      setMinUnitPerLegalInvestor(details?.minUnitPerLegalInvestor || 0);
      setMinUnitPerIndividualInvestor(details?.minUnitPerIndividualInvestor || 0);
      setwarranty(details?.warranty || '');
      setIfbProjectId(details?.ifbProjectId || '');
      setIfbUrl(details?.ifbUrl || '');
      setDescription(details?.description || '');
      setFundingType(
        (details?.fundingType &&
          FindRelatedItemforDefault(FundingTypeEnum, details?.fundingType)) ||
        ''
      );
      setCoverImagePaths(
        (details?.coverImagePaths?.length > 0 &&
          details?.coverImagePaths?.map((item) => item?.value)) ||
        []
      );
      setstate((details?.state && FindRelatedItemforDefault(planStatusEnum, details?.state)) || '');
      setIsVisible(
        (details?.isVisible &&
          FindRelatedItemforDefault(
            [
              { name: ' قابل مشاهده ', key: true },
              { name: 'غیر قابل مشاهده', key: false }
            ],
            details?.isVisible
          )) ||
        false
      );
      setFixedProvisionalProfit(Number(details?.fixedProvisionalProfit * 100).toFixed(2) || 0);
      setTotalProfitRate(Number(details?.totalProfitRate * 100).toFixed(2) || 0);
      setMonthlyProfitRate(Number(details?.monthlyProfitRate * 100).toFixed(2) || 0);
      setAnnualProfiteRate(Number(details?.annualProfiteRate * 100).toFixed(2) || 0);
    }
  }, [details]);

  const FindRelatedItemforDefault = (arr, key) => arr.find((item) => item.key == key);

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

  const convertDate = (date) => {
    if (date?.includes('T')) {
      return date?.split('T')?.[0];
    } else if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else {
      return date;
    }
  };

  const Updateplan = async () => {
    setIsloading(true);
    const res = await UpdatePlanDetailsReq({
      investmentId: id,
      title,
      titleEn,
      symbol,
      symbolEn,
      description,
      startDate: startDate && convertDate(startDate),
      endDate: endDate && convertDate(endDate),
      underwritingStartDate: underwritingStartDate && convertDate(underwritingStartDate),
      underwritingEndDate: underwritingEndDate && convertDate(underwritingEndDate),
      unitAmount,
      maxUnitPerLegalInvestor,
      maxUnitPerIndividualInvestor,
      minUnitPerLegalInvestor,
      minUnitPerIndividualInvestor,
      unitCount,
      warranty,
      // minRequiredUnit,
      totalProfitRate: totalProfitRate && totalProfitRate / 100,
      monthlyProfitRate: monthlyProfitRate && monthlyProfitRate / 100,
      annualProfiteRate: annualProfiteRate && annualProfiteRate / 100,
      industryGroupId,
      industryGroupTitle,
      subIndustryGroupId,
      subIndustryGroupTitle,
      installmentCount,
      installmentPeriod,
      investmentPeriod,
      fundingType:
        fundingType && FundingTypeEnum.find((item) => item.name == fundingType?.key)?.key,
      ifbProjectId,
      ifbUrl,
      floatingPercentage: floatingPercentage && floatingPercentage / 100,
      executionLocation,
      fixedProvisionalProfit: fixedProvisionalProfit && fixedProvisionalProfit / 100,
      coverImagePaths,
      state: state && state?.key,
      isVisible: isVisible && isVisible?.key,
      utilizationPlan
    });
    if (res) {
      setResponse('success');
      setTimeout(() => {
        navigate(-1);
      }, 1800);
    } else {
      setResponse('faield');
    }
    setTimeout(() => {
      setResponse();
    }, 1800);
    setIsloading(false);
  };

  const handleInputChange = (index, path) => {
    const newInputs = [...coverImagePaths];
    newInputs[index] = path; // Update the input with the file path
    setCoverImagePaths(newInputs);
  };

  // Function to increase the number of inputs
  const addInputField = () => {
    setCoverImagePaths([...coverImagePaths, '']); // Add an empty input field to the array
  };

  // Function to decrease the number of inputs
  const removeInputField = (index) => {
    const newInputs = [...coverImagePaths];
    newInputs.splice(index, 1); // Remove the input at the specified index
    setCoverImagePaths(newInputs);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex flex-row items-start h-auto">
      {/* سایدبار */}
      <div className="w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 w-full h-full flex  flex-wrap gap-x-3   items-center align-middle p-10 gap-y-5 ">

        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        {' '}
        {isloading ? (
          <div className="w-full justify-center h-screen items-center ">
            {' '}
            <BouncingDotsLoader />
          </div>
        ) : (
          <div className="w-full flex flex-col  items-center justify-start gap-y-16">

            {/* تایتل صفحه */}
            <div className=" w-full flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200 border-l-4 ">
              <h2 className="text-lg font-semibold text-gray-800">
                ویرایش طرح <span className="text-indigo-500">{details?.title}</span>
              </h2>
              <button
                onClick={() => navigate(-1)}
                className=" flex items-center text-indigo-500 text-sm font-medium hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded">
                بازگشت
                <IoIosArrowBack className='text-lg' />
              </button>
            </div>

            {/* اینپوت های آپدیت دیتاها */}
            <div className=" w-full grid grid-cols-12 h-auto gap-4 items-center justify-start">
              {/* title */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="title" className=" text-xs  ">
                  عنوان{' '}
                </label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* titleEn */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="titleEn" className=" text-xs  ">
                  عنوان (EN){' '}
                </label>
                <input
                  onChange={(e) => setTitleEn(e.target.value)}
                  value={titleEn}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* symbol */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="symbol" className=" text-xs  ">
                  نماد
                </label>
                <input
                  onChange={(e) => setSymbol(e.target.value)}
                  value={symbol}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* symbolEn */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="symbolEn" className=" text-xs  ">
                  نماد (EN){' '}
                </label>
                <input
                  onChange={(e) => setSymbolEn(e.target.value)}
                  value={symbolEn}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* executionLocation */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="executionLocation" className=" text-xs  ">
                  محل اجرای طرح
                </label>
                <input
                  onChange={(e) => setExecutionLocation(e.target.value)}
                  value={executionLocation}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* industryGroupId */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="industryGroupId" className=" text-xs  ">
                  ایدی گروه صنعت{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setIndustryGroupId)}
                  value={industryGroupId}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* industryGroupTitle */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="industryGroupTitle" className=" text-xs  ">
                  عنوان گروه صنعت{' '}
                </label>
                <input
                  onChange={(e) => setIndustryGroupTitle(e.target.value)}
                  value={industryGroupTitle}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* subIndustryGroupId */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="subIndustryGroupId" className=" text-xs  ">
                  آیدی زیر گروه صنعت{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setSubIndustryGroupId)}
                  value={subIndustryGroupId}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* subIndustryGroupTitle */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="subIndustryGroupTitle" className=" text-xs  ">
                  عنوان زیر گروه صنعت{' '}
                </label>
                <input
                  onChange={(e) => setSubIndustryGroupTitle(e.target.value)}
                  value={subIndustryGroupTitle}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* startDate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="startDate" className=" text-xs  ">
                  تاریخ شروع طرح{' '}
                </label>
                <DatePickerPersian onchange={setStartDate} value={startDate} />
              </div>
              {/* endDate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="endDate" className=" text-xs  ">
                  تاریخ پایان طرح{' '}
                </label>
                <DatePickerPersian onchange={setEndDate} value={endDate} />
              </div>
              {/* underwritingStartDate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="underwritingStartDate" className=" text-xs  ">
                  تاریخ آغاز جمع آوری وجوه{' '}
                </label>
                <DatePickerPersian
                  onchange={setUnderwritingStartDate}
                  value={underwritingStartDate}
                />
              </div>
              {/* underwritingEndDate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="underwritingEndDate" className=" text-xs  ">
                  تاریخ پایان جمع آوری وجوه{' '}
                </label>
                <DatePickerPersian onchange={setUnderwritingEndDate} value={underwritingEndDate} />
              </div>
              {/* installmentCount */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="installmentCount" className=" text-xs  ">
                  تعداد اقساط{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setInstallmentCount, 1, 100)}
                  value={installmentCount}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* installmentPeriod */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="installmentPeriod" className=" text-xs  ">
                  دوره اقساط{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setInstallmentPeriod, 1, 100)}
                  value={installmentPeriod}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* investmentPeriod */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="investmentPeriod" className=" text-xs  ">
                  دوره سرمایه گذاری{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setInvestmentPeriod, 1, 100)}
                  value={investmentPeriod}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* unitAmount */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="unitAmount" className=" text-xs  ">
                  قیمت هر واحد{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setUnitAmount, 1, 100000000)}
                  value={unitAmount.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* unitCount */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="unitCount" className=" text-xs  ">
                  تعداد واحد{' '}
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setUnitCount, 1, 100000000)}
                  value={unitCount.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* maxUnitPerLegalInvestor */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="maxUnitPerLegalInvestor" className=" text-xs  ">
                  حداکثر واحد قابل خرید (حقوقی)
                </label>
                <input
                  onChange={(e) =>
                    HandleOnChange(e, 'number', setMaxUnitPerLegalInvestor, 1, 100000000)
                  }
                  value={maxUnitPerLegalInvestor.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* maxUnitPerIndividualInvestor */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="maxUnitPerIndividualInvestor" className=" text-xs  ">
                  حداکثر واحد قابل خرید (حقیقی)
                </label>
                <input
                  onChange={(e) =>
                    HandleOnChange(e, 'number', setMaxUnitPerIndividualInvestor, 1, 100000000)
                  }
                  value={maxUnitPerIndividualInvestor.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* minUnitPerLegalInvestor */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="minUnitPerLegalInvestor" className=" text-xs  ">
                  حداقل واحد قابل خرید (حقوقی)
                </label>
                <input
                  onChange={(e) =>
                    HandleOnChange(e, 'number', setMinUnitPerLegalInvestor, 1, 100000000)
                  }
                  value={minUnitPerLegalInvestor.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* minUnitPerIndividualInvestor */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="minUnitPerIndividualInvestor" className=" text-xs  ">
                  حداقل واحد قابل خرید (حقیقی)
                </label>
                <input
                  onChange={(e) =>
                    HandleOnChange(e, 'number', setMinUnitPerIndividualInvestor, 1, 100000000)
                  }
                  value={minUnitPerIndividualInvestor.toLocaleString()}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* warranty */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="warranty" className=" text-xs  ">
                  ضمانت نامه طرح{' '}
                </label>
                <input
                  onChange={(e) => setwarranty(e.target.value)}
                  value={warranty}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* ifbProjectId */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="ifbProjectId" className=" text-xs  ">
                  آیدی فرابورس طرح{' '}
                </label>
                <input
                  onChange={(e) => setIfbProjectId(e.target.value)}
                  value={ifbProjectId}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* ifbUrl */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="ifbUrl" className=" text-xs  ">
                  آدرس فرابورس طرح
                </label>
                <input
                  onChange={(e) => setIfbUrl(e.target.value)}
                  value={ifbUrl}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* utilizationPlan    */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="utilizationPlan" className=" text-xs  ">
                  محل استفاده از سرمایه
                </label>
                <input
                  onChange={(e) => setUtilizationPlan(e.target.value)}
                  value={utilizationPlan}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />
              </div>
              {/* fixedProvisionalProfit */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="fixedProvisionalProfit" className=" text-xs  ">
                  سود پرداختی هر دوره(اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید
                  مانند 22.5)
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setFixedProvisionalProfit, 0, 100)}
                  value={fixedProvisionalProfit}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* totalProfitRate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="totalProfitRate" className=" text-xs  ">
                  سود کل دوره (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند
                  22.5)
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setTotalProfitRate, 1, 100)}
                  value={totalProfitRate}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* monthlyProfitRate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="monthlyProfitRate" className=" text-xs  ">
                  سود ماهانه (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)
                </label>
                <input
                  max={100}
                  onChange={(e) => HandleOnChange(e, 'number', setMonthlyProfitRate, 0, 100)}
                  value={monthlyProfitRate}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* annualProfiteRate */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="annualProfiteRate" className=" text-xs  ">
                  سود سالانه (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setAnnualProfiteRate, 0, 100)}
                  value={annualProfiteRate}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
              {/* floatingPercentage */}
              <div className=" md:col-span-4 sm:col-span-6 col-span-12 flex flex-col items-start  justify-start h-auto gap-y-1 ">
                <label htmlFor="floatingPercentage" className=" text-xs  ">
                  درصد شناوری (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند
                  22.5)
                </label>
                <input
                  onChange={(e) => HandleOnChange(e, 'number', setFloatingPercentage, 0, 100)}
                  value={floatingPercentage}
                  className=" w-full h-[40px] pr-2 text-start border border-gray-300 text-sm rounded-md "
                />{' '}
              </div>
            </div>

            {/* description */}
            <div className=" w-full flex flex-col items-start  justify-start h-auto gap-y-1 ">
              <label htmlFor="monthlyProfitRate" className="text-gray-600 text-base font-medium border-gray-300 pb-2">
                توضیحات طرح :{' '}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-start pr-2 text-gray-600 text-sm resize-y h-[240px] border border-gray-300 rounded-md "
              />
            </div>

            {/*  dropdown row  */}
            <div className=" grid grid-cols-12 w-full gap-y-4 gap-x-6 justify-between items-center">

              <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3  flex flex-col gap-y-1 items-start ">
                <label className=" text-xs   text-start">وضعیت طرح</label>
                <DropDown
                  arrey={planStatusEnum}
                  select={state}
                  setSelect={setstate}
                  height="h-[150px]"
                />
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 flex flex-col gap-y-1 items-start ">
                <label className=" text-xs   text-start">نمایش در سامانه</label>
                <DropDown
                  arrey={[
                    { name: ' قابل مشاهده ', key: true },
                    { name: 'غیر قابل مشاهده', key: false }
                  ]}
                  select={isVisible}
                  setSelect={setIsVisible}
                />
              </div>

            </div>

            {/* آپدیت تصاویر */}
            <div className="w-full flex flex-col gap-6">

              {/* عنوان بخش */}
              <div className="text-gray-600 text-base font-medium border-b border-gray-300 pb-2">
                بارگذاری تصاویر طرح:
              </div>

              {/* شبکه کارت‌ها */}
              <div className="grid grid-cols-12 gap-4">
                {coverImagePaths.map((path, index) => (
                  <div
                    key={index}
                    className=" relative group col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-3">
                    {/* کارت آپلود فایل */}
                    {!path && (
                      <div
                        className=" flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition hover:border-blue-400 hover:bg-blue-50">
                        <FileUploadPage
                          multiple={true}
                          setFileAddress={(i, p) => handleInputChange(i, p)}
                          id={index}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          {/* <FiPlus className="text-2xl text-gray-400 mb-1" /> */}
                          <span className="text-gray-400 text-sm">انتخاب یا کشیدن فایل</span>
                        </div>
                      </div>
                    )}

                    {/* نمایش تصویر آپلود شده */}
                    {path && (
                      <img
                        src={getBaseUrl() + path}
                        alt={`cover-${index}`}
                        className=" w-full h-32 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105" />
                    )}

                    {/* دکمه حذف */}
                    {path && coverImagePaths.length > 1 && (
                      <button
                        onClick={() => removeInputField(index)}
                        className=" absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                        <IoMdClose size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {/* دکمه افزودن فیلد جدید */}
                <button
                  onClick={addInputField}
                  className=" col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-3 flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 transition hover:border-green-400 hover:bg-green-50">
                  <IoMdAdd className="text-2xl" />
                </button>
              </div>

            </div>

            {/* ثبت اطلاعات */}
            <div className="grid grid-cols-12 gap-4 md:gap-x-8 w-full h-auto">
              {isloading ? (
                /* Loader */
                <div className="col-span-12 flex justify-center items-center py-5">
                  <BouncingDotsLoader />
                </div>
              ) : response ? (
                response === "success" ? (
                  /* Success message */
                  <div
                    className=" col-span-12 w-full border border-green-500 bg-green-50 text-green-600 h-10 flex items-center justify-center rounded-lg shadow-sm ">
                    ویرایش با موفقیت انجام شد
                  </div>
                ) : (
                  /* Error message */
                  <div
                    className=" col-span-12 w-full border border-red-500 bg-red-50 text-red-600 h-10 flex items-center justify-center rounded-lg shadow-sm">
                    خطا!: ثبت ناموفق
                  </div>
                )
              ) : (
                <>
                  {/* دکمه ثبت */}
                  <button
                    onClick={Updateplan}
                    className=" col-span-12 sm:col-span-6 w-full                     /* پرکردن عرض سلول */ h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200/50">
                    ثبت
                  </button>

                  {/* دکمه بازگشت */}
                  <button
                    onClick={() => navigate(-1)}
                    className=" col-span-12 sm:col-span-6 w-full h-12 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow hover:shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-100/50">
                    بازگشت
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetailsEdit;
