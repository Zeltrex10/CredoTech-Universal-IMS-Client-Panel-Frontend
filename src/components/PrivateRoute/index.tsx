import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const PrivateRoute = () => {
	const { isAuthenticated } = useAuthStore();

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
