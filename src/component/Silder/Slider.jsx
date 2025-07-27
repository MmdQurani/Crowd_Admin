/* eslint-disable no-unused-vars */
import React from 'react';
// import { Zoom } from 'react-slideshow-image';
// import 'react-slideshow-image/dist/styles.css';
import { BaseUrl } from './../baseURL/BaseUrl';
import { Carousel } from 'flowbite-react';

const Slider = ({ pictures }) => {
  let images = pictures;
  console.log(pictures);
  // const counter = () => {
  //   let length = images && images.length;
  //   for (let i = 0; i < length; i++) {
  //     return i;
  //   }
  // };
  return (
    <>
      <div className="h-[200px] sm:h-[350px] xl:h-[400px] 2xl:h-[450px] direction-ltr">
        <Carousel>
          <img
            src={BaseUrl + 'c5\\00\\c500732b-5dde-4071-d8d9-08dbf982a2ee.png'}
            className="w-fit"
          />
          {/* {' '}
          {images &&
            images?.map((item, index) => (
              <img src={BaseUrl + `${item}`} className="h-full lg:object-cover" key={index} />
            ))} */}
        </Carousel>
      </div>
      {/* <div className="carousel w-1/10 h-1/10 flex">
        {images &&
          images?.map((item, index) => (
            <div id={'item' + `${index}`} className="h-full lg:object-cover" key={index}>
              <img src={BaseUrl + `${item}`} className="h-full lg:object-cover" />
            </div>
          ))}
      </div> */}
      <div className="flex justify-center w-fit h-fit py-2 gap-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
      </div>
    </>
  );
};

export default Slider;
