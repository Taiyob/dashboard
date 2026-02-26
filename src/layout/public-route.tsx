// src/layout/public-route.tsx
// Redirects already-authenticated admin users away from the login page
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Already logged in as admin → go straight to dashboard
    if (isAuthenticated && role === import.meta.env.VITE_AUTHORIZED_ROLE) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
