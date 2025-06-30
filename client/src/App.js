import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './user/login';
import Signup from './user/signup';
import Dashboard from './user/dashboard';
import CalculateCarbon from './user/calculate';
import Report from './user/ReportPage';
import About from './user/about';
import Profile from './user/profile';
import Logout from './user/logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculate" element={<CalculateCarbon />} />
        <Route path="/report" element={<Report />} />
        
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
