/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import user from 'asset/image/icon/user/user.png';
import logo from 'asset/image/companyLogo/logoNav/Logo.png';
import arrowSVG from 'asset/image/icon/arrow/arrow-down.png';
import { Link } from 'react-router-dom';
import './hovercss.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState();
  // useEffect(() => {
  //   setUserinfo('');
  // }, []);
  // useEffect(() => {
  //   getuserInfo();
  // }, []);

  // const getuserInfo = async () => {
  //   const data = await GetUserInfoRequest(chestType[1]);
  //   setUserinfo(data);
  // };
  const navMenu = [
    {
      name: 'فرصت های سرمایه گذاری',
      link: '/',
      subMenu: []
    },
    {
      name: 'تماس با ما ',
      link: '/news',
      subMenu: []
    },
    {
      name: 'درباره ما',
      link: '',
      subMenu: [
        { name: 'معرفی شرکت', link: '/aboutUs/introduction' },
        { name: ' سوالات متداول', link: '/aboutUs/FAQ' },
        { name: 'قوانین و مقرارت', link: '/aboutUs/Roles' }
      ]
    },
    {
      name: 'درخواست تامین مالی ',
      link: '/contact-us',
      subMenu: []
    }
  ];

  function handleShowMenu() {
    setShowMenu(true);
  }
  function handleHideMenu() {
    setShowMenu(false);
  }
  return (
    <div className="border-2 border-accent rounded-md w-screen  pl-8 fixed z-[1000] shadow-xl">
      {/* Desktop */}
      <div className="hidden lg:flex px-6 flex-row items-center h-[80px] justify-between max-w[1903px]">
        <div className="flex flex-row items-center">
          <Link href="/">
            <img src={logo} alt="" className="h-fit w-fit" />
          </Link>
          <ul className="flex flex-row items-center gap-x-8 mr-24">
            {navMenu.map((data, index) => (
              <div
                key={index}
                className="relative hover-submenu hover:border-b-2 border-accent hover:font-bold hover:text-accent">
                <Link to={data.link} className="flex flex-row items-center">
                  <div className="text-base ml-1">{data.name}</div>
                  <img
                    className={`${data.subMenu.length !== 0 ? 'block' : 'hidden'}`}
                    src={arrowSVG}
                  />
                </Link>
                {!!data.subMenu.length && (
                  <div className="submenu absolute -right-5 p-3 hidden flex-col rounded   text-accent-400  ">
                    {data.subMenu.map((datas, indexs) => (
                      <div
                        key={index}
                        className=" test  flex justify-start border border-accent   text-center align-baseline w-full p-2">
                        <Link to={datas.link} key={indexs} className="w-max ">
                          {datas.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
        <div className="flex flex-row items-center justify-end">
          <Link
            to="/login"
            className="bg-accent rounded text-white font-normal text-base px-5 py-3 flex  gap-x-5">
            <img src={user} className="w-fit h-fit filter brightness-0 invert" />
            ورود | ثبت نام
          </Link>
        </div>
      </div>

      {/* Mobile & Table */}
      <div className="flex lg:hidden items-center justify-between px-6 h-[60px]">
        {/* <InlineSVG onClick={handleShowMenu} src={menuSVG} className="h-10 w-10" /> */}
        {/* Mobile Menu */}
        <div
          className={`${showMenu ? 'right-0' : 'right-[-101%]'}
          w-full fixed top-0 h-screen duration-500 flex`}>
          <div className="w-[300px] min-h-screen z-50 bg-secondary pb-5 text-white ">
            <div className="flex flex-col p-8">
              {/* <img src={logoWhite} alt="" className="h-[60px] mb-8" /> */}
              {navMenu.map((item) => (
                <li key={item.name} className="flex flex-row justify-between items-center mb-4">
                  <div className="text-base ml-1">{item.name}</div>
                  {/* <InlineSVG src={arrowSVG} fill="#aaa" /> */}
                </li>
              ))}
            </div>
          </div>
          <div onClick={handleHideMenu} className="w-[calc(100%-300px)] h-screen"></div>
        </div>

        <div className="flex flex-row items-center">
          <div className="flex flex-col items-center  px-4 py-1 rounded">
            {/* <img src={userSVG} className="rounded-full  w-8 h-8 p-1" fill="#1AA1A8" /> */}
            <div className="text-sm font-bold text-gray-700">
              {/* {userinfo ? userinfo?.fullName : null}{' '} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
