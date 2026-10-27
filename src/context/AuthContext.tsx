import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API = "http://localhost:8000";
const STORAGE_KEY = "auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.get<User[]>(`${API}/users`, {
      params: { email, password },
    });
    if (!data.length) throw new Error("Invalid email or password");
    const u = data[0];
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const register = async (name: string, email: string, password: string) => {
    const { data: existing } = await axios.get<User[]>(`${API}/users`, {
      params: { email },
    });
    if (existing.length) throw new Error("Email already registered");
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    const { data } = await axios.post<User>(`${API}/users`, newUser);
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
