import { toast } from 'react-toastify';

const isStorageAvailable = () => {
  let localStorage;
  try {
    localStorage = window.localStorage;
    if (localStorage) return true;
  } catch (e) {
    toast.error('برای ورود به باشگاه لطفا دسترسی به local storage در مرورگر را فراهم نمایید', {
      toastId: 'isStorageAvailable'
    });
    return false;
  }
};

const isQuotaExceeded = (e) => {
  let quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
};

export const getFromLocalStorage = (key) => {
  if (isStorageAvailable()) {
    return localStorage.getItem(key);
  } else {
    return null;
  }
};

export const addToLocalStorage = (key, newData) => {
  if (isStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
    } catch (e) {
      if (isQuotaExceeded(e)) {
        toast.error('منابع local storage در مرورگر شما پر شده است', {
          toastId: 'addToLocalStorage'
        });
      }
    }
  }
};

export const addObjectToLocalStorage = (primaryKey, secondaryKey, newProperty) => {
  const tertiaryKey = Object.keys(newProperty)[0];
  let newData = {};
  let primaryDataStr = getFromLocalStorage(primaryKey);
  if (primaryDataStr) {
    const primaryData = JSON.parse(primaryDataStr);
    const secondaryData = primaryData[secondaryKey];
    if (secondaryData[tertiaryKey]) delete secondaryData[tertiaryKey];
    newData = { ...secondaryData };
  }
  newData = { ...newData, ...newProperty };
  const newObject = { [secondaryKey]: newData };
  addToLocalStorage(primaryKey, newObject);
};

export const clearLocalStorage = () => {
  if (!isStorageAvailable()) return;
  localStorage.clear();
};
export const removeFromLocalStorage = (key) => {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(key);
};
