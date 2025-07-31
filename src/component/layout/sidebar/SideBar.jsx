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
    <div className="flex flex-col h-full lg:h-screen w-full z[1000000000000] bg-white shadow-xl overflow-y-auto py-8 px-6">
      {/* Profile Card */}
      <div className="flex items-center gap-4 mb-8">
        <InlineSVG
          src={ProfileSVG}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 fill-white text-white"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">{userInfo?.title}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Menu Items */}
      <ul className="flex-1 space-y-2">
        {menu.map(
          (item, i) =>
            item.show && (
              <li key={i} className="group">
                <Link
                  to={item.link}
                  className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-indigo-50"
                >
                  <InlineSVG
                    src={item.icon}
                    className="w-6 h-6 text-indigo-500 transition-colors duration-200 group-hover:text-indigo-600"
                  />
                  <span className="text-gray-700 transition-colors duration-200 group-hover:text-indigo-600">
                    {item.name}
                  </span>
                </Link>
              </li>
            )
        )}
      </ul>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Logout */}
      <button
        onClick={LogOutHandler}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 w-full bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
      >
        خروج از حساب کاربری
      </button>

    </div>

  );
}

export default Sidebar;
