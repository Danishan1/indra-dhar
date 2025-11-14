"use client";
import React from "react";
import { SelectInput } from "./SelectInput";
import { useDropdown } from "@/hooks/useDropdown";

export function SelectRemote({
  label,
  endpoint,
  value,
  onChange,
  placeholder = "Select option",
  params = {},
  transform = null,

  // NEW: Backend field names
  valueField = "id",
  labelField = "name",

  required = false,
  disabled = false,
}) {
  const { options, loading, error } = useDropdown({
    endpoint,
    params,
    valueField,
    labelField,
    transform,
  });

  return (
    <SelectInput
      label={label}
      value={value}
      onChange={onChange}
      options={loading ? [] : options}
      placeholder={loading ? "Loading..." : placeholder}
      error={error}
      required={required}
      disabled={disabled || loading}
    />
  );
}
