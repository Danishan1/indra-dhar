"use client";

import React from "react";
import styles from "../css/Modal.module.css";

export function Modal({ title, children, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className={styles.modalCloseBtn} onClick={onClose}>
          &times;
        </button>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
