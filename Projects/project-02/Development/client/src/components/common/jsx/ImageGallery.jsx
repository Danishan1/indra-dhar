// components/ImageGallery.js
import React from "react";
import styles from "../css/ImageGallery.module.css"; // see below for CSS
import { baseUrl } from "../../../util/baseUrl";

export default function ImageGallery({ images = [], onDelete }) {
  if (!images.length) return <>No Image to Show</>;

  return (
    <div className={styles.gallery}>
      {images.map((url, index) => (
        <div key={index} className={styles.imageWrapper}>
          <img
            src={`${baseUrl}${url}`}
            alt={`Uploaded ${index}`}
            className={styles.image}
            onClick={() => window.open(`${baseUrl}${url}`, "_blank")}
          />
          {onDelete && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(index)}
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
