import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth';
import { AppSidebar, SiteHeader } from './components/dashboard';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { LoginPage, CalendarPage, DashboardPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with shared sidebar layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <SiteHeader />
                  <div className="flex-1 overflow-auto p-4 lg:p-6">
                    <Routes>
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/" element={<Navigate to="/calendar" replace />} />
                      <Route path="*" element={<Navigate to="/calendar" replace />} />
                    </Routes>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;