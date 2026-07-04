"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api, apiUtil, setAccessToken } from "@/utils/api";
import { saveAuth, getAuth, clearAuth } from "@/utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken_] = useState(null); // access token only (memory)
  const [loading, setLoading] = useState(true);

  const setToken = (token) => {
    setToken_(token);
    setAccessToken(token);
  };

  // 🔁 SESSION RESTORE ON PAGE LOAD
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiUtil.get("/auth/refresh");

        if (res.success) {
          setUser(res.user);
          setToken(res.accessToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // LOGIN
  const login = async (email, password, code) => {
    const res = await apiUtil.post("/auth/login", {
      email,
      password,
      tenantCode: code,
    });

    console.log("DDDD : ", res);

    if (res.success) {
      setUser(res.user);
      setToken(res.accessToken);
    }

    return res;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await apiUtil.post("/auth/logout");
    } finally {
      setUser(null);
      setToken(null);
    }
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

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
