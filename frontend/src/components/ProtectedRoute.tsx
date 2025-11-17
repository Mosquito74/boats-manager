import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import type {JSX} from "react";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}