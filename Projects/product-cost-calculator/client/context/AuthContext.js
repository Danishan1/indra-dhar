"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/utils/api";
import { saveAuth, getAuth, clearAuth } from "@/utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: check if token exists and validate it with backend
  useEffect(() => {
    const initAuth = async () => {
      const { user, token } = getAuth();
      if (token && user) {
        try {
          // Validate token
          const res = await api.get("/auth/check-jwt", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.success) {
            setUser(res.data.user);
            setToken(token);
          } else {
            clearAuth();
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      saveAuth(res.data.user, res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res.data;
  };

  // Register
  const register = async (name, email, password, confirmPassword, role) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
      role,
    });
    if (res.data.success) {
      saveAuth(res.data.user, res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res.data;
  };

  // Logout
  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
