"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/api";
import { saveAuth, getAuth, clearAuth } from "@/utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user, token } = getAuth();
    if (token && user) {
      setUser(user);
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      saveAuth(res.data.user, res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.success) {
      saveAuth(res.data.user, res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res.data;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
