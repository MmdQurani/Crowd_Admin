export const planStatusEnum = [
  { name: ' نامشخص', status: false, key: 100 },
  { name: ' تایید اولیه', status: false, key: 1 },
  { name: ' در انتظار تایید نهاد مالی', status: false, key: 2 },
  { name: ' در انتظار تایید عامل', status: false, key: 3 },
  { name: ' در انتظار صدور نماد', status: false, key: 4 },
  { name: ' تایید شده و در انتظار انتشار', status: true, key: 5 },
  { name: ' رد طرح', status: false, key: 6 },
  { name: ' آغاز جمع آوری وجوه', status: true, key: 7 },
  { name: ' موفقیت جمع آوری وجوه', status: true, key: 8 },
  { name: ' عدم موفقیت جمع آوری وجوه', status: false, key: 9 }
];

export const findStatusTitle = (status) => planStatusEnum.find((item) => item.key == status);
export const scheduledPaymentsManagementStatus = [
  {
    key: 1,
    name: 'برنامه‌ریزی‌شده'
  },
  {
    key: 2,
    name: 'در حال پردازش'
  },
  {
    key: 3,
    name: 'ناموفق'
  },
  {
    key: 4,
    name: 'لغو شده'
  },
  {
    key: 5,
    name: 'در انتظار'
  },
  {
    key: 6,
    name: 'پرداخت نیمه کامل'
  },
  {
    key: 7,
    name: 'کامل'
  }
];

export const payStatusEnum = [
  { key: 1, name: 'پرداخت موفق', textColor: 'text-green-500' },
  { key: 2, name: 'در انتظار پرداخت', textColor: 'text-yellow-500' },
  { key: 3, name: 'انصراف از درگاه', textColor: 'text-purple-500' },
  { key: 4, name: 'مشکوک', textColor: 'text-purple-500' },
  { key: 5, name: 'منقضی شده', textColor: 'text-orange-500' }
];
