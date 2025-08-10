import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/pages/jsx/Login";
import Register from "./components/pages/jsx/Register";
import ProtectedRoute from "./components/auth/jsx/ProtectedRoute";
import ProtectedAppRoutes from "./components/routes/AuthRoutes";
import ErrorPage from "./components/pages/jsx/ErrorPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      </Router>
    </AuthProvider>
  );
}
