import Sidebar from 'component/layout/sidebar/SideBar';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

function DrawerSidebar({ isOpen, onClose }) {
  return (
    <div
      className={`lg:hidden fixed inset-0 z-[10000] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* بک‌درپ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* خود سایدبار */}
      <div
        className={`absolute inset-y-0 right-0 w-[350px] bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-start p-4">
          <IoMdClose
            className="text-2xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default DrawerSidebar;
