import { useEffect, useRef, useState } from 'react';
import arrowDown from 'asset/image/icon/arrowIcon/Arrow - Down Circle.png';

const DropDownButton = ({ items, selected, setSelected, title, width }) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    document.addEventListener('click', handleDropdownClick);
  }, [ref]);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    if (ref.current && ref.current.contains(e.target)) setOpen(!isOpen);
  };

  <span className="custm-dropdown" onClick={handleDropdownClick}></span>;

  return (
    <div className={`dropdown flex flex-col items-center ${width ? width : 'w-full'} `}>
      <button
        className="text-white border border-dominant-200 rounded-lg w-full h-[48px]   font-medium text-sm px-4 py-2.5 text-center inline-flex items-center"
        onClick={handleDropdownClick}
        ref={ref}>
        <button className="w-full h-[48px]">
          <p className="flex font-IRANYekanX  text-xs font-normal   w-fit	relative top-[-1.2rem]  -right-2 rounded text-gray-700 ">
            {title}
          </p>
          <div className="flex font-IRANYekanX justify-between font-normal text-sm relative  text-gray-700">
            <p className="mr-[8px] justify-around relative bottom-1">{selected}</p>
            <img
              src={arrowDown}
              className={`${
                isOpen ? 'transform rotate-180 ease delay-100' : 'fill-current text-accent h-6 w-6'
              } transition-all duration-500  relative bottom-2 right-2`}
            />
          </div>
        </button>
      </button>

      <div
        id="dropdown"
        className={`z-50 w-full border-2 border-accent rounded-md  divide-y divide-gray-100 shadow ${
          isOpen ? 'block ' : 'hidden'
        }`}>
        <ul
          className={`w-full z-50  bg-gray-300 rounded divide-y divide-gray-100 shadow absolute  ${
            items.length > 5 && 'overflow-y-scroll h-40'
          }`}>
          {items?.map((item, index) => (
            <li key={index} onClick={() => setOpen(!isOpen)} className="flex justify-around">
              <a
                href="#"
                className="block py-2 px-4 hover:bg-gray-100 w-full "
                onClick={() => setSelected(item)}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDownButton;
