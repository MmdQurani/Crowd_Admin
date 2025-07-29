/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CreatePlanReq } from '../Api/PlanReq';
import FileUploadPage from 'component/input/uploadInput';
import DateFunction2 from 'component/DateFunctions/DateFunction2';
import DatePickerPersian from 'component/Datepicker/datepicker';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import getBaseUrl from 'component/Axios/getBaseUrl';
import { HandleOnChange } from 'component/GlobalyTools/UseAbleFunction';
import FindUser from 'component/AutoComplete/FindUser';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { IoMdMenu } from 'react-icons/io';

const CreatePlan = () => {
  const initialValue = {
    title: '',
    titleEn: '',
    symbol: '',
    symbolEn: '',
    executionLocation: '',
    industryGroupId: '',
    industryGroupTitle: '',
    subIndustryGroupId: '',
    subIndustryGroupTitle: '',
    startDate: null,
    endDate: null,
    underwritingStartDate: null,
    underwritingEndDate: null,
    installmentCount: null,
    installmentPeriod: null,
    investmentPeriod: null,
    unitAmount: null,
    unitCount: null,
    maxUnitPerLegalInvestor: null,
    maxUnitPerIndividualInvestor: null,
    minUnitPerLegalInvestor: null,
    minUnitPerIndividualInvestor: null,
    warranty: null,
    ifbProjectId: null,
    ifbUrl: null,
    description: '',
    coverImagePaths: [],
    fixedProvisionalProfit: null,
    totalProfitRate: null,
    monthlyProfitRate: null,
    annualProfiteRate: null,
    utilizationPlan: null,
    userId: null,
    floatingPercentage: 100
  };
  const [details, setDetails] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const [response, setResponse] = useState(false);

  const navigate = useNavigate();

  const convertDate = (date) => {
    if (date?.includes('T')) {
      return date?.split('T')?.[0];
    } else if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else {
      return date;
    }
  };

  const MakeCorrectBody = () => {
    if (!details) return {}; // Return an empty object if details is null

    const body = {};

    Object.keys(details).forEach((key) => {
      if (details[key] !== undefined && details[key] !== null) {
        switch (key) {
          case 'startDate':
          case 'endDate':
          case 'underwritingStartDate':
          case 'underwritingEndDate':
            body[key] = convertDate(details[key]);
            break;
          case 'fixedProvisionalProfit':
          case 'totalProfitRate':
          case 'monthlyProfitRate':
          case 'annualProfiteRate':
          case 'floatingPercentage':
            body[key] = Number(details[key]) / 100;
            break;
          default:
            body[key] = details[key];
        }
      }
    });

    return body;
  };

  console.log(MakeCorrectBody());

  const CreatePlan = async () => {
    setIsloading(true);
    const res = await CreatePlanReq(MakeCorrectBody());
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
      setDetails(null);
    }, 1800);
    setIsloading(false);
  };

  const handleInputChange = (index, path) => {
    const newInputs = details?.coverImagePaths;
    newInputs[index] = path; // Update the input with the file path
    setDetails((prev) => ({ ...prev, coverImagePaths: newInputs }));
  };

  // Function to increase the number of inputs
  const addInputField = () => {
    setDetails((prev) => ({ ...prev, coverImagePaths: [...(prev?.coverImagePaths || []), ''] })); // Add an empty input field to the array
  };

  // Function to decrease the number of inputs
  const removeInputField = (index) => {
    const newInputs = details?.coverImagePaths;
    newInputs.splice(index, 1); // Remove the input at the specified index
    setDetails((prev) => ({ ...prev, newInputs }));
  };

  const InputFields = [
    {
      label: 'عنوان*',
      labelstyle: 'text-xs font-bold',
      value: details?.title,
      onchange: (e) => setDetails((prev) => ({ ...prev, title: e.target.value })),
      width: 'w-[24%]',
      name: 'title'
    },
    {
      label: 'عنوان (EN)',
      labelstyle: 'text-xs ',
      value: details?.titleEn,
      onchange: (e) => setDetails((prev) => ({ ...prev, titleEn: e.target.value })),
      width: 'w-[24%]',
      name: 'titleEn'
    },
    {
      label: 'نماد',
      labelstyle: 'text-xs ',
      value: details?.symbol,
      onchange: (e) => setDetails((prev) => ({ ...prev, symbol: e.target.value })),
      width: 'w-[24%]',
      name: 'symbol'
    },
    {
      label: '  نماد (EN)',
      labelstyle: 'text-xs ',
      value: details?.symbolEn,
      onchange: (e) => setDetails((prev) => ({ ...prev, symbolEn: e.target.value })),
      width: 'w-[24%]',
      name: 'symbol'
    },
    {
      label: 'محل اجرای طرح',
      labelstyle: 'text-xs ',
      value: details?.executionLocation,
      onchange: (e) => setDetails((prev) => ({ ...prev, executionLocation: e.target.value })),
      width: 'w-[24%]',
      name: 'executionLocation'
    },
    {
      label: 'ایدی گروه صنعت',
      labelstyle: 'text-xs ',
      value: details?.industryGroupId,
      onchange: (e) =>
        HandleOnChange(e, (value) => setDetails((prev) => ({ ...prev, industryGroupId: value }))),
      width: 'w-[24%]',
      name: 'industryGroupId'
    },
    {
      label: 'عنوان گروه صنعت',
      labelstyle: 'text-xs ',
      value: details?.industryGroupTitle,
      onchange: (e) => setDetails((prev) => ({ ...prev, industryGroupTitle: e.target.value })),
      width: 'w-[24%]',
      name: 'industryGroupTitle'
    },
    {
      label: ' آیدی زیر گروه صنعت',
      labelstyle: 'text-xs ',
      value: details?.subIndustryGroupId,
      onchange: (e) =>
        HandleOnChange(e, (value) =>
          setDetails((prev) => ({ ...prev, subIndustryGroupId: value }))
        ),
      width: 'w-[24%]',
      name: 'subIndustryGroupId'
    },
    {
      label: 'عنوان زیر گروه صنعت',
      labelstyle: 'text-xs ',
      value: details?.subIndustryGroupTitle,
      onchange: (e) => setDetails((prev) => ({ ...prev, subIndustryGroupTitle: e.target.value })),
      width: 'w-[24%]',
      name: 'subIndustryGroupTitle'
    },
    // {
    //   label: 'عنوان زیر گروه صنعت',
    //   labelstyle: 'text-xs ',
    //   value: details?.subIndustryGroupTitle,
    //   onchange: (e) => setDetails((prev) => ({ ...prev, subIndustryGroupTitle: e.target.value })),
    //   width: 'w-[24%]',
    //   name: 'subIndustryGroupTitle'
    // },
    {
      label: '  تاریخ شروع طرح',
      labelstyle: 'text-xs ',
      value: details?.startDate,
      field: (
        <DatePickerPersian
          onchange={(e) => setDetails((prev) => ({ ...prev, startDate: e }))}
          value={details?.startDate}
        />
      ),
      width: 'w-[24%]',
      name: 'startDate'
    },
    {
      label: '  تاریخ پایان طرح',
      labelstyle: 'text-xs ',
      value: details?.endDate,
      field: (
        <DatePickerPersian
          onchange={(e) => setDetails((prev) => ({ ...prev, endDate: e }))}
          value={details?.endDate}
        />
      ),
      width: 'w-[24%]',
      name: 'endDate'
    },
    {
      label: ' تاریخ آغاز جمع آوری وجوه',
      labelstyle: 'text-xs ',
      value: details?.underwritingStartDate,
      field: (
        <DatePickerPersian
          onchange={(e) => setDetails((prev) => ({ ...prev, underwritingStartDate: e }))}
          value={details?.underwritingStartDate}
        />
      ),
      width: 'w-[24%]',
      name: 'underwritingStartDate'
    },
    {
      label: 'تاریخ پایان جمع آوری وجوه',
      labelstyle: 'text-xs ',
      value: details?.underwritingEndDate,
      field: (
        <DatePickerPersian
          onchange={(e) => setDetails((prev) => ({ ...prev, underwritingEndDate: e }))}
          value={details?.underwritingEndDate}
        />
      ),
      width: 'w-[24%]',
      name: 'underwritingEndDate'
    },
    {
      label: 'تعداد اقساط',
      labelstyle: 'text-xs ',
      value: details?.installmentCount
        ? Number(details?.installmentCount).toLocaleString()
        : details?.installmentCount,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, installmentCount: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'installmentCount'
    },
    {
      label: ' دوره اقساط',
      labelstyle: 'text-xs ',
      value: details?.installmentPeriod
        ? Number(details?.installmentPeriod).toLocaleString()
        : details?.installmentPeriod,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, installmentPeriod: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'installmentPeriod'
    },
    {
      label: ' قیمت هر واحد*',
      labelstyle: 'text-xs font-bold ',
      value: details?.unitAmount
        ? Number(details?.unitAmount).toLocaleString()
        : details?.unitAmount,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, unitAmount: value })),
          1,
          100000000
        ),
      width: 'w-[24%]',
      name: 'unitAmount'
    },
    {
      label: '  تعداد واحد*',
      labelstyle: 'text-xs font-bold ',
      value: details?.unitCount ? Number(details?.unitCount).toLocaleString() : details?.unitCount,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, unitCount: value })),
          1,
          1000000000
        ),
      width: 'w-[24%]',
      name: 'unitCount'
    },
    {
      label: ' حداکثر واحد قابل خرید (حقوقی)',
      labelstyle: 'text-xs  ',
      value: details?.maxUnitPerLegalInvestor
        ? Number(details?.maxUnitPerLegalInvestor).toLocaleString()
        : details?.maxUnitPerLegalInvestor,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, maxUnitPerLegalInvestor: value })),
          1,
          100000000
        ),
      width: 'w-[24%]',
      name: 'maxUnitPerLegalInvestor'
    },
    {
      label: 'حداکثر واحد قابل خرید (حقیقی)',
      labelstyle: 'text-xs  ',
      value: details?.maxUnitPerIndividualInvestor
        ? Number(details?.maxUnitPerIndividualInvestor).toLocaleString()
        : details?.maxUnitPerIndividualInvestor,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, maxUnitPerIndividualInvestor: value })),
          1,
          100000000
        ),
      width: 'w-[24%]',
      name: 'maxUnitPerIndividualInvestor'
    },
    {
      label: 'حداقل واحد قابل خرید (حقوقی)',
      labelstyle: 'text-xs  ',
      value: details?.minUnitPerLegalInvestor
        ? Number(details?.minUnitPerLegalInvestor).toLocaleString()
        : details?.minUnitPerLegalInvestor,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, minUnitPerLegalInvestor: value })),
          1,
          100000000
        ),
      width: 'w-[24%]',
      name: 'minUnitPerLegalInvestor'
    },
    {
      label: 'حداقل واحد قابل خرید (حقیقی)',
      labelstyle: 'text-xs  ',
      value: details?.minUnitPerIndividualInvestor
        ? Number(details?.minUnitPerIndividualInvestor).toLocaleString()
        : details?.minUnitPerIndividualInvestor,
      onchange: (e) =>
        HandleOnChange(
          e,
          'number',
          (value) => setDetails((prev) => ({ ...prev, minUnitPerIndividualInvestor: value })),
          1,
          100000000
        ),
      width: 'w-[24%]',
      name: 'minUnitPerIndividualInvestor'
    },
    {
      label: 'ضمانت نامه طرح',
      labelstyle: 'text-xs  ',
      value: details?.warranty,
      onchange: (e) => setDetails((prev) => ({ ...prev, warranty: e.target.value })),
      width: 'w-[24%]',
      name: 'warranty'
    },
    {
      label:
        '  درصد شناوری (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)',
      labelstyle: 'text-xs  ',
      value: details?.floatingPercentage,
      onchange: (e) =>
        HandleOnChange(
          e,
          'float',
          (value) => setDetails((prev) => ({ ...prev, floatingPercentage: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'fixedProvisionalProfit'
    },
    {
      label:
        ' سود پرداختی هر دوره(اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)',
      labelstyle: 'text-xs  ',
      value: details?.fixedProvisionalProfit,
      onchange: (e) =>
        HandleOnChange(
          e,
          'float',
          (value) => setDetails((prev) => ({ ...prev, fixedProvisionalProfit: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'fixedProvisionalProfit'
    },
    {
      label: ' سود کل دوره (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)',
      labelstyle: 'text-xs  ',
      value: details?.totalProfitRate,
      onchange: (e) =>
        HandleOnChange(
          e,
          'float',
          (value) => setDetails((prev) => ({ ...prev, totalProfitRate: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'totalProfitRate'
    },
    {
      label: 'سود ماهانه (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)',
      labelstyle: 'text-xs  ',
      value: details?.monthlyProfitRate,
      onchange: (e) =>
        HandleOnChange(
          e,
          'float',
          (value) => setDetails((prev) => ({ ...prev, monthlyProfitRate: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'monthlyProfitRate'
    },
    {
      label: 'سود سالانه (اعداد درصد می باشند و اعداد اعشاری را با ( . ) مشخص نمایید مانند 22.5)',
      labelstyle: 'text-xs  ',
      value: details?.annualProfiteRate,
      onchange: (e) =>
        HandleOnChange(
          e,
          'float',
          (value) => setDetails((prev) => ({ ...prev, annualProfiteRate: value })),
          1,
          100
        ),
      width: 'w-[24%]',
      name: 'annualProfiteRate'
    },
    {
      label: 'توضیحات طرح',
      labelstyle: 'text-xs  ',
      value: details?.description,
      field: (
        <textarea
          value={details?.description}
          onChange={(e) => setDetails((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full text-start pr-2 text-gray-600 text-sm resize-y h-[80px] border border-gray-300 rounded-md "
        />
      ),
      width: 'w-full',
      name: 'description'
    }
  ];

  const disabled = Boolean(
    details?.title && details?.unitAmount && details?.unitCount && details?.userId
  );

  console.log('deata', Number('22.5' / 100));

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
          <div className="col-span-12 flex justify-center items-center h-screen">
            <BouncingDotsLoader />
          </div>
        ) : (
          <div className="w-full grid grid-cols-12 gap-y-16">

            {/* تایتل صفحه */}
            <div className="col-span-12 bg-white px-4 sm:px-6 lg:px-8 py-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
              <span className="text-base md:text-lg font-semibold text-gray-800 leading-8">
                ایجاد طرح جدید
              </span>
            </div>

            {/* شناسه ملی و آیدی فرابورس */}
            <div className="col-span-12 grid grid-cols-12 gap-x-4 gap-y-6">
              <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
                <label htmlFor="userId" className="text-xs font-bold text-gray-700">
                  شناسه ملی طرف حساب*
                </label>
                <FindUser
                  setUserId={(e) =>
                    setDetails((prev) => ({ ...prev, userId: e }))
                  }
                  userId={details?.userId}
                />
              </div>
              <div className="col-span-12 md:col-span-4 flex flex-col justify-end gap-1">
                <label htmlFor="ifbProjectId" className="text-xs font-bold text-gray-700">
                  آیدی فرابورس طرح
                </label>
                <input
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      ifbProjectId: e.target.value,
                    }))
                  }
                  value={details?.ifbProjectId}
                  className="w-full px-4 py-2 bg-white border border-gray-200 text-sm text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* فیلدهای داینامیک */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
              {InputFields?.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 md:col-span-6 xl:col-span-4 flex flex-col gap-1"
                >
                  <label htmlFor={item.name} className="text-xs font-medium text-gray-700">
                    {item.label}
                  </label>
                  {item.field ? (
                    item.field
                  ) : (
                    <input
                      name={item.name}
                      onChange={item.onchange}
                      value={item.value}
                      className="w-full px-4 py-2 bg-white border border-gray-200 text-sm text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* بارگذاری تصاویر طرح */}
            <div className="col-span-12 flex flex-col gap-10">
              <div className="border-b border-gray-600 text-gray-500 py-2">
                بارگذاری تصاویر طرح :
              </div>
              <div className="grid grid-cols-12 gap-2">
                {details?.coverImagePaths?.map((path, index) => (
                  <div
                    key={index}
                    className="col-span-6 sm:col-span-4 md:col-span-3 flex items-center gap-2"
                  >
                    {!path && (
                      <FileUploadPage
                        multiple={true}
                        setFileAddress={(i, p) => handleInputChange(i, p)}
                        id={index}
                      />
                    )}
                    {path && (
                      <img
                        src={getBaseUrl() + path}
                        className="w-full h-32 object-cover rounded-md shadow-md"
                      />
                    )}
                    {details.coverImagePaths.length > 1 && path && (
                      <button
                        onClick={() => removeInputField(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}

                <div className="col-span-6 sm:col-span-4 md:col-span-3 flex items-center justify-center">
                  <button
                    onClick={addInputField}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* یادآوری فیلدهای اجباری */}
            <div className="col-span-12 text-sm text-gray-700 font-semibold">
              مواردی که با * مشخص شده اند الزامی هستند
            </div>

            {/* دکمه‌های عملیاتی */}
            <div className="col-span-12 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isloading ? (
                <div className="w-full flex justify-center py-5">
                  <BouncingDotsLoader />
                </div>
              ) : response ? (
                response === 'success' ? (
                  <div className="border border-green-500 text-green-400 h-10 w-full sm:w-7/12 text-center flex items-center justify-center rounded-md">
                    ویرایش با موفقیت انجام شد
                  </div>
                ) : (
                  <div className="border border-red-500 text-red-400 h-10 w-full sm:w-7/12 text-center flex items-center justify-center rounded-md">
                    خطا!: ثبت ناموفق
                  </div>
                )
              ) : (
                <>
                  <button
                    disabled={!disabled}
                    onClick={CreatePlan}
                    className={`w-full sm:w-1/2 bg-green-500 text-white h-12 rounded-md flex items-center justify-center ${disabled ? 'opacity-50' : 'opacity-100'
                      }`}
                  >
                    ثبت
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-1/2 border border-gray-500 text-gray-700 h-12 rounded-md flex items-center justify-center"
                  >
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

export default CreatePlan;
