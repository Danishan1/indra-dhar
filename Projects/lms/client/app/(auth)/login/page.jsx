"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput, TextInput } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { FormComponent } from "@/components/forms";
import { useToast } from "@/components/common";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password, code);

      if (res.success) router.push("/dashboard");
      // else setError(res.message);
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  if (!loading && user) return <>Loading</>;

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
        title="Welcome Back"
        description="Sign in to your account"
        onSubmit={handleSubmit}
        // onCancel={() => {
        //   router.push("/register");
        // }} // move to "/"  (home page) when cancel is clicked
        loading={loading}
        error={error}
        success=""
        submitLabel="Login"
        // cancelLabel="Register"
      >
        {/* {error && addToast("error", error)} */}
        <TextInput
          label="Organization Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <TextInput
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
      </FormComponent>
    </div>
  );
}
