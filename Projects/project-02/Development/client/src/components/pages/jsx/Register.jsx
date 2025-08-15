import { registerUser } from "../../../api/auth";
import { AuthForm } from "../../auth/jsx/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await registerUser({ ...data, role: "admin" });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthForm
      onSubmit={handleRegister}
      buttonText="Register"
      showTenant={true}
    />
  );
}
