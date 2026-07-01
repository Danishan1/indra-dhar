import { apiUtil } from "@/utils/api";
import { useEffect, useState } from "react";

export const useAPICaller = (baseURL) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!baseURL) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiUtil.get(baseURL);
        if (isMounted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [baseURL]);

  return { data, loading, error };
};
