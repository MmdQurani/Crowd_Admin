/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './App.css';
import RoutsComponent from 'component/routes/RoutesCompnent';
import { AuthCheck } from 'component/routes/setting/AuthCheck';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataProvider } from 'comon/context/MainContext';
import { useLocation } from 'react-router-dom';
import Navbar from 'component/layout/navbar/Navbar';
import ScrollTop from 'component/Scroll/ScrollTop';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    (pathname === '/login' || pathname === '' || pathname === '/') &&
      localStorage.removeItem('token');
  }, [pathname]);

  console.log(pathname);

  // showing navbar handelin
  const navbarShow = pathname !== '/login';

  return (
    <React.Fragment>
      <DataProvider>
        <ToastContainer
          transition={Flip}
          position={innerWidth < 800 ? 'top-center' : 'bottom-center'}
          rtl={true}
          onClick={() => toast.dismiss()}
          style={{ maxWidth: '90vw' }}
        />
        <ScrollTop />
        {/* {navbarShow ? <Navbar /> : null} */}
        <AuthCheck>
          <RoutsComponent />
        </AuthCheck>
      </DataProvider>
    </React.Fragment>
  );
}

export default App;
