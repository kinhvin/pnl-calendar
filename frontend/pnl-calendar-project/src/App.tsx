import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage, CalendarPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CalendarPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to calendar */}
        <Route path="/" element={<Navigate to="/calendar" replace />} />

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;