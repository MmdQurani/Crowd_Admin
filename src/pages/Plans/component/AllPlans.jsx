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
      <div className="w-full flex py-5 items-start justify-start gap-x-5 bg-gray-500  p-5 rounded-lg ">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="نام طرح مورد نطر را وارد کنید "
          className="w-[30%] h-[40px] rounded-lg bg-white focus:ring-0 focus:outline-none focus:border-none border-none text-gray-500 text-sm pr-3 placeholder:text-sm placeholder:text-gray-500"
        />
        <Link
          to={'/plans/create_plan'}
          className="bg-red-500 text-white w-[10%]  flex items-center justify-center text-center font-normal text-sm h-[40px] rounded-md">
          ثبت طرح جدید
        </Link>
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
      </div>

      <div className='w-full h-full grid grid-cols-12 gap-4'>
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

      {/* <div className="flex flex-wrap w-full ">
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
      </div> */}

      {isloading && (
        <div className=" w-full flex-col flex items-center justify-center h-screen">
          <BouncingDotsLoader />
        </div>
      )}
      {response?.data?.length === 0 && isloading === false && response !== false && (
        <div className=" w-full flex-col flex items-center pt-5 text-caption font-medium text-dominant">
          <p>طرحی برای شما یافت نشد </p>
        </div>
      )}
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
