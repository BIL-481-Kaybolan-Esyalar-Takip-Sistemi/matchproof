import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import PostFormPage from './pages/PostFormPage';
import AdminPage from './pages/AdminPage';
import { Spinner } from './components/ui';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <div style={{ maxWidth: 900, margin: '0 auto', padding: 40 }}><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/new" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
      <Route path="/items/:itemId" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
      <Route path="/items/:itemId/edit" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
            <Header />
            <main><AppRoutes /></main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}