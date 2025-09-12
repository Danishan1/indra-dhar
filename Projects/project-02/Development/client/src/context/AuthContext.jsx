import { createContext, useContext, useState, useEffect } from "react";

const NEXT_BASE_URL = import.meta.env.VITE_APP_NEXT_BASE_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null });
  const [loading, setLoading] = useState(true);

  // Check session from Next.js API
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${NEXT_BASE_URL}/api/auth/session`, {
          credentials: "include",
        });

        if (res.status === 401) {
          // Not logged in, redirect to Next login

          const redirectUrl = encodeURIComponent(window.location.href);
          window.location.href = `${NEXT_BASE_URL}/login?redirect=${redirectUrl}`;
        } else {
          const data = await res.json();

          console.log("DDDD Auth Data: ", data);

          setAuth({
            user: { ...data.user, role: data.user.role.name },
          });
        }
      } catch (err) {
        const redirectUrl = encodeURIComponent(window.location.href);
        window.location.href = `${NEXT_BASE_URL}/login?redirect=${redirectUrl}`;
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${NEXT_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAuth({ user: null });
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `${NEXT_BASE_URL}/login?redirect=${redirectUrl}`;
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// import { createContext, useContext, useState, useEffect } from "react";
// import { verifyToken } from "../api/auth";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [auth, setAuth] = useState({ user: null, token: null });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       const saved = localStorage.getItem("auth");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         setAuth(parsed);

//         try {
//           await verifyToken();
//         } catch (err) {
//           console.warn("Token invalid, logging out");
//           logout();
//           window.location.href = "/login";
//         }
//       }
//       setLoading(false);
//     };

//     verifyAuth();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const login = (user, token) => {
//     const newAuth = { user, token };
//     setAuth(newAuth);
//     localStorage.setItem("auth", JSON.stringify(newAuth));
//   };

//   const logout = () => {
//     setAuth({ user: null, token: null });
//     localStorage.removeItem("auth");
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
