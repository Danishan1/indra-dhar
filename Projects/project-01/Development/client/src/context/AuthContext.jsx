import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const verifyAuth = async () => {
      const saved = localStorage.getItem("auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAuth(parsed);

        try {
          await verifyToken();
        } catch (err) {
          console.warn("Token invalid, logging out");
          logout();
          window.location.href = "/login";
        }
      }
      setLoading(false);
    };

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (user, token) => {
    const newAuth = { user, token };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
