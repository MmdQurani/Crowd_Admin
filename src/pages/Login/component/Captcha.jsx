/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
// /* eslint-disable */
import { useEffect, useState } from 'react';
import axios from 'axios';
import getBaseUrl from 'component/Axios/getBaseUrl';
import reload from 'asset/image/icon/reloadIcon.svg';
import InlineSVG from 'react-inlinesvg';
import './animationStyling.css';

const Captcha = ({ enternigStep = false, captcha, setCaptcha }) => {
  const [isload, setIsload] = useState(false);

  useEffect(() => {
    GetCaptcha();
  }, [alert, enternigStep]);

  const GetCaptcha = async () => {
    setIsload(true); // Start loading
    try {
      const res = await axios.post(getBaseUrl() + 'Captcha/Create', {});
      return setCaptcha(res?.data?.data);
    } catch (error) {
      return setCaptcha(false);
    } finally {
      setIsload(false); // End loading
    }
  };

  return (
    <>
      {captcha ? (
        <div
          className="w-full flex items-center justify-end gap-x-1 rounded-l-Radius pl-3 cursor-pointer "
          onClick={GetCaptcha}>
          <img src={`data:image/jpeg;base64,${captcha?.file}`} className="w-[80%] h-[35px] " />
          <InlineSVG
            src={reload}
            onClick={GetCaptcha}
            className={`cursor-pointer ${isload ? 'spin-animation' : ''} w-[20%] scale-105 `} // Dynamically add the class
          />
        </div>
      ) : (
        <span className="w-[30%] text-center text-[10px]  text-red-600 rounded-l-Radius">
          خطا در دریافت کدامنیتی
        </span>
      )}
    </>
  );
};

export default Captcha;
