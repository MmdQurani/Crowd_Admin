/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useLocation } from 'react-router';
import AllPlans from './component/AllPlans';

function Plans() {
  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-1/4 h-full bg-secondary fixed right-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className="w-full lg:w-full max-w-[1355px] lg:mr-[calc(25%_+_40px)] flex flex-col items-center align-middle p-10 ">
        <AllPlans />
      </div>
    </div>
  );
}

export default Plans;
