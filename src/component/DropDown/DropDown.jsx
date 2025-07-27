/* eslint-disable no-unused-vars */
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import InlineSVG from 'react-inlinesvg';
import chevrondown from 'asset/image/icon/down-chevron-svgrepo-com.svg';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function DropDown({ select, setSelect, arrey, height, title, width }) {
  const [isOpen, setIsOpen] = useState(false);
  const HandleSelecteItem = (item) => {
    setSelect(item);
    setIsOpen(false);
  };
  return (
    <Menu as="div" className={`relative inline-block text-left  ${width ? width : 'w-full'} `}>
      <div className="w-full flex items-center align-baseline bg-white drop-shadow rounded-md p-1">
        <Menu.Button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full justify-between align-baseline items-center lg:gap-x-6 rounded-md bg-white py-2 text-sm font-semibold text-gray-600">
          {select ? (
            <p className=" text-xs  font-normal"> {select.name}</p>
          ) : (
            <p className="text-gray-500 text-xs  font-normal   ">انتخاب کنید </p>
          )}
          <InlineSVG
            src={chevrondown}
            className={`scale-125 ${
              isOpen ? 'transform rotate-180 ease delay-10' : 'transform rotate-0 ease delay-10'
            } transition-all duration-500`}
            width={30}
            height={10}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items
          className={`absolute ${
            height ? height : ' h-auto '
          } overflow-auto lg:right-0 z-[1001] mt-2 lg:w-full origin-top-right lg:left-0 rounded-md cursor-pointer bg-white w-full left-5 shadow-lg lg:ring-1 text-sm  text-right ring-black ring-opacity-5 focus:outline-none`}>
          {arrey?.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? 'bg-gray-600 text-white ' : 'text-gray-600 bg-white',
                    'block px-4 py-2 text-sm border-b-2'
                  )}
                  onClick={() => HandleSelecteItem(item)}>
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default DropDown;
