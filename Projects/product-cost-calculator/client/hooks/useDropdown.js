"use client";
import { apiUtil } from "@/utils/api";
import { useEffect, useState } from "react";

export function useDropdown({
  endpoint,
  params = {},
  valueField = "id",
  labelField = "name",
  transform = null,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);
        const result = await apiUtil.get(endpoint, params);

        console.log("Dropdown fetch result:", result);
        if (result.success === false) {
          setError("Failed to load options");
          setOptions([]);
          setLoading(false);
          return;
        }

        const data = result.data || result; // handle different response structures

        let formatted = [];

        if (transform) {
          // custom transform provided
          formatted = transform(data);
        } else {
          // generic transform using selected value/label fields
          formatted = data.map((item) => ({
            value: item[valueField],
            label: item[labelField],
            raw: item, // sometimes useful to keep all data
          }));
        }

        setOptions(formatted);
      } catch (err) {
        setError("Failed to load options");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
  }, [endpoint, valueField, labelField]);

  return { options, loading, error };
}
