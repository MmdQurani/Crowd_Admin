import axios from 'axios';
import getBaseUrl from 'component/Axios/getBaseUrl';
import FileUploadPage from 'component/input/uploadInput';
import Sidebar from 'component/layout/sidebar/SideBar';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';
import { getFromLocalStorage } from 'component/storage/localStorage';
import React, { useState } from 'react';
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

  return (
    <div className="flex flex-row items-start h-full">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 h-full ">
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-5">
          <span className="w-full flex justify-center items-center text-xl text-accent-500 font-semibold ">
            بارگذاری بنر سامانه
          </span>
          <div className="w-[20%] flex justify-center items-center ">
            {' '}
            <FileUploadPage multiple={false} setFileAddress={setFile} id={1} />
          </div>
          <button
            onClick={SetBanner}
            disabled={!file}
            className={`w-[20%] ${
              isloading ? ' borde border-green-500' : 'bg-green-500'
            } text-white rounded-lg h-[44px] tetx-sm   `}>
            {isloading ? <BouncingDotsLoader /> : 'ثبت'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetBanner;
