import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import Login from "./components/pages/jsx/Login";
import ProtectedRoute from "./components/auth/jsx/ProtectedRoute";
import ProtectedAppRoutes from "./components/routes/AuthRoutes";
import ErrorPage from "./components/pages/jsx/ErrorPage";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

export default function App() {
  return (
    <ToastProvider>
      <div className="AppRoot">
        <Router>
          <AuthProvider>
            <Routes>
              {/* <Route path="/login" element={<Login />} /> */}
              {/* <Route path="/register" element={<Register />} /> */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <ProtectedAppRoutes />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </ToastProvider>
  );
}
