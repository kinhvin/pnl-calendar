import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
            }}
          >
            P&L Calendar
          </h1>
          
          {/* Future: Add navigation links here */}
          {/* <nav>
            <Link to="/calendar">Calendar</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/settings">Settings</Link>
          </nav> */}
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#dc2626')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#ef4444')
              }
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </main>

      {/* Future: Add footer here */}
    </div>
  );
}