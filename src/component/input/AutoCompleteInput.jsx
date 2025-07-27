import React, { useState, useEffect, useRef } from 'react';
import { AutoCompleteUsernameReq } from 'pages/Payment/Api/paymentReq';

function AutoCompleteInput({ setUserId, userId }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState();
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length > 0) {
        autocompleteRequest(value);
      } else {
        setSuggestions([]);
      }
    }, 200);
  };

  const autocompleteRequest = async (query) => {
    try {
      const response = await AutoCompleteUsernameReq(query);
      setSuggestions(response?.data);
    } catch (error) {
      console.error('Autocomplete request failed:', error);
    }
  };

  const handleSelect = (item) => {
    setUserId(item.id);
    setInputValue(item.name);
    setSuggestions([]);
  };
  console.log('USER ID  ', suggestions);
  return (
    <div className="relative  w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-2 border  rounded-md border-b border-gray-200 focus:outline-none focus:border-gray-200 focus:ring-0 placeholder:text-xs "
        placeholder="شناسه ملی را وارد کنید"
      />
      {suggestions?.length > 0 ? (
        <ul className="absolute w-full bg-white border rounded mt-1 max-h-60 overflow-auto z-50">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-500   cursor-pointer hover:text-white rounded-md border-b border-gray-200   ">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        !userId && suggestions && <span className="text-gray-500 text-sm">موردی یافت نشد</span>
      )}
    </div>
  );
}

export default AutoCompleteInput;
