/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom';
import PrivateRouts from './setting/privateRoute';
import NotFound from 'component/notfound/NotFound';
import Login from 'pages/Login/login';
import Account from 'pages/Account/Account';
import Plans from 'pages/Plans/Plans';
import PlanDetails from 'pages/Plans/component/PlanDetails';
import PlanDetailsEdit from 'pages/Plans/component/PlanDetailsEdit';
import Users from 'pages/User/Users';
import UsersDetails from 'pages/User/component/UsersDetails';
import UserOrder from 'pages/UserOrder/UserOrder';
import UserOrderDetails from 'pages/UserOrder/component/UserOrderDetails';
// import Wallet from 'pages/Wallet/Wallet';
import Payment from 'pages/Payment/Payment';
import ScheduledPaymentsManagement from 'pages/ScheduledPaymentsManagement/ScheduledPaymentsManagement';
import FinancialStatementsManagement from './../../pages/FinancialStatementsManagement/FinancialStatementsManagement';
import Transactions from 'pages/transactions/Transactions';
import IPGPayment from 'pages/IPGPayments/IPGPayment';
import CommentManagment from 'pages/CommentManagment/CommentManagment';
import ScheduledPaymentsManagementDetails from 'pages/ScheduledPaymentsManagement/component/ScheduledPaymentsManagementDetails';
import CreatePlan from 'pages/Plans/component/CreatePlan';
import InvestmentCalendar from 'pages/InvestmentCalendar/InvestmentCalendar';
import Receipts from 'pages/Receipts/Receipts';
import SetBanner from 'pages/SetBanner/SetBanner';
import Complaints from 'pages/Complaints/Complaints';
import ManageProjectReviewForm from 'pages/ManageProjectReviewForm/ManageProjectReviewForm';
import ConsultingRequests from 'pages/ConsultingRequests/ConsultingRequests';
import AdminAndAccessibility from 'pages/AdminAndAccessibility/AdminAndAccessibility';
import InvesteeEvaluation from 'pages/InvesteeEvaluation/InvesteeEvaluation';
import PlanEvaluation from 'pages/PlanEvaluation/PlanEvaluation';

const RoutsComponent = () => {
  const Company = process.env.REACT_APP_COMPANY_NAME;

  return (
    <>
      <Routes>
        {/* need to logged in */}
        <Route element={<PrivateRouts />}>
          <Route path="/account" element={<Account />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/plan_details/:id" element={<PlanDetails />} />
          <Route path="/plans/plan_details_edit/:id" element={<PlanDetailsEdit />} />
          <Route path="/plans/create_plan" element={<CreatePlan />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/details/:code/:type" element={<UsersDetails />} />
          <Route path="/user_order" element={<UserOrder />} />
          <Route path="/user_order/:id" element={<UserOrderDetails />} />
          {/* <Route path="/Wallet" element={<Wallet />} /> */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/Scheduled_Payments_Management" element={<ScheduledPaymentsManagement />} />
          <Route
            path="/Scheduled_Payments_Management_Details/:id"
            element={<ScheduledPaymentsManagementDetails />}
          />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/set_banner" element={<SetBanner />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/IPG_Payment" element={<IPGPayment />} />
          <Route path="/investment_calendar" element={<InvestmentCalendar />} />
          {/* <Route path="/evaluation" element={<Evaluation />} /> */}
          <Route path="/investee_evaluation" element={<InvesteeEvaluation />} />
          <Route path="/plan_evaluation" element={<PlanEvaluation />} />
          <Route path="/comment_managment" element={<CommentManagment />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/Financial_Statements_Management" element={<FinancialStatementsManagement />} />
          <Route path="/admin_accessibility" element={<AdminAndAccessibility />} />
          {Company == 'toranj' && (
            <Route path="/manage_project_review_form" element={<ManageProjectReviewForm />} />
          )}
          <Route path="/consulting_requests" element={<ConsultingRequests />} />
        </Route>
        {/* finish needed to login rout */}
        {/* main root */}
        <Route path="/" exact element={<Login />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/home" exact element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default RoutsComponent;

// check "/" rout when token is false
