import { useState } from "react";
import styles from "../css/GenericForm.module.css";
import Input from "./Input";
import Button from "./Button";
import Dropdown from "./Dropdown";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { ImageInput } from "./ImageInput";

export default function GenericForm({
  config,
  onSubmit,
  submitLabel = "Submit",
  disabled= false,
}) {
  const initialState = {};
  config.fields.forEach((f) => {
    if (f.type === "multi-dropdown") {
      initialState[f.name] = f.defaultValue || [];
    } else {
      initialState[f.name] = f.defaultValue || "";
    }
  });

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) })); // Store single file
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{config.title}</h2>

      {config.fields.map((field) => {
        if (field.type === "dropdown") {
          return (
            <Dropdown
              key={field.name}
              label={field.label}
              items={field.options}
              selected={formData[field.name]}
              onSelect={(value) => handleDropdownChange(field.name, value)}
              error={errors[field.name]}
            />
          );
        }

        if (field.type === "multi-dropdown") {
          return (
            <MultiSelectDropdown
              key={field.name}
              label={field.label}
              items={field.options}
              selectedValues={formData[field.name]}
              onChange={(values) => handleDropdownChange(field.name, values)}
              error={errors[field.name]}
            />
          );
        }

        if (field.type === "image") {
          return (
            <ImageInput
              key={field.name}
              label={field.label}
              name={field.name}
              onChange={handleChange}
              error={errors[field.name]}
            />
          );
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            error={errors[field.name]}
          />
        );
      })}

      <Button type="submit" variant={config.submitVariant || "primary"} disabled={disabled}>
        {submitLabel}
      </Button>
    </form>
  );
}

/*

const formConfig = {
  title: "Create User",
  submitVariant: "primary",
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role",
      label: "Role",
      type: "dropdown",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      name: "phases",
      label: "Phases",
      type: "multi-dropdown",
      options: [
        { label: "Phase 1", value: "p1" },
        { label: "Phase 2", value: "p2" },
      ],
    },
  ],
};


const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Create New User",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
      },
      {
        name: "role",
        label: "Role",
        type: "dropdown",
        required: true,
        options: [
          { label: "Admin", value: "admin" },
          { label: "Phase Head", value: "phase_head" },
          { label: "Operator", value: "operator" },
        ],
      },
      {
        name: "phases",
        label: "Phases",
        type: "dropdown",
        options: [], // will populate dynamically
      },
    ],
  });


  return (
      <GenericForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitLabel="Create User"
      />
    );


*/
