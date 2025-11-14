"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import {
  Button,
  EmailInput,
  PasswordInput,
  SelectInput,
  TextInput,
} from "@/components/ui";
import { FormComponent } from "@/components/forms";
import { useToast } from "@/components/common";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

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
      const res = await register(name, email, password, confirmPassword, role);
      if (res.success) router.push("/dashboard");
      else setError(res.message);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message || error.message || "Something went wrong"
      );
    }
    setLoading(false);
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        padding: "20px",
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
        submitLabel="Register"
        cancelLabel="Login"
      >
        {/* {error && addToast("error", error)} */}
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <EmailInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <SelectInput
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </FormComponent>
    </div>
  );
}
