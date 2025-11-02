"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiUtil } from "@/utils/api";
import { useToast } from "@/components/common";

// import all field components
import {
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  SelectInput,
  SwitchInput,
  CheckboxGroup,
  RadioGroup,
  RangeInput,
  FileInput,
  Textarea,
  FormWrapper,
} from "@/components/ui";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export function CrudFormPage({
  mode = "create", // "create" | "update"
  endpoint,
  basePath,
  title,
  fields = [],
}) {
  const router = useRouter();
  const { idSelected } = useParams();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(mode === "update");
  const [submitting, setSubmitting] = useState(false);

  // Fetch record data when updating
  useEffect(() => {
    if (mode !== "update") return;
    async function fetchData() {
      try {
        const res = await apiUtil.get(`${endpoint}/${idSelected}`);
        if (res.success) setFormData(res.data);
        else addToast("error", res.message || `Failed to load ${title}`);
      } catch (err) {
        console.error(err);
        addToast("error", `Error loading ${title}`);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mode, endpoint, idSelected]);

  // update state
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // render dynamic input
  const renderField = (field) => {
    const { key, label, type = "text", required, ...rest } = field;
    const value = formData[key] ?? "";

    const props = {
      label,
      value,
      required,
      onChange: (eOrValue) => {
        const val =
          eOrValue?.target?.value !== undefined
            ? eOrValue.target.value
            : eOrValue;
        handleChange(key, val);
      },
      ...rest,
    };

    switch (type) {
      case FORM_TYPE.EMAIL:
        return <EmailInput key={key} {...props} />;
      case FORM_TYPE.PASSWORD:
        return <PasswordInput key={key} {...props} />;
      case FORM_TYPE.NUMBER:
        return <NumberInput key={key} {...props} />;
      case FORM_TYPE.SELECT:
        return <SelectInput key={key} {...props} />;
      case FORM_TYPE.SWITCH:
        return <SwitchInput key={key} {...props} />;
      case FORM_TYPE.CHECKBOX:
        return <CheckboxGroup key={key} {...props} />;
      case FORM_TYPE.RADIO:
        return <RadioGroup key={key} {...props} />;
      case FORM_TYPE.RANGE:
        return <RangeInput key={key} {...props} />;
      case FORM_TYPE.FILE:
        return <FileInput key={key} {...props} />;
      case FORM_TYPE.TEXTAREA:
        return <Textarea key={key} {...props} />;
      default:
        return <TextInput key={key} {...props} />;
    }
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData };
      const res =
        mode === "create"
          ? await apiUtil.post(endpoint, payload)
          : await apiUtil.put(`${endpoint}/${idSelected}`, payload);

      if (res.success) {
        addToast("success", res.message || `${title} saved successfully`);
        router.push(basePath);
      } else {
        addToast("error", res.message || `${title} save failed`);
      }
    } catch (err) {
      console.error(err);
      addToast("error", err.message || `${title} operation failed`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <FormWrapper
      title={`${mode === "create" ? "Create" : "Update"} ${title}`}
      subtitle={`${
        mode === "create"
          ? `Add a new ${title.toLowerCase()}`
          : `Modify existing ${title.toLowerCase()}`
      }`}
      fields={fields.map(renderField)}
      onSubmit={handleSubmit}
      onCancel={() => router.push(basePath)}
      submitLabel={mode === "create" ? "Create" : "Update"}
      cancelLabel="Cancel"
    />
  );
}
