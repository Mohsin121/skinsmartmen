import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SkinAssessment from './pages/SkinAssessment';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
       
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
       
          <Route index element={<Chat />} />
          <Route  path="assessment" element={<SkinAssessment />} />

          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
