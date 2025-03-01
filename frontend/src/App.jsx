import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SkinAssessment from './pages/SkinAssessment';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import WelcomePage from './pages/WelcomePage';
import ResetPassword from './pages/Auth/ResetPassword';
import ForgetPassworda, { ForgotPassword } from './pages/Auth/ForgotPassword';
import ForgetPassword from './pages/Auth/ForgotPassword';

function App() {
  return (
    <Router>
       
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/" element={<Layout />}>


       
        
          <Route  path="" index element={<WelcomePage />} />

       
          <Route  path="assessment"  element={<SkinAssessment />} />
          <Route path="chat/:chatId"  element={<Chat />} />
      

          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
