import React, { useEffect, useRef, useState } from 'react';
import upload from 'asset/image/icon/upload/attach-square.png';
import axios from 'axios';
import { getFromLocalStorage } from 'component/storage/localStorage';
import getBaseUrl from 'component/Axios/getBaseUrl';

function FileUploadPage({ setFileAddress, id, multiple = false, requiresSigning = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const token = JSON.parse(getFromLocalStorage('token'));
  const inputRef = useRef();
  const [isUploading, setIsUploading] = useState(false); // State to track if uploading

  // Handle file selection and upload
  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile) {
        setIsUploading(true); // Set uploading state to true
        await submitHandler();
        setIsUploading(false); // Reset uploading state
      }
    };
    uploadFile();
  }, [selectedFile]);

  // Reset the selected file if needed (based on id)
  useEffect(() => {
    setSelectedFile(null);
  }, [id]);

  // File selection handler
  const onChangeHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]); // Set selected file
      inputRef.current.value = ''; // Reset the input field immediately to avoid re-trigger
    }
  };

  console.log('selectedFile', selectedFile);

  // Upload file to the server
  const submitHandler = async () => {
    const formData = new FormData();
    formData.append('File', selectedFile);
    formData.append('requiresSigning', requiresSigning);
    try {
      const res = await axios.post(`${getBaseUrl()}Blob/Upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('res', res?.data?.data?.path);

      // Set file path in parent component
      multiple ? setFileAddress(id, res?.data?.data?.path) : setFileAddress(res?.data?.data?.path);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  return (
    <div className="w-full">
      <form
        className=" flex items-center gap-x-2 rounded-md cursor-pointer  border px-2 border-gray-500 w-full h-[40px] bg-white  justify-between "
        onClick={() => {
          if (!isUploading) {
            // Only trigger the click if not uploading
            inputRef.current.click();
          }
        }}>
        <input type="file" name="file" onChange={onChangeHandler} ref={inputRef} hidden />
        {selectedFile ? (
          <p className="  text-xs text-gray-500 pr-3 ">{selectedFile?.name}</p>
        ) : (
          <p className="  text-xs text-gray-500 pr-3 ">برای بارگذاری فایل کلیک کنید </p>
        )}
        <div>
          <button
            className="align-baseline flex justify-center items-center"
            type="button"
            onClick={() => {
              if (!isUploading) {
                // Only trigger the click if not uploading
                inputRef.current.click();
              }
            }}>
            <img src={upload} title="Click to upload" className="scale-105" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default FileUploadPage;
