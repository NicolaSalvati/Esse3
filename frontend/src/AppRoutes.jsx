import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniversityInfo from './pages/UniversityInfo';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/university-info" element={<UniversityInfo />} />
        {/* Altre route verranno aggiunte qui */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
