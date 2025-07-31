import axios from 'axios';
import getBaseUrl from 'component/Axios/getBaseUrl';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import FileUploadPage from 'component/input/uploadInput';
import Sidebar from 'component/layout/sidebar/SideBar';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { getFromLocalStorage } from 'component/storage/localStorage';
import React, { useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { toast } from 'react-toastify';

function SetBanner() {
  const [file, setFile] = useState();
  const [isloading, setIsloading] = useState(false);
  const token = JSON.parse(getFromLocalStorage('token'));

  const SetBanner = async () => {
    setIsloading(true);
    try {
      await axios.post(
        getBaseUrl() + 'ClientConfig/Set',
        { banner: file },
        {
          headers: {
            Authorization: `Bearer  ${token}`,
            'Content-Type': 'application/json' // Set content type to JSON
          }
        }
      );
      setIsloading(false);
      return toast.success('ثبت شد ');
    } catch (ex) {
      setIsloading(false);
      if (ex && 399 < ex.response.status && ex.response.status < 429) {
        return toast.error('ثبت ناموفق ! ارسال ناموفق ');
      } else if (ex.response.status == 429) {
        return toast.error('ثبت ناموفق! اعتبار حضور شما در سامانه به پایان رسیده است ');
      } else {
        return toast.error('ثبت ناموفق! خطایی در ارسال رخ داده است ');
      }
    }
  };
  console.log(!file);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-row items-start h-full">

      {/* سایدبار */}
      <div className="min-w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      {/* سایدبار برای اندازه های کوچکتر از لارج */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 w-full h-full flex flex-col items-center align-middle p-10 ">

        {/* باز کردن سایدبار */}
        <button className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <div dir="rtl" className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full max-w-lg mx-auto">
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
            بارگذاری بنر سامانه
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-full sm:w-2/3">
              <FileUploadPage
                multiple={false}
                setFileAddress={setFile}
                id={1}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={SetBanner}
              disabled={!file || isloading}
              className={`
        w-full sm:w-auto
        px-6 py-2
        text-white font-medium rounded-md
        transition-colors duration-200
        ${isloading
                  ? 'bg-indigo-400 cursor-wait'
                  : file
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-300 cursor-not-allowed'}
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      `}
            >
              {isloading
                ? <BouncingDotsLoader size="small" />
                : 'ثبت'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SetBanner;
