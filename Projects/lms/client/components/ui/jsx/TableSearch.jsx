import React from "react";
import { TextInput } from "..";

export const TableSearch = ({ value, onChange }) => (
  <TextInput
    placeholder="Search..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);
