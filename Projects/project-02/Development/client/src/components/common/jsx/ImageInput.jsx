// components/ImageInput.jsx
import { useState } from "react";
import styles from "../css/ImageInput.module.css";

export function ImageInput({ label, name, onChange, error }) {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newImages = selectedFiles.slice(0, 5 - images.length); // enforce max 5
    const allImages = [...images, ...newImages].slice(0, 5); // limit total

    setImages(allImages);

    // Trigger onChange with image files
    const dataTransfer = new DataTransfer();
    allImages.forEach((file) => dataTransfer.items.add(file));
    const fakeEvent = {
      target: {
        name,
        type: "file",
        files: dataTransfer.files,
      },
    };
    onChange(fakeEvent);
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);

    const dataTransfer = new DataTransfer();
    updatedImages.forEach((file) => dataTransfer.items.add(file));
    const fakeEvent = {
      target: {
        name,
        type: "file",
        files: dataTransfer.files,
      },
    };
    onChange(fakeEvent);
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className={styles.input}
      />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.previewContainer}>
        {images.map((image, index) => (
          <div className={styles.previewBox} key={index}>
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className={styles.previewImage}
              onClick={() => window.open(URL.createObjectURL(image), "_blank")}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeImage(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
