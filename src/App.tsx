import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "./hooks/useTheme";
import { useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store/authStore";
import { authService } from "./services/auth";

// Auth Pages
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { RequestReset } from "./pages/RequestReset";
import { ResetPassword } from "./pages/ResetPassword";

// Protected Pages
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Inventory } from "./pages/Inventory";
import { Orders } from "./pages/Orders";
import { TransactionsPage } from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports/index";
import { Settings } from "./pages/Settings";

// Auth Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = localStorage.getItem("token");

  // If there's a token but not authenticated in store, try to restore session
  useEffect(() => {
    const restoreSession = async () => {
      if (token && !isAuthenticated) {
        try {
          const user = await authService.getCurrentUser();
          useAuthStore.getState().login(user, token);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };
    restoreSession();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { theme } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 600000); // 3 seconds for demo purposes
    }
  };

  const handleLogout = async () => {
    const user = useAuthStore.getState().user;
    if (user) {
      await authService.logout(user.id);
    }
    useAuthStore.getState().logout();
    localStorage.removeItem("auth-storage");
    toast.success("Session timed out, you've been inactive for more than 3 seconds. You have been logged out. Please relogin.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000); // 2 seconds delay to show the toast message
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    const handleActivity = () => resetTimeout();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    // Update color scheme meta tag
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute("content", theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <Router>
        <div
          className={`min-h-screen transition-colors duration-200 ${
            theme === "dark"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-50 text-black"
          }`}
        >
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/request-reset" element={<RequestReset />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>

          <ToastContainer
            position="bottom-right"
            theme={theme}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
