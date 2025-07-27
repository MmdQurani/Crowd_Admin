import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import InlineSVG from 'react-inlinesvg';
import chevrondown from 'asset/image/Vector.svg';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dropdown({ arrey, setstate, state, height, name }) {
  return (
    <Menu as="div" className="relative inline-block text-left max-w-[500px] min-w-[200px]">
      <div className="flex items-center align-baseline">
        <Menu.Button
          className={`inline-flex w-full justify-center align-baseline items-center gap-x-2  rounded-md lg:bg-white px-4 h-[40px]  text-sm font-semibold text-gray-600 shadow-sm `}>
          {state ? (
            arrey[state]
          ) : (
            <p className="text-gray-600  lg:block hidden text-sm "> {name ? name : 'نوع تراکنش'}</p>
          )}
          <InlineSVG src={chevrondown} className="lg:block hidden" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100">
        <Menu.Items
          className={`absolute ${
            height ? height : ' h-[200px] '
          } overflow-auto lg:right-0 z-10 mt-2 lg:w-56 origin-top-right lg:left-0 rounded-md text-start bg-slate-50 w-auto left-5 shadow-lg lg:ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="py-1 ">
            {arrey?.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    className={classNames(
                      active ? 'bg-gray-500 text-white ' : 'text-gray-600 ',
                      'block px-4 py-2 text-sm cursor-pointer border-b-2'
                    )}
                    onClick={() => (index > 0 ? setstate(index) : setstate())}>
                    {item}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
