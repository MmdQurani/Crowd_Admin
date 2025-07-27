/* eslint-disable no-unused-vars */
import Button from 'component/button/Button';
import Input from 'component/input/Input';
import { useEffect, useState } from 'react';
import { LoginReq } from './api/enteringRequest';
import openeye from 'asset/image/icon/securityEye/open.png';
import closeeye from 'asset/image/icon/securityEye/closed.png';
import Captcha from './component/Captcha';
import { addToLocalStorage, getFromLocalStorage } from 'component/storage/localStorage';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import BouncingDotsLoader from 'pages/Loading/BouncingDotsLoader';

import img1 from '../../asset/image/login-bg-2.png'

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [securityEye, setSecurityEye] = useState(false);
  const [captcha, setCaptcha] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [captchavalue, setCaptchavalue] = useState();
  const [handlecaptcha, setHandleCaptcha] = useState(0);

  useEffect(() => {
    setHandleCaptcha(handlecaptcha + 1);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await LoginReq({
      username: username,
      password: password,
      captcha: {
        id: captcha?.id,
        value: captchavalue
      }
    });
    console.log(res);

    if (res) {
      setIsLoading(false);

      let Role = jwtDecode(res)?.role;
      if (Role == 'Admin') {
        toast.success('خوش آمدید');
        addToLocalStorage('token', res);
        window.location = '/account';
      } else {
        console.log('role', Role);
      }
    } else {
      setIsLoading(false);
      // const res = await GetCaptchaReq();
      // if (res) {
      //   return setCaptcha(res);
      // } else {
      //   setAlert('مشکلی در دریافت کد امنیتی رخ داده است !');
      // }
    }

    // const mystate = location?.state;
    // window.location = mystate ? mystate?.from?.pathname : '/dashboard';
  };
  console.log(getFromLocalStorage('token'));

  const disable = Boolean(username) && Boolean(password);
  return (
    <div className="bg-[#f9faff] flex justify-center h-screen w-full items-center ">

      <div className='w-full h-full grid grid-cols-12'>

        <div className='lg:col-span-6 col-span-12 flex justify-center items-center'>
          <form className="bg-white flex flex-col w-[90%] max-w-[450px] min-h-[600px] mx-auto relative items-center justify-center gap-y-5 border border-[#465FF1]/10 shadow-md shadow-[#465FF1]/10 rounded-md" onSubmit={(e) => handleLogin(e)}>
            <div className="flex justify-center flex-col items-center gap-y-5">
              {/* <img src={logo} className=" " /> */}
              <span className="text-lg  text-gray-700 font-bold">ادمین پنل تامین مالی جمعی</span>
            </div>
            <div className="flex flex-col w-[80%]">
              <Input
                value={username}
                setvalue={setUsername}
                label="نام کاربری"
                width=" w-full text-center "
              />
              <Input
                width=" w-full text-center "
                value={password}
                setvalue={setPassword}
                label="کلمه عبور"
                type={securityEye ? 'text' : 'password'}
              />{' '}
              <div className="w-full" style={{ direction: 'ltr' }}>
                <img
                  src={securityEye ? openeye : closeeye}
                  onClick={() => setSecurityEye(!securityEye)}
                  className="w-fit h-fit relative bottom-8 left-2 "
                />
              </div>
            </div>

            <div className="flex w-[80%] justify-between  gap-x-2 items-center  border border-[#465FF1]/30 rounded-md  ">
              {' '}
              <input
                id="captcha"
                maxLength={6}
                value={captchavalue}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, ''); // Remove commas
                  if (/^\d*$/.test(value)) {
                    // Only allow digits (no other characters)
                    setCaptchavalue(value); // Set the value only if it's numeric
                  }
                }}
                inputMode="numeric"
                className=" w-[60%] border-0  0 text-center   pr-2 text-sm focus:border-0 focus:ring-primary-500 focus:outline-none   h-[40px] rounded-md "
              />
              <div className="w-[40%] flex items-center justify-center ">
                {' '}
                <Captcha enternigStep={handlecaptcha} captcha={captcha} setCaptcha={setCaptcha} />
              </div>
            </div>
            <div className="w-full flex justify-around pt-5">
              {isLoading ? (
                <BouncingDotsLoader />
              ) : (
                <Button type="submit" name="ورود " disable={disable} width="w-[80%]" />
              )}
            </div>
          </form>
        </div>

        <div className='col-span-6 lg:flex hidden p-8'>
          <div className='w-full h-[93vh]'>
            <img src={img1} className='w-full h-full object-fill rounded-lg' alt="" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
