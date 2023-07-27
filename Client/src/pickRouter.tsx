// internal imports of sources
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Button from '@mui/material/Button';
// internal crafted imports of sources
import Login from './Route/LogIn';
import Register from './Route/Register';
import NotFound from './Route/NotFound';
import { AuthState } from './Store/Data';
import { GetAuthInfo } from './Store/Selectors';
import Calendar from './Route/calendar';
import StudentsInfo from './Route/StudentsInfo';
import Teachers from './Route/Teachers';
import Chat from './Route/Chat';
import Payment from './Route/Payment';
import Student from './Route/Student';
import ConfirmPassword from './Route/ConfirmPassword';
import Context from './Store/ContextApi';
import ProtectedRoute from './Route/ProtectedRoute';
import Notification from './Route/Notifications';
import Profile from './Route/Profile';
import Students from './Route/Students';
import LockScreen from './Route/LockScreen';
import FriendsToChat from './Route/FriendsTochat';
import ChatSpace from './Route/ChatSpace';
import RefreshToken from './components/RefreshToken';
import AuthRedirection from './Route/Auth_Redirection';
import EmailVerification from './Route/EmailVerification';
import Comment from './Route/Comment';
import PostsView from './Route/PostsView';

/**
 *  the main page where all routes are called
 * ? below is where lazy load components are called separated from ordinary imports above
 */

const FirstView = React.lazy(() => import('./Route/FirstView'));
const AppBar = React.lazy(() => import('./Route/AppBar'));
const Home = React.lazy(() => import('./Route/Home'));
const CreatePassword = React.lazy(() => import('./Route/CreatePassword'));
// const ConfirmPassword = React.lazy(() => import('./Route/ConfirmPassword'));
const CodeVerification = React.lazy(() => import('./Route/CodeVerification'));
const Dashboard = React.lazy(() => import('./Route/Dashboard'));
const Admin = React.lazy(() => import('./Route/Admin'));
const ForgotPassword = React.lazy(() => import('./Route/ForgotPassword'));

const InitialData = {
  AuthState,
  GetAuthInfo,
};

const CraftingRouter = () => {
  return (
    <Context.Provider value={InitialData}>
      <AppBar />
      <Routes>
        <Route path="/" element={<FirstView />} />
        <Route path="/lockscreen" element={<LockScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="home" caseSensitive element={<Home />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />}>
              <Route index element={<StudentsInfo />} />
              <Route path=":id" element={<Student />} />
            </Route>
            <Route path="Posts" element={<PostsView />}>
              <Route path=":id" element={<Comment />} />
            </Route>
            <Route path="chat" element={<Chat />}>
              <Route index element={<FriendsToChat />} />
              <Route path=":id" element={<ChatSpace />} />
            </Route>
            <Route path="profile/:status/:_id" element={<Profile />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="payment" element={<Payment />} />
            <Route path="admin" element={<Admin />} />
            <Route path="notifications" element={<Notification />} />
          </Route>
        </Route>
        <Route path="auth/redirection" element={<AuthRedirection />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="createpassword" element={<CreatePassword />} />
        <Route path="confirmation" element={<ConfirmPassword />} />
        <Route path="codeverification" element={<CodeVerification />} />
        <Route path="emailverification" element={<EmailVerification />} />
        <Route path="refreshToken" element={<RefreshToken />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Context.Provider>
  );
};

export default CraftingRouter;

// with react router v6 it comes down to a developper being able to use two ways at least to
// lazy load components, react built-in code-spliting feature and that of react router v6
// they both work a wonder but it's 100% up to you to show your preference
