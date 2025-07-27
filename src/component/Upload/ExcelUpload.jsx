import DateFunction2 from 'component/DateFunctions/DateFunction2';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { AddpayOutWalletFlowReq } from 'pages/ScheduledPaymentsManagement/Api/ScheduledPaymentsReq';
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import sampleFile from 'asset/files/فیال نمونه واریز سود.xlsx';
import { toast } from 'react-toastify';

function ExcelUpload({ placeholder, width, filename, setFilename, fileFormat = false, id }) {
  const inputRef = useRef();
  const [excelData, setExcelData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    excelData && excelData?.length > 0 && Body && DeleteUnsuleData() && AddpayOutWalletFlow();
    excelData && excelData?.length > 0 && setIsLoading(true);
    filename && Validation();
  }, [excelData]);

  const Validation = () => {
    if (filename && excelData?.length == 0) {
      setFilename();
      toast.error(' لطفا از ساختار فایل نمونه پیروی کنید. فایل بارگذاری شده ساختار نادرستی دارد ');
    } else {
      return null;
    }
  };

  console.log('excelData', excelData);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('file', file);
      const reader = new FileReader();
      setFilename(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON with defval option
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        // Filter out empty rows
        jsonData = jsonData.filter((row) => {
          return Object.values(row).some((value) => value !== null && value !== '');
        });

        setExcelData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const findKeyBySubstring = (obj, substring) => {
    return Object.keys(obj).find((key) => key.includes(substring));
  };

  const convertDate = (date) => {
    if (date?.includes('/')) {
      return DateFunction2.convertToGregorianForJalaloDash(date?.split('/')?.join('-'));
    } else if (date?.includes('-')) {
      return DateFunction2.convertToGregorianForJalaloDash(date);
    } else {
      return null;
    }
  };

  const Body =
    excelData &&
    excelData?.map((item) => {
      const nationalIdKey = findKeyBySubstring(item, 'کدملی/شناسه ملی');
      const statementNumberKey = findKeyBySubstring(item, 'کد پیگیری');
      const statementDateKey = findKeyBySubstring(item, 'تاریخ واریز');
      const descriptionKey = findKeyBySubstring(item, 'توضیحات');
      const amountKey = findKeyBySubstring(item, 'مبلغ');
      return {
        nationalId: `${item[nationalIdKey]}`,
        statementNumber: `${item[statementNumberKey]}`,
        statementDate: item[statementDateKey] && convertDate(item[statementDateKey]),
        description: item[descriptionKey],
        amount: item[amountKey] && Number(item[amountKey])
      };
    });

  const DeleteUnsuleData = () => {
    const isValidDate = (dateString) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date) && date.toISOString().slice(0, 10) === dateString;
    };
    return Body && Body.length > 0
      ? Body?.filter((item) =>
          Object.entries(item).every(
            ([key, value]) =>
              value !== null &&
              value !== undefined &&
              !Number.isNaN(value) &&
              (key !== 'statementDate' || isValidDate(value))
          )
        )
      : [];
  };
  const AddpayOutWalletFlow = async () => {
    const res = await AddpayOutWalletFlowReq({
      scheduledPaymentId: id && Number(id),
      payouts: excelData && Body && DeleteUnsuleData()
    });
    if (res) {
      setResponse('success');
    } else {
      setResponse('failed');
    }
    setIsLoading(false);
    setTimeout(() => {
      setResponse(false);
      setFilename('');
    }, 2000);
  };

  console.log('file name ', filename);

  return (
    <div className="w-auto flex flex-col items-start gap-y-1">
      <label className="w-full text-xs font-semibold text-gray-title flex items-center gap-x-2 justify-start">
        فایل مورد نطر را طبق
        <a
          type="download"
          href={sampleFile}
          className={`flex items-center gap-x-4 font-semibold  text-sm  cursor-pointer w-auto  justify-center  text-cyan-400  `}>
          فایل نمونه{' '}
        </a>
        بارگذاری کنید
      </label>
      {response ? (
        response == 'success' ? (
          <div className="w-auto h-[40px] text-sm  p-3 rounded-md  border border-green-500 text-center justify-center flex items-center  text-green-500  ">
            ثبت شد
          </div>
        ) : (
          <div className="w-auto h-[40px] text-sm  p-3 rounded-md  border border-red-500 text-center justify-center flex items-center  text-red-500  ">
            خطا ! ثبت ناموفق{' '}
          </div>
        )
      ) : (
        <div onClick={() => inputRef.current.click()} className="w-auto">
          <div
            className={`${
              width ? width : 'w-full'
            } flex h-[38px] cursor-pointer justify-between items-center  rounded-lg border border-accent-600`}>
            <input
              className=""
              type="file"
              hidden
              accept={fileFormat ? fileFormat : '.xlsx, .xls, .csv'}
              onChange={handleFileUpload}
              ref={inputRef}
            />
            <p className="pr-2 placeholder:text-xs text-accent-600 text-sm text-map-green">
              {filename
                ? `${filename?.name?.split('.')?.[0]} ثبت شد!`
                : placeholder
                  ? placeholder
                  : ' '}
            </p>
            <div>
              {isLoading ? (
                <BouncingDotsLoader />
              ) : (
                <button
                  className="flex align-baseline relative -mt-0 px-1   text-sm text-accent-600"
                  type="submit">
                  {!filename && ' انتخاب فایل'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ExcelUpload;
