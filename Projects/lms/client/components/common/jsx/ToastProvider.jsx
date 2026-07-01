"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";
import styles from "../css/Toast.module.css";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      duration
    );
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            <span>{t.message}</span>
            <X
              size={16}
              className={styles.closeIcon}
              onClick={() => removeToast(t.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/*

import { useToast } from "@/components/common/Toast/ToastProvider";

export default function CreateVendor() {
  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      // API call
      addToast("success", "Vendor created successfully!");
    } catch (error) {
      addToast("error", "Failed to create vendor");
    }
  };

  return <button onClick={handleSubmit}>Create</button>;
}



*/
