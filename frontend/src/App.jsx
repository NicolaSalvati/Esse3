import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminMatricolaPage from './pages/AdminMatricolaPage';
import AdminFacoltaPage from './pages/AdminFacoltaPage';
import ImmatricolazionePage from './pages/ImmatricolazionePage';
import ImmatricolazioneFormPage from './pages/ImmatricolazioneFormPage';
import AdminImmatricolazionePage from './pages/AdminImmatricolazionePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rotte protette */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/students" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminStudentsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/matricole" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMatricolaPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/facolta" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminFacoltaPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/immatricolazione" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminImmatricolazionePage />
                </ProtectedRoute>
              } />
              
              <Route path="/student" element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/superadmin" element={
                <ProtectedRoute requiredRole="superadmin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/immatricolazione" element={
                <ProtectedRoute>
                  <ImmatricolazionePage />
                </ProtectedRoute>
              } />
              
              <Route path="/immatricolazione/form" element={
                <ProtectedRoute>
                  <ImmatricolazioneFormPage />
                </ProtectedRoute>
              } />
              
              {/* Pagina 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
