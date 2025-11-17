import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, onSuccess?: () => void) => void;
    logout: (onSuccess?: () => void) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.get('/api/auth/validate');
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    const login = (token: string, onSuccess?: () => void) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        if (onSuccess) onSuccess();
    };

    const logout = (onSuccess?: () => void) => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        if (onSuccess) onSuccess();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};