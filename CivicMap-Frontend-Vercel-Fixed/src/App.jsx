import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import AccountPage from './pages/AccountPage';
import GenericPage from './pages/GenericPage';
import RecordsPage from './pages/RecordsPage';
import DashboardPage from './pages/DashboardPage';
export default function App(){return <BrowserRouter><Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/><Route path="map" element={<MapPage/>}/><Route path="explore" element={<MapPage/>}/><Route path="report" element={<ReportPage/>}/><Route path="login" element={<LoginPage/>}/><Route path="admin-login" element={<LoginPage/>}/><Route path="forgot-password" element={<ForgotPassword/>}/><Route path="verify-email" element={<VerifyEmail/>}/><Route path="reset-password" element={<ResetPassword/>}/><Route path="profile" element={<AccountPage/>}/><Route path="account" element={<AccountPage/>}/><Route path="infrastructure" element={<RecordsPage/>}/><Route path="survey" element={<RecordsPage/>}/><Route path="dashboard" element={<DashboardPage/>}/><Route path="admin" element={<RecordsPage/>}/><Route path="contact" element={<GenericPage/>}/><Route path="about" element={<GenericPage/>}/><Route path="privacy" element={<GenericPage/>}/><Route path="terms" element={<GenericPage/>}/><Route path="accessibility" element={<GenericPage/>}/><Route path="help" element={<GenericPage/>}/><Route path="403" element={<NotFound/>}/><Route path="404" element={<NotFound/>}/><Route path="*" element={<NotFound/>}/>
</Route></Routes></BrowserRouter>}
