/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import arrow from 'asset/image/icon/arrowIcon/arrow-left.png';
import { findStatusTitle } from 'component/db/PlanStatusEnum';
import getBaseUrl from 'component/Axios/getBaseUrl';

const Card = ({
  coverimages,
  annualRate,
  title,
  unitAmount,
  unitAvailable,
  redirectRout,
  state,
  editRout
}) => {
  const navigate = useNavigate();

  console.log('cover', coverimages);

  return (
    <div className="p-3 w-full h-max mx-auto xl:col-span-6 md:col-span-12 sm:col-span-10 col-span-12">

      <div className="w-full h-max min-h-[350px] grid grid-cols-12 gap-x-4 gap-y-6  font-IRANYekanX  bg-white shadow-xl   border border-gray-300  rounded-md p-5 ">

        <div className='md:col-span-6 col-span-12'>
          <div className='w-full h-full'>
            {coverimages && coverimages.length > 0 ? (
              <img
                alt="مشکلی در نمایش تصویر رخ داد "
                src={getBaseUrl() + coverimages?.[0]?.value}
                className="bg-no-repeat object-cover h-full w-full max-h-full rounded-lg"
              />
            ) : (
              <div className="h-full flex flex-col justify-end">
                <p className="text-center  text-sm  text-gray-500">
                  تصویری برای طرح بارگذاری نشده است
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='md:col-span-6 col-span-12'>
          <div className=" h-full flex flex-col justify-between align-baseline items-center w-full">
            <div className=" flex flex-col gap-y-2 justify-start  w-full">
              {' '}
              <span className="text-base  font-bold  text-gray-600 text-center ">{title}</span>
              <div className="  w-full border-b-2 border-dashed border-white py-2" />
              <div className="flex  w-full justify-between items-center h-auto ">
                <p className="font-semibold text-sm"> سودهی سالانه :</p>
                <p className="text-sm text-gray-500"> {annualRate} %</p>{' '}
              </div>
              <div className="flex  w-full justify-between items-center h-auto ">
                <p className="font-semibold text-sm">قیمت هر واحد :</p>
                <p className="text-sm text-gray-500 "> {Number(unitAmount).toLocaleString()} ریال</p>
              </div>
              <div className="flex  w-full justify-between items-center h-auto ">
                <p className="font-semibold text-sm">تعداد واحد موجود : </p>
                <p className="text-sm text-gray-500">
                  {unitAvailable && Number(unitAvailable).toLocaleString()} واحد
                </p>
              </div>
              <div className="flex  w-full justify-between items-center h-auto ">
                <p className="font-IRANYekanX font-semibold text-sm">وضعیت طرح : </p>
                <p className="font-normal text-sm text-gray-500">
                  {state && findStatusTitle(state)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-12'>
          <div className='w-full h-full flex flex-wrap gap-x-4 gap-y-2 justify-between items-center'>
            <a
              className="flex cursor-pointer hover:text-red-600 sm:mx-0 mx-auto text-dominant-500 text-xs items-center "
              onClick={() => navigate(editRout)}>
              <img src={arrow} className="w-fit h-fit scale-75 rotate-180" />
              ویرایش طرح
            </a>

            <a
              className="flex cursor-pointer hover:text-red-600 sm:mx-0 mx-auto text-dominant-500 text-xs items-center"
              onClick={() => navigate(redirectRout)}>
              مشاهده جزییات طرح
              <img src={arrow} className="w-fit h-fit scale-75 " />
            </a>

          </div>
        </div>

        {/* <div className="w-[49%] h-full flex justify-between items-center  flex-col gap-y-6 ">
          {coverimages && coverimages.length > 0 ? (
            <div className="h-2/3 flex flex-col justify-center items-center w-full">
              <img
                alt="مشکلی در نمایش تصویر رخ داد "
                src={getBaseUrl() + coverimages?.[0]?.value}
                className="bg-no-repeat  bg-cover h-fit w-fit max-h-[200px]   "
              />
            </div>
          ) : (
            <div className="h-2/3 flex flex-col justify-end">
              <p className="text-center  text-sm  text-gray-500">
                تصویری برای طرح بارگذاری نشده است
              </p>
            </div>
          )}
          <div className="w-full  h-1/3 flex flex-col justify-end">
            <a
              className="flex cursor-pointer text-dominant-500  text-sm items-center "
              onClick={() => navigate(editRout)}>
              <img src={arrow} className="w-fit h-fit scale-75   rotate-180" />
              ویرایش طرح
            </a>
          </div>
        </div>
        
        <div className=" h-full border-l-2 border-dashed border-gray-300 " />

        <div className=" h-full flex flex-col justify-between align-baseline items-center  w-1/2">
          <div className=" flex flex-col gap-y-2 justify-start  w-full">
            {' '}
            <span className="text-base  font-bold  text-gray-600 text-center ">{title}</span>
            <div className="  w-full border-b-2 border-dashed border-white py-2" />
            <div className="flex  w-full justify-between items-center h-auto ">
              <p className="font-semibold text-sm"> سودهی سالانه :</p>
              <p className="text-sm text-gray-500"> {annualRate} %</p>{' '}
            </div>
            <div className="flex  w-full justify-between items-center h-auto ">
              <p className="font-semibold text-sm">قیمت هر واحد :</p>
              <p className="text-sm text-gray-500 "> {Number(unitAmount).toLocaleString()} ریال</p>
            </div>
            <div className="flex  w-full justify-between items-center h-auto ">
              <p className="font-semibold text-sm">تعداد واحد موجود : </p>
              <p className="text-sm text-gray-500">
                {unitAvailable && Number(unitAvailable).toLocaleString()} واحد
              </p>
            </div>
            <div className="flex  w-full justify-between items-center h-auto ">
              <p className="font-IRANYekanX font-semibold text-sm">وضعیت طرح : </p>
              <p className="font-normal text-sm text-gray-500">
                {state && findStatusTitle(state)?.name}
              </p>
            </div>
          </div>
          <div className="w-full flex  align-baseline justify-end  font-normal pt-5 ">
            <a
              className="flex cursor-pointer text-dominant-500  text-sm items-center"
              onClick={() => navigate(redirectRout)}>
              مشاهده جزییات طرح
              <img src={arrow} className="w-fit h-fit scale-75 " />
            </a>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default Card;
