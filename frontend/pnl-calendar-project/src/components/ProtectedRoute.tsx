import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()

    // Still checking auth status
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <div>Loading...</div>
            </div>
        )
    }

    // Not logged in - redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // User is authenticated - show the protected content
    return <>{children}</>
}