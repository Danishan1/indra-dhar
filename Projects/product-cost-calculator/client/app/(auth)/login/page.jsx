"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { FormComponent } from "@/components/forms";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) router.push("/dashboard");
      else setError(res.message);
    } catch (err) {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <FormComponent
        title="Welcome Back"
        description="Sign in to your account"
        onSubmit={handleSubmit}
        onCancel={() => {
          router.push("/register");
        }} // move to "/"  (home page) when cancel is clicked
        loading={loading}
        error={error}
        success=""
        submitlabel="Login"
        cancelLabel="Register"
      >
        {/* {error && <Alert type="error" message={error} />} */}
        <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormComponent>
    </div>
  );
}
