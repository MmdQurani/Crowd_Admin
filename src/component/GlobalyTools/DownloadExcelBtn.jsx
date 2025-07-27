import Axios from 'component/Axios/Axios';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function DownloadExcelBtn({ filename, Rout, body = false, style = false }) {
  const [isloading, setIsloading] = useState(false);

  const GetBackEndExcel = async () => {
    setIsloading(true);
    const RequestType = body
      ? Axios.post(Rout, body, {
          responseType: 'blob', // Ensures the response is treated as a binary large object
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        })
      : Axios.get(Rout, {
          responseType: 'blob', // Ensures the response is treated as a binary large object
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        });
    await RequestType.then((res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `${filename}.xlsx`; // Specify the filename
      link.click();
      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
    })
      .catch(() => toast.error('خطا‍! لطفا کمی بعد تلاش کنید . '))
      .finally(() => setIsloading(false));
  };

  return (
    <button
      disabled={isloading}
      className={`rounded-md ${
        style ? style : 'text-white border border-white  h-[40px]  w-[150px] '
      } text-sm font-normal `}
      onClick={GetBackEndExcel}>
      {isloading ? <BouncingDotsLoader /> : 'دریافت اکسل'}
    </button>
  );
}

export default DownloadExcelBtn;
