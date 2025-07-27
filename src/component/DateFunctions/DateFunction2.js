/* eslint-disable no-unused-vars */
import moment from 'moment';
import 'moment-jalaali';
import jalaali from 'jalaali-js';

function getOneYearAgoAndToday() {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    today: formatDate(today),
    oneYearAgo: formatDate(oneYearAgo)
  };
}

const getDate = (data) =>
  new Date(data).toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    formatMatcher: 'basic',
    numberingSystem: 'latn'
  });

const ConvertDateToPersion = (persianDate) => {
  // Map of Persian month names
  const persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
  ];

  const [year, month, day] = persianDate.split('/');

  const persianMonthName = persianMonths[parseInt(month) - 1];

  return `${year} ${persianMonthName}`;
};

const getFormattedTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFormattedDateOneYearAgo = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 1);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//  get number of month that you want to come back from now
const getFormattedDate = (monthsAgo = 12) => {
  const today = new Date();
  today.setMonth(today.getMonth() - monthsAgo);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function addOneDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const convertToGregorianForJalaloDash = (jalaliDate) => {
  const [jy, jm, jd] = jalaliDate.split('-').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
};

const ConvertJlaliToNormalDate = (date) => {
  return moment(date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
};

const CalculateDate = (days) => {
  const currentDate = new Date();

  // Calculate the target date based on the input
  currentDate.setDate(currentDate.getDate() + days);

  return currentDate;
};

export default {
  addOneDay,
  getFormattedTodayDate,
  getOneYearAgoAndToday,
  getFormattedDateOneYearAgo,
  getDate,
  ConvertDateToPersion,
  getFormattedDate,
  ConvertJlaliToNormalDate,
  convertToGregorianForJalaloDash,
  CalculateDate
};
