import { BASE_PATH } from "@/utils/basePath";

export const getUploadInfo = (selectedType) => {

  const info = {
    [`${BASE_PATH.labors}/bulk`]: {
      key: "labors",
      fields: [
        {
          key: "name",
          purpose: "Name of the labor resource",
          acceptedValues: "Text (required)",
        },
        {
          key: "labor_type",
          purpose: "Type of labor cost calculation",
          acceptedValues: ["Per Hour", "Per Process", "Salary"],
        },
        {
          key: "rate_per_hour",
          purpose: "Base labor rate (used for all labor types)",
          acceptedValues: "Decimal number (>= 0)",
        },
        {
          key: "overtime_rate",
          purpose: "Overtime hourly rate",
          acceptedValues: "Decimal number (>= 0, optional)",
        },
        {
          key: "remark",
          purpose: "Additional notes or description",
          acceptedValues: "Text (optional)",
        },
      ],
    },

    [`${BASE_PATH.overheads}/bulk`]: {
      key: "overheads",
      fields: [
        {
          key: "name",
          purpose: "Overhead name",
          acceptedValues: "Text (required)",
        },
        {
          key: "type",
          purpose: "Overhead calculation type",
          acceptedValues: ["fixed", "percentage"],
        },
        {
          key: "value",
          purpose: "Overhead value (amount or percentage)",
          acceptedValues: "Decimal number (> 0)",
        },
        {
          key: "frequency",
          purpose: "Allocation Bases",
          acceptedValues: [
            "Machine Hour",
            "Labor Hour",
            "Unit Produced",
            "% of Direct Cost",
          ],
        },
      ],
    },

    [`${BASE_PATH.bomItem}/bulk`]: {
      key: "bom_items",
      fields: [
        {
          key: "material_id",
          purpose: "Referenced raw material ID",
          acceptedValues: "Valid Raw Material ID (number)",
        },
        {
          key: "bom_meta_id",
          purpose: "Referenced BOM meta ID",
          acceptedValues: "Valid BOM Meta ID (number)",
        },
        {
          key: "quantity",
          purpose: "Quantity of material used",
          acceptedValues: "Number (decimal allowed based on material)",
        },
        {
          key: "decimal_allowed",
          purpose: "Whether decimal quantity is allowed",
          acceptedValues: [true, false],
        },
      ],
    },

    [`${BASE_PATH.unit}/bulk`]: {
      key: "units",
      fields: [
        {
          key: "name",
          purpose: "Unit name",
          acceptedValues: "Text (unique, required)",
        },
        {
          key: "unit_code",
          purpose: "Short unit code",
          acceptedValues: "Text (e.g., KG, L, PCS)",
        },
        {
          key: "base_unit",
          purpose: "Base unit reference",
          acceptedValues: "Text (e.g., KG, L)",
        },
        {
          key: "decimal_allowed",
          purpose: "Whether unit supports decimal values",
          acceptedValues: [true, false],
        },
      ],
    },

    [`${BASE_PATH.rawMaterial}/bulk`]: {
      key: "raw_materials",
      fields: [
        {
          key: "name",
          purpose: "Raw material name",
          acceptedValues: "Text (required)",
        },
        {
          key: "unit_type_id",
          purpose: "Measurement unit reference",
          acceptedValues: "Valid Unit ID (number)",
        },
        {
          key: "unit_price",
          purpose: "Price per unit",
          acceptedValues: "Decimal number (> 0)",
        },
        {
          key: "is_gst_itc",
          purpose: "Eligible for GST ITC",
          acceptedValues: [true, false],
        },
        {
          key: "gst",
          purpose: "GST percentage",
          acceptedValues: "Decimal (0–100)",
        },
      ],
    },

    [`${BASE_PATH.users}/bulk`]: {
      key: "users",
      fields: [
        {
          key: "name",
          purpose: "User full name",
          acceptedValues: "Text (required)",
        },
        {
          key: "email",
          purpose: "User email address",
          acceptedValues: "Valid email format (unique)",
        },
        {
          key: "password",
          purpose: "User password (bulk upload only)",
          acceptedValues: "Text (min security rules apply)",
        },
        {
          key: "repassword",
          purpose: "User password (bulk upload only)",
          acceptedValues: "Text (min security rules apply)",
        },
        {
          key: "role",
          purpose: "User role",
          acceptedValues: ["admin", "manager", "user"],
        },
        {
          key: "status",
          purpose: "User account status",
          acceptedValues: ["active", "inactive"],
        },
      ],
    },
  };

  return info[selectedType?.value] || { key: "", fields: [] };
};
