/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useMemo } from 'react';
import PaginationComponet from 'component/pagination/paginationComponent';
import Card from 'component/card/Card';
import { GetAllPlansReq } from '../Api/PlanReq';
import DataContext from 'comon/context/MainContext';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { Link } from 'react-router-dom';
import DownloadExcelBtn from 'component/GlobalyTools/DownloadExcelBtn';

const AllPlans = () => {
  const { setAllPlanDetails } = useContext(DataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState();
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isloading, setIsloading] = useState();
  const [response, setResponse] = useState();

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 100);
    // Cleanup the timeout if user types again within 500ms
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    GetAllPlans();
  }, [currentPage, debouncedSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const GetAllPlans = async () => {
    setIsloading(true);
    const res = await GetAllPlansReq({
      titleQuery: search && search,
      pagination: {
        take: 4,
        skip: currentPage === 1 ? 0 : 4 * (currentPage - 1)
      }
    });
    if (res) {
      setResponse(res);
      setAllPlanDetails(res?.data);
    } else {
      setResponse(false);
      setAllPlanDetails(false);
    }
    setIsloading(false);
  };

  return (
    <div className="flex flex-col w-full items-center justify-start gap-y-10 h-full min-h-screen  ">

      {/* header */}

      <div className=" w-full bg-white shadow-md flex flex-col md:flex-row items-center justify-between p-6 rounded-lg "
      >
        {/* تیتر */}
        <h1 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
          طرح‌ها
        </h1>

        {/* جستجو */}
        <div className="w-full md:flex-1 mb-2 md:mb-0 md:mx-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              {/* <SearchIcon className="w-5 h-5" /> */}
            </span>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="نام طرح مورد نطر را وارد کنید "
              dir="rtl"
              className=" w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-x-2 gap-y-4 md:mt-0 mt-4">
          <DownloadExcelBtn
            Rout="PlansManagement/GetAll"
            filename="گزارش طرح ها"
            body={{
              titleQuery: search && search,
              pagination: {
                take: 1000000,
                skip: 0
              }
            }}
          />
          <Link
            to={'/plans/create_plan'}
            className=" w-full md:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {/* <PlusIcon className="w-5 h-5 ml-2" /> */}
            ثبت طرح جدید
          </Link>
        </div>
      </div>

      {/* محتوای صفحه */}
      <div className='w-full h-full grid grid-cols-12 gap-4 justify-items-center'>
        {response &&
          response?.data?.map((item, index) => (
            <Card
              key={index}
              coverimages={item?.coverImagePaths}
              annualRate={Number(item?.annualProfiteRate * 100).toFixed()}
              title={item?.title}
              unitAmount={item?.unitAmount}
              unitAvailable={item?.unitAvailable}
              state={item?.state}
              redirectRout={`/plans/plan_details/${item?.id}`}
              editRout={`/plans/plan_details_edit/${item?.id}`}
            />
          ))}
      </div>

      {/* لودر */}
      {isloading && (
        <div className=" w-full flex-col flex items-center justify-center h-screen">
          <BouncingDotsLoader />
        </div>
      )}

      {/* پیام خطا */}
      {response?.data?.length === 0 && isloading === false && response !== false && (
        <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
          <p>طرحی برای شما یافت نشد </p>
        </div>
      )}

      {/* پیجین */}
      <div className="flex justify-center p-8">
        {' '}
        <PaginationComponet
          showCount={4}
          total={response?.pagination?.total}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>


    </div>
  );
};

export default AllPlans;
