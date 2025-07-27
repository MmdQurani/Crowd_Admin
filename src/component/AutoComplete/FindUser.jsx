import Input from 'component/input/Input';
import { AutoCompleteUsernameReq } from 'pages/Payment/Api/paymentReq';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import BouncingDotsLoader from 'component/Loading/BouncingDotsLoader';

function FindUser({ setUserId, setNationalCode = false, nationalCode = false }) {
  const [nationalId, setNationalId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search function to limit API calls
  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value) {
        setIsLoading(true);
        try {
          const res = await AutoCompleteUsernameReq(value);
          setSearchResults(res?.data || []);
          setShowDropdown(true); // Ensure dropdown opens on search
        } catch (error) {
          console.error('Error fetching user data:', error);
          setSearchResults([]);
        }
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500),
    []
  );

  useMemo(() => {
    !nationalCode && setNationalId('');
  }, [nationalCode]);

  // Handle input change
  const handleInputChange = (value) => {
    setNationalId(value);
    if (value) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setUserId(null); // Clear userId if input is empty
    }
  };

  // Handle item selection
  const handleItemClick = (item) => {
    setNationalId(item?.username);
    setUserId(item?.id);
    setNationalCode && setNationalCode(item?.username);
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full z-[10000]" ref={dropdownRef}>
      <Input
        label="نام کاربری"
        placeholder=""
        width="text-center w-full"
        setvalue={handleInputChange}
        value={nationalId}
      />
      {showDropdown && (
        <div className="absolute max-w-[320px] w-[91%] z-[10000] text-white">
          {isLoading ? (
            <BouncingDotsLoader />
          ) : searchResults.length > 0 ? (
            <ul className="border border-gray-400 rounded-md bg-accent-300" id="element">
              {searchResults.map((item, index) => (
                <li
                  key={index}
                  className="p-2 flex justify-between cursor-pointer hover:bg-accent-300 rounded-md"
                  onClick={() => handleItemClick(item)}>
                  <p className="text-xs">{item?.name}</p>
                  <p className="text-xs">{item?.username}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm rounded-md p-3 text-center bg-accent-300 w-full">
              کاربری یافت نشد
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FindUser;
