import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const DatePickerPersian = ({ value, onchange, title, name, style, titleStyle }) => {
  //   const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
  //     arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  //     fixNumbers = (str) => {
  //       if (typeof str === 'string') {
  //         for (var i = 0; i < 10; i++) {
  //           str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
  //         }
  //       }
  //       return str;
  //     };
  const handleDateChange = (date) => {
    const jsDate = date.toDate();
    jsDate.setHours(12, 0, 0, 0);
    onchange(jsDate.toISOString(), name);
  };

  return (
    <div className={` h-full  relative ${style ? style : ' w-full '}  flex flex-col z-[1000] `}>
      {title && (
        <p
          className={`font-IRANYekanX font-normal text-xs   rounded-md  ${titleStyle ? titleStyle : 'text-white'
            } mr-3 w-fit z-10`}>
          {title}
        </p>
      )}

      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={value}
        style={{ zIndex: 10000 }}
        onChange={handleDateChange}
        name={name}
        render={
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 text-sm text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="تاریخ را  انتخاب کنید"
          />
        }
      />
    </div>
  );
};

export default DatePickerPersian;
