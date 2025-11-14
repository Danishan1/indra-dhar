"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RESOURCE_FIELD_MAP } from "../helper/resourceFieldMap";
import { SelectRemote } from "@/components/ui/jsx/SelectRemote";
import { TextInput, Button, RadioGroup } from "@/components/ui";
import styles from "../css/ResourceBuilder.module.css";
import { CONST } from "@/utils/CONST";

const { FORM_TYPE } = CONST;

/**
 * ResourceInputBuilder
 * Props:
 *  - resourceType (string)         // selected resource_type (like "raw_material")
 *  - endpointForLookup (string)    // backend endpoint for remote select (e.g. /raw-material)
 *  - valueField / labelField       // optional mapping for SelectRemote
 *  - onSubmit(payload)             // called when user submits
 *  - initial (optional)            // initial payload { resource_id, inputs: {...} }
 */
export function ResourceInputBuilder({
  resourceType,
  endpointForLookup,
  valueField = "id",
  labelField = "name",
  onSubmit,
  initial = {},
}) {
  const [resourceId, setResourceId] = useState(initial.resourceId || "");
  const [resourceName, setResourceName] = useState(initial.resourceName || "");
  const [inputs, setInputs] = useState(initial.inputs || {});
  const [errors, setErrors] = useState({});

  // fields to render for this resource type
  const fields = useMemo(
    () => RESOURCE_FIELD_MAP[resourceType] || [],
    [resourceType]
  );

  // helper: set single input value
  const handleInputChange = useCallback((key, value) => {
    setInputs((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined })); // clear error on change
  }, []);

  // render a single field based on its ui type
  const renderField = (field) => {
    const { key, label, ui, props = {}, required } = field;
    const value = inputs[key] ?? "";

    switch (ui) {
      case FORM_TYPE.NUMBER:
        return (
          <TextInput
            key={key}
            label={label}
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(
                key,
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            error={errors[key]}
            {...props}
            required={required}
          />
        );

      case FORM_TYPE.RADIO:
        return (
          <RadioGroup
            key={key}
            label={label}
            name={key}
            options={props.options || []}
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            helperText={props.helperText}
            disabled={props.disabled}
            required={required}
          />
        );

      case FORM_TYPE.TEXT:
        return (
          <TextInput
            key={key}
            label={label}
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            error={errors[key]}
            required={required}
            {...props}
          />
        );

      default:
        return null;
    }
  };

  // Basic validation -- returns true if ok, else false and sets errors state
  const validate = useCallback(() => {
    const nextErrors = {};
    fields.forEach((f) => {
      if (f.required) {
        const v = inputs[f.key];
        const empty = v === undefined || v === null || v === "";
        if (empty) nextErrors[f.key] = `${f.label} is required`;
      }
    });

    // resource id must be present (user must pick a resource row)
    if (!resourceId) nextErrors.resource_id = "Select the resource";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fields, inputs, resourceId]);

  const handleReset = useCallback(() => {
    setResourceId("");
    setResourceName("");
    setInputs({});
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (!validate()) return;
      const payload = {
        resource_type: resourceType,
        data: {
          resource_id: resourceId,
          resource_name: resourceName,
          ...inputs,
        },
      };
      onSubmit?.(payload);
      handleReset();
    },
    [resourceType, resourceId, inputs, onSubmit, validate]
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {/* resource selector (remote-driven) */}
      <div className={styles.row}>
        <SelectRemote
          label="Select Resource"
          endpoint={endpointForLookup}
          value={resourceId}
          onChange={(e) => {
            setResourceId(e.target.value);
            setResourceName(e.target.label);
          }}
          valueField={valueField}
          labelField={labelField}
          placeholder="Choose resource..."
          required
        />
        {!!errors.resource_id && (
          <div className={styles.errorText}>{errors.resource_id}</div>
        )}
      </div>

      {/* dynamic fields */}
      <div className={styles.fields}>
        {fields.length === 0 && (
          <p className={styles.helper}>
            No inputs required for this resource type.
          </p>
        )}
        {fields.map((f) => (
          <div key={f.key} className={styles.fieldItem}>
            {renderField(f)}
          </div>
        ))}
      </div>

      {/* footer actions */}
      <div className={styles.footer}>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>

        <Button type="submit" variant="primary">
          Add Resource
        </Button>
      </div>
    </form>
  );
}
