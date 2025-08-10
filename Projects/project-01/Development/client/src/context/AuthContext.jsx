import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setAuth(JSON.parse(saved));
    }
    setLoading(false);
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
