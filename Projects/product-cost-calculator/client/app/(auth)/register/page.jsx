"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import { AuthLayout } from "@/components/common";
import { Button, EmailInput, PasswordInput, TextInput } from "@/components/ui";
import { FormComponent } from "@/components/forms";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.success) router.push("/dashboard");
      else setError(res.message);
    } catch (err) {
      setError("Something went wrong");
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
        title="Create Account"
        subtitle="Join our production cost system"
        onSubmit={handleSubmit}
        onCancel={() => {
          router.push("/login");
        }} // move to "/"  (home page) when cancel is clicked
        loading={loading}
        error={error}
        success=""
        submitlabel="Register"
        cancelLabel="Login"
      >
        {/* {error && <Alert type="error" message={error} />} */}
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <EmailInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TextInput
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </FormComponent>
    </div>
  );
}
