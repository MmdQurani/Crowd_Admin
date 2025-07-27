/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import DataContext from 'comon/context/MainContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InlineSVG from 'react-inlinesvg';
import ProfileSVG from 'asset/image/icon/Profile.svg';
import plan from 'asset/image/icon/plan/presentionchart.svg';
import { removeFromLocalStorage } from 'component/storage/localStorage';
import './sidebarcss.css';

function Sidebar() {
  const { userInfo, permission } = useContext(DataContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const Company = process.env.REACT_APP_COMPANY_NAME;

  const LogOutHandler = (e) => {
    e.preventDefault();
    console.log('remove');
    removeFromLocalStorage('token');
    navigate('/');
  };

  console.log(permission);

  function hasAccess(requiredKeys) {
    if (!Array.isArray(requiredKeys) || requiredKeys.length === 0) {
      return true;
    }
    return permission?.policies?.some(function (perm) {
      return requiredKeys.includes(perm.key);
    });
  }

  const menu = [
    {
      name: 'حساب کاربری',
      icon: plan,
      show: true,
      link: '/account'
    },
    {
      name: 'کاربران',
      icon: plan,
      show: hasAccess([
        'Admin.User.View',
        'Admin.User.Create',
        'Admin.User.ToggleStatus',
        'Admin.User.Impersonate'
      ]),
      accessibility: [
        'Admin.User.View',
        'Admin.User.Create',
        'Admin.User.ToggleStatus',
        'Admin.User.Impersonate'
      ],
      link: '/users'
    },
    {
      name: 'طرح ها',
      icon: plan,
      show: hasAccess(['Admin.Plan.View', 'Admin.Plan.Create', 'Admin.Plan.Edit']),
      accessibility: ['Admin.Plan.View', 'Admin.Plan.Create', 'Admin.Plan.Edit'],
      link: '/plans'
    },
    {
      name: 'سفارشات',
      icon: plan,
      show: hasAccess(['Admin.Order.Create', 'Admin.Order.View']),
      accessibility: ['Admin.Order.Create', 'Admin.Order.View'],
      link: '/user_order'
    },
    {
      name: 'رسید ها',
      icon: plan,
      show: hasAccess(['Admin.Receipt.View', 'Admin.Receipt.Process']),
      accessibility: ['Admin.Receipt.View', 'Admin.Receipt.Process'],
      link: '/receipts'
    },
    {
      name: 'واریز سود',
      icon: plan,
      show: hasAccess([
        'Admin.PayoutSchedule.View',
        'Admin.PayoutSchedule.Create',
        'Admin.PayoutSchedule.Edit',
        'Admin.PayoutSchedule.Delete'
      ]),
      accessibility: [
        'Admin.PayoutSchedule.View',
        'Admin.PayoutSchedule.Create',
        'Admin.PayoutSchedule.Edit',
        'Admin.PayoutSchedule.Delete'
      ],
      link: '/Scheduled_Payments_Management'
    },
    {
      name: 'مستندات',
      icon: plan,
      show: hasAccess(['Admin.Document.View', 'Admin.Document.Create', 'Admin.Document.Edit']),
      accessibility: ['Admin.Document.View', 'Admin.Document.Create', 'Admin.Document.Edit'],
      link: '/Financial_Statements_Management'
    },
    {
      name: 'تراکنش ها',
      icon: plan,
      show: hasAccess(['Admin.Transaction.View']),
      accessibility: ['Admin.Transaction.View'],
      link: '/transactions'
    },
    {
      name: 'پرداختی های درگاه',
      icon: plan,
      show: hasAccess(['Admin.GatewayPayment.View']),
      accessibility: ['Admin.GatewayPayment.View'],
      link: '/IPG_Payment'
    },
    {
      name: 'تقویم سرمایه گذاری',
      icon: plan,
      show: hasAccess([
        'Admin.InvestmentCalendar.View',
        'Admin.InvestmentCalendar.Create',
        'Admin.InvestmentCalendar.Edit',
        'Admin.InvestmentCalendar.Delete'
      ]),
      accessibility: [
        'Admin.InvestmentCalendar.View',
        'Admin.InvestmentCalendar.Create',
        'Admin.InvestmentCalendar.Edit',
        'Admin.InvestmentCalendar.Delete'
      ],
      link: '/investment_calendar'
    },
    {
      name: 'مدیریت درخواست بررسی طرح',
      icon: plan,
      show:
        Company == 'toranj' &&
        hasAccess(['Admin.PlanReviewRequest.View', 'Admin.PlanReviewRequest.Edit']),
      accessibility: ['Admin.PlanReviewRequest.View', 'Admin.PlanReviewRequest.Edit'],
      link: '/manage_project_review_form'
    },
    {
      name: 'درخواست های مشاوره',
      icon: plan,
      show: hasAccess(['Admin.ConsultationRequest.View', 'Admin.ConsultationRequest.ChangeStatus']),
      accessibility: ['Admin.ConsultationRequest.View', 'Admin.ConsultationRequest.ChangeStatus'],
      link: '/consulting_requests'
    },
    {
      name: 'ارزیابی سرمایه پذیر',
      icon: plan,
      show: hasAccess([
        'Admin.InvestorEvaluation.View',
        'Admin.InvestorEvaluation.Create',
        'Admin.InvestorEvaluation.Edit',
        'Admin.InvestorEvaluation.Delete'
      ]),
      accessibility: [
        'Admin.InvestorEvaluation.View',
        'Admin.InvestorEvaluation.Create',
        'Admin.InvestorEvaluation.Edit',
        'Admin.InvestorEvaluation.Delete'
      ],
      link: '/investee_evaluation'
    },
    {
      name: 'ارزیابی  طرح',
      icon: plan,
      show: hasAccess([
        'Admin.InvestorEvaluation.View',
        'Admin.InvestorEvaluation.Create',
        'Admin.InvestorEvaluation.Edit',
        'Admin.InvestorEvaluation.Delete'
      ]),
      accessibility: [
        'Admin.InvestorEvaluation.View',
        'Admin.InvestorEvaluation.Create',
        'Admin.InvestorEvaluation.Edit',
        'Admin.InvestorEvaluation.Delete'
      ],
      link: '/plan_evaluation'
    },
    {
      name: 'نظرات',
      icon: plan,
      show: hasAccess([
        'Admin.Comment.View',
        'Admin.Comment.Create',
        'Admin.Comment.Edit',
        'Admin.Comment.Delete'
      ]),
      accessibility: [
        'Admin.Comment.View',
        'Admin.Comment.Create',
        'Admin.Comment.Edit',
        'Admin.Comment.Delete'
      ],
      link: '/comment_managment'
    },
    {
      name: 'بارگذاری بنر',
      icon: plan,
      show: hasAccess(['Admin.StaticFile.Manage']),
      accessibility: ['Admin.StaticFile.Manage'],
      link: '/set_banner'
    },
    {
      name: 'شکایات',
      icon: plan,
      show: hasAccess(['Admin.Complaint.View']),
      accessibility: ['Admin.Complaint.View'],
      link: '/complaints'
    },
    {
      name: 'مدیریت ادمین و سطح دسترسی',
      icon: plan,
      show: hasAccess(['Admin.AccessManagement.Manage']),
      accessibility: ['Admin.AccessManagement.Manage'],
      link: '/admin_accessibility'
    }
  ];

  return (
    <div className="flex flex-col lg:h-screen overflow-y-scroll w-full  rounded-md py-11 items-center">
      {/* Show User Profile and Portfo */}
      <div className="flex flex-col items-start gap-x-6  w-2/3 ">
        <div className=" p-3 rounded  bg-gray-500  text-white  items-center  justify-center flex w-full ">
          <InlineSVG
            src={ProfileSVG}
            className="filter brightness-0 invert w-1/5 justify-end"
            fill=""
          />
          <p className="w-4/5 justify-start"> {userInfo?.title}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full border border-dashed border-dominant-200 my-11"></div>

      {menu.map(
        (item, i) =>
          item?.show && (
            <div className="flex flex-col w-full" key={i}>
              {/* Show Menu item  */}
              <div
                className={` flex justify-between  ${
                  pathname?.includes(item?.link) ? 'bg-gray-500 rounded  ' : ''
                } flex flex-row items-center py-[5px]  justify-between mb-6 pr-2 mr-10 ml-[42px]`}>
                <Link
                  to={item?.link}
                  className={` ${
                    pathname?.includes(item?.link) ? 'text-white' : ''
                  } flex flex-row items-center justify-start`}>
                  <InlineSVG
                    src={item.icon}
                    className={` ${
                      pathname?.includes(item?.link) ? 'fill-white filter brightness-0 invert' : ''
                    } ml-1 cursor-pointer`}
                  />

                  <div className="text-6 cursor-pointer mr-4">{item?.name} </div>
                </Link>
              </div>
              {/* Show Submenu */}
              {/* <div className="submenu1 ">
            {item.subMenu &&
              item.subMenu.map((sub) => (
                <Link
                  key={sub.name}
                  to={sub.link}
                  className={`flex flex-row items-center justify-between text-dominant-500 text-6 cursor-pointer  px-4 mb-3 mr-10 ml-[42px] ${
                    sub.link == pathname ? 'bg-accent-0 rounded text-white ' : null
                  } `}>
                  <div>
                    <span className="font-bold text-4 ml-2">.</span> {sub?.name}
                  </div>
                  {pathname === sub?.link && (
                    <InlineSVG src={arrowSVG} fill="white" className="cursor-pointer rotate-90" />
                  )}
                </Link>
              ))}
          </div> */}
            </div>
          )
      )}

      {/* Divider  */}
      <div className="h-px w-full border border-dashed border-dominant-200 my-11"></div>

      {/* Log out */}
      <button
        className="px-4 py-2 font-medium text-caption text-gray-500  border w-max border-gray-500 rounded mx-auto"
        onClick={(e) => LogOutHandler(e)}>
        خروج از حساب کاربری
      </button>
    </div>
  );
}

export default Sidebar;
