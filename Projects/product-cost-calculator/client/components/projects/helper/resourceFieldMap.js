// resourceFieldMap.js
// Central config mapping resource_type -> fields to render.
// Each field: { key, label, ui, props, required, parse }.
// ui: FORM_TYPE.NUMBER | "text" | "textarea" | "select" | "remoteSelect" | "switch" | "radio" | "checkbox"
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";

const { FORM_TYPE } = CONST;

export const RESOURCE_FIELD_MAP = {
  [BASE_PATH.rawMaterial]: [
    {
      key: "quantity",
      label: "Quantity",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "Enter quantity" },
    },
    {
      key: "wastage_percent",
      label: "Wastage (%)",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: { min: 0, max: 100, step: "0.01", placeholder: "e.g. 2.5" },
    },
    {
      key: "scrap_value",
      label: "Scrap Value",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Recovered scrap value (optional)",
      },
    },
  ],

  [BASE_PATH.labors]: [
    {
      key: "hours",
      label: "Hours",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "Total hours worked" },
    },
    {
      key: "overtime_hours",
      label: "Overtime Hours",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: { min: 0, step: "0.01", placeholder: "Overtime hours (optional)" },
    },
  ],

  [BASE_PATH.machines]: [
    {
      key: "hours",
      label: "Hours Used",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "Machine usage hours" },
    },
  ],

  [BASE_PATH.utilities]: [
    {
      key: "units_consumed",
      label: "Units Consumed",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "e.g. kWh or liters" },
    },
  ],

  [BASE_PATH.overheads]: [
    // UI will show either applied_value or percentage_value depending on DB overhead type;
    // frontend still supports both to be flexible.
    {
      key: "applied_value",
      label: "Applied Value (fixed)",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Applied fixed overhead (optional)",
      },
    },
    {
      key: "percentage_value",
      label: "Percentage (%)",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: {
        min: 0,
        max: 100,
        step: "0.01",
        placeholder: "Percentage for overhead",
      },
    },
  ],

  packaging_transport: [
    {
      key: "packaging_cost",
      label: "Packaging Cost",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: { min: 0, step: "0.01", placeholder: "Packaging cost (optional)" },
    },
    {
      key: "transport_cost",
      label: "Transport Cost",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: { min: 0, step: "0.01", placeholder: "Transport cost (optional)" },
    },
  ],

  profit: [
    {
      key: "profit_type",
      label: "Profit Type",
      ui: FORM_TYPE.RADIO,
      required: true,
      props: {
        options: [
          { label: "Percentage", value: "percentage" },
          { label: "Fixed", value: "fixed" },
        ],
      },
    },
    {
      key: "profit_value",
      label: "Profit Value",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "Value or percentage" },
    },
  ],
};
