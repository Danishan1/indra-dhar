import React from "react";
import styles from "../css/FilterOverlay.module.css";
import { Button, SelectInput, TextInput } from "..";

export const FilterOverlay = ({
  filtersConfig = [],
  values,
  onChange,
  onApply,
  onClose,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h3 className={styles.title}>Filters</h3>

        {filtersConfig.map((filter) => (
          <div key={filter.key} className={styles.filterGroup}>
            {filter.type === "select" ? (
              <SelectInput
                label={filter.label}
                value={values[filter.key] || ""}
                options={filter.options || []}
                placeholder={`Select ${filter.label}`}
                onChange={(e) => onChange(filter.key, e.target.value)}
              />
            ) : (
              <TextInput
                label={filter.label}
                type={filter.type || "text"}
                placeholder={`Enter ${filter.label}`}
                value={values[filter.key] || ""}
                onChange={(e) => onChange(filter.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
