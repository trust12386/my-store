import { useState } from "react";
import { Auth } from "../contexts/AuthContext";
import http from "../http";

const useAuth = (): Auth => {
  const [token, setToken] = useState<string | null>(() => {
    const cacheToken = localStorage.getItem("token") || null;
    const cacheTokenExpires =
      Number(localStorage.getItem("token_expires")) || 0;

    const isExpired = Date.now() - cacheTokenExpires >= 0;

    return !isExpired ? cacheToken : null;
  });

  const [isAdmin, setIsAdmin] = useState<number>(
    Number(localStorage.getItem("is_admin")) || 0
  );

  const login = async (data: any) => {
    try {
      const response = await http.post("/auth/login", data);
      
      const { token, user, expiresIn } = response.data;

      const tokenExpires = Date.now() + expiresIn * 60 * 1000;

      localStorage.setItem("is_admin", user.is_admin);
      localStorage.setItem("token", token);
      localStorage.setItem("token_expires", String(tokenExpires));

      setToken(token);
      setIsAdmin(user.is_admin);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("is_admin");
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires");

    setToken(null);
    setIsAdmin(0);
    window.location.reload()
  };

  return { setToken, token, isAdmin: !!token && isAdmin === 1, login, logout };
};

export default useAuth;
