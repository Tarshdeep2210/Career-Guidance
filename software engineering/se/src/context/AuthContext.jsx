import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeAccount, setActiveAccount] = useState(() => {
    const saved = localStorage.getItem("activeAccount");
    return saved ? JSON.parse(saved) : null;
  });

  // Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ------------------ Signup ------------------
  const signup = async (name, email, password) => {
    const res = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    const acct = data.user.accounts?.[0] || null;
    setActiveAccount(acct);
    if (acct) localStorage.setItem("activeAccount", JSON.stringify(acct));
  };

  // ------------------ Login ------------------
  const login = async (email, password) => {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    const acct = data.user.accounts?.[0] || null;
    setActiveAccount(acct);
    if (acct) localStorage.setItem("activeAccount", JSON.stringify(acct));
  };

  // ------------------ Logout ------------------
  const logout = () => {
    setUser(null);
    setActiveAccount(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("activeAccount");
  };

  // ------------------ Change Name ------------------
  const changeName = async (name) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch("http://localhost:8000/api/settings/change-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setUser((prev) => ({ ...prev, name: data.name }));
    localStorage.setItem(
      "user",
      JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), name: data.name })
    );

    return data.name;
  };

  // ------------------ Change Password ------------------
  const changePassword = async (oldPassword, newPassword) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch("http://localhost:8000/api/settings/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    return data.message;
  };

  // ------------------ Switch Account ------------------
  const switchAccount = async (accountId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/settings/switch-account/${accountId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to switch account");

    setActiveAccount(data.activeAccount);
    localStorage.setItem("activeAccount", JSON.stringify(data.activeAccount));
    if (data.token) localStorage.setItem("token", data.token);

    return data.activeAccount;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeAccount,
        setActiveAccount,
        signup,
        login,
        logout,
        changeName,
        changePassword,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
