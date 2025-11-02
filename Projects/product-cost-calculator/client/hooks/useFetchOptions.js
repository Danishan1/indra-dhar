"use client";

import { useState, useEffect } from "react";
import { apiUtil } from "@/utils/api";

export function useFetchOptions({ endpoint, value = "id", label = "name" }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiUtil.get(endpoint);

        if (res.success) {
          const data = res.data;
          setOptions(data.map((r) => ({ value: r[value], label: r[label] })));
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    }

    fetchData();
  }, []);

  return options;
}
