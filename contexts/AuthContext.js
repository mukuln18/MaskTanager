"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verifySession() {
      try {
        const stored = localStorage.getItem("taskmanager_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
        
        // Verify token with backend
        const res = await authApi.me();
        const userData = res.data.user;
        setUser(userData);
        localStorage.setItem("taskmanager_user", JSON.stringify(userData));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("taskmanager_user");
      } finally {
        setLoading(false);
      }
    }
    
    verifySession();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem("taskmanager_user", JSON.stringify(userData));
    return userData;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await authApi.signup(data);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem("taskmanager_user", JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore errors on logout
    }
    setUser(null);
    localStorage.removeItem("taskmanager_user");
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
