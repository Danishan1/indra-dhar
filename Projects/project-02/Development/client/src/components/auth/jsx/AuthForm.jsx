import { useState } from "react";
import styles from "../css/AuthForm.module.css";
import Input from "../../common/jsx/Input";

export function AuthForm({ onSubmit, buttonText }) {
  const isRegister = buttonText === "Register";

  const [formData, setFormData] = useState({
    tenantName: "",
    name: "",
    email: "",
    password: "",
    ...(isRegister ? { role: "admin" } : {}),
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.tenantName.trim())
      newErrors.tenantName = "Tenant name is required";
    if (isRegister && !formData.name.trim())
      newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Tenant Name"
        name="tenantName"
        value={formData.tenantName}
        onChange={handleChange}
        error={errors.tenantName}
      />
      {isRegister && (
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
      )}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <button type="submit" className={styles.submitBtn}>
        {buttonText}
      </button>
    </form>
  );
}
