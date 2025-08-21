import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../../auth/jsx/AuthForm";
import { loginUser } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate("/"); // only navigate once after loading
  //   }
  // }, [user, loading]);

  const handleLogin = async (data) => {
    try {
      const res = await loginUser(data);
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === "po") navigate("/po");
      else navigate("/user");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  if (loading) return null; // or spinner

  return (
    <AuthForm onSubmit={handleLogin} buttonText="Login" showTenant={true} />
  );
}
