import React from 'react';

// import andokhte from 'asset/images/chest/اندوخته copy 2.png';
// import ati from 'asset/images/chest/آتی copy 2.png';
// import hamian from 'asset/images/chest/همیان copy 2.png';
// import aval from 'asset/images/chest/سپهر اول بازار copy 3.png';
function Footer() {
  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-x-12 bg-complement-400 w-full py-8">
        {/* <img src={andokhte} className="brightness-0 invert w-[135px]" alt="" />
        <img src={ati} className="brightness-0 invert w-[135px]" alt="" />
        <img src={aval} className="brightness-0 invert w-[135px]" alt="" />
        <img src={hamian} className="brightness-0 invert w-[135px]" alt="" /> */}
      </div>
      <div className="w-full h-[6px] bg-accent"></div>
      <div className="py-2 bg-gray-600">
        <div className="flex flex-row justify-between items-center max-w-[1440px] mx-auto">
          <div className="text-white font-regular text-footer">
            کلیه حقوق این سامانه متعلق به تامیـن سرمایه سپهر است.
          </div>
          <div className="text-white font-regular text-footer">021 88193870-4</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
