/* eslint-disable no-unused-vars */
import Sidebar from 'component/layout/sidebar/SideBar';
import { useLocation } from 'react-router';
import AllPlans from './component/AllPlans';
import DrawerSidebar from 'component/DrawerSidebar/DrawerSidebar';
import { useState } from 'react';
import { IoMdMenu } from 'react-icons/io';

function Plans() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex flex-row items-start h-auto">
      <div className="w-[350px] bg-white sticky top-0 right-0 hidden lg:flex">
        <Sidebar />
      </div>

      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex-1 w-full h-full flex flex-col items-center align-middle p-10 ">

        <button
          className="lg:hidden flex justify-center items-center w-full self-end mb-4 p-2 border border-1 border-gray-300 text-gray-700 hover:bg-white transition-colors duration-300 rounded"
          onClick={() => setIsDrawerOpen(true)}
        >
          <IoMdMenu className="text-2xl" />
        </button>

        <AllPlans />
      </div>
    </div>
  );
}

export default Plans;
