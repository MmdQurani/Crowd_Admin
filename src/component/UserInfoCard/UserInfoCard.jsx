import { getDate } from 'component/DateFunctions/DateFunctions';
import React from 'react';

export default function UserInfoCard({ userInfo, onChangePassword }) {
  const { realPerson = {} } = userInfo || {};
  const { firstName, lastName, placeOfBirth, birthDate, shNumber } = realPerson;

  return (
    <div className="user-datas grid grid-cols-12 gap-4 w-full bg-white border border-gray-200 rounded-lg p-5">
      {/* نام و نام خانوادگی */}
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <div className="text-sm h-10 flex justify-start items-center border border-gray-200 rounded-lg px-4">
          نام و نام خانوادگی: {firstName || '-'} {lastName || '-' }
        </div>
      </div>

      {/* محل تولد */}
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <div className="text-sm h-10 flex justify-start items-center border border-gray-200 rounded-lg px-4">
          محل تولد: {placeOfBirth || '-'}
        </div>
      </div>

      {/* تاریخ تولد */}
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <div className="text-sm h-10 flex justify-start items-center border border-gray-200 rounded-lg px-4">
          تاریخ تولد: {birthDate ? getDate(birthDate) : '-'}
        </div>
      </div>

      {/* کدملی */}
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <div className="text-sm h-10 flex justify-start items-center border border-gray-200 rounded-lg px-4">
          کدملی: {shNumber || '-'}
        </div>
      </div>

      {/* دکمه تغییر رمز */}
      <div className="col-span-12 flex justify-center mt-2.5">
        <button
          onClick={onChangePassword}
          className="md:w-1/2 w-full py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          تغییر رمز عبور
        </button>
      </div>
    </div>
  );
}
