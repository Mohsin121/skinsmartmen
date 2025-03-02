import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SkinAssessment from './pages/SkinAssessment';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import WelcomePage from './pages/WelcomePage';
import ResetPassword from './pages/Auth/ResetPassword';
import  { ForgotPassword } from './pages/Auth/ForgotPassword';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './components/LoadingSpinner';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      console.log("token", token)
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get("http://localhost:8000/api/user/context", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />; // Show a loader while checking auth status
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  console.log("Is authenticated", isAuthenticated)

  return (
    <Router>
       
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/" element={<Layout />}>
          <Route  path="" index element={<WelcomePage />} />    
          <Route  path="assessment"  element={<SkinAssessment />} />
          <Route path="chat/:chatId"  element={<Chat />} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
