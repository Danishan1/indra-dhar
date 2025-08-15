import { useState } from "react";
import Dropdown from "./Dropdown";
import styles from "../css/MultiSelectDropdown.module.css";

export default function MultiSelectDropdown({
  label,
  items = [],
  selectedValues = [],
  onChange,
}) {
  const [selected, setSelected] = useState(selectedValues);

  const handleSelect = (item) => {
    if (!selected.find((s) => s.value === item.value)) {
      const updated = [...selected, item];
      setSelected(updated);
      onChange(updated);
    }
  };

  const handleRemove = (value) => {
    const updated = selected.filter((s) => s.value !== value);
    setSelected(updated);
    onChange(updated);
  };

  const availableItems = items.filter(
    (item) => !selected.some((sel) => sel.value === item.value)
  );

  return (
    <div className={styles.multiSelect}>
      {label && <label className={styles.label}>{label}</label>}

      <Dropdown
        items={availableItems}
        selected={null}
        onSelect={handleSelect}
        placeholder="Select..."
      />

      {selected.length > 0 && (
        <div className={styles.selectedList}>
          {selected.map((item) => (
            <div key={item.value} className={styles.tag}>
              {item.label}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(item.value)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
