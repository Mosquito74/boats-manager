import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Login from "./components/login/Login.tsx";
import Overview from "./components/overview/Overview.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function AuthHandler() {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only run the navigation logic after the initial auth check is complete
        if (!loading) {
            const isLoginPage = window.location.pathname === '/login';
            
            if (!isAuthenticated && !isLoginPage) {
                navigate('/login');
            } else if (isAuthenticated && isLoginPage) {
                // If user is authenticated and tries to access login page, redirect to overview
                navigate('/overview');
            }
        }
    }, [isAuthenticated, loading, navigate]);

    // Don't render anything until we've completed the initial auth check
    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AuthHandler />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/overview"
                        element={
                            <ProtectedRoute>
                                <Overview />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    );
}