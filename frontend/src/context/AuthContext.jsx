import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, fetchMe } from "../api/auth.api.js";
import { initSocket, disconnectSocket } from "../api/socket.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((res) => {
        const userData = res.data.data;
        setUser(userData);
        initSocket(userData._id);
      })
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
      
    return () => disconnectSocket();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const { user, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
    initSocket(user._id);
    return user;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    const { user, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
    initSocket(user._id);
    return user;
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
