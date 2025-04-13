import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import AdminMatricolaPage from './pages/AdminMatricolaPage';
import ImmatricolazionePage from './pages/ImmatricolazionePage';
import ImmatricolazioneFormPage from './pages/ImmatricolazioneFormPage';
import AdminImmatricolazionePage from './pages/AdminImmatricolazionePage';
import AdminFacoltaPage from './pages/AdminFacoltaPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/immatricolazione" element={<ImmatricolazionePage />} />
            <Route path="/immatricolazione/form" element={<ImmatricolazioneFormPage />} />
            
            {/* Rotte protette */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/matricole" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminMatricolaPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/students" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminStudentsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/immatricolazione" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminImmatricolazionePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/facolta" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminFacoltaPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/superadmin" 
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
