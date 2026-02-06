// resourceFieldMap.js
// Central config mapping resource_type -> fields to render.
// Each field: { key, label, ui, props, required, parse }.
// ui: FORM_TYPE.NUMBER | "text" | "textarea" | "select" | "remoteSelect" | "switch" | "radio" | "checkbox"
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
import { getTotalIndirectCost } from "./getTotalIndirectCost";

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
      required: true,
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
      label: "Effort (per product)",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Total time to complete (Hours/Peice)",
      },
    },
    {
      key: "overtime_hours",
      label: "Overtime Effort (per product)",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Over time to complete (Hours/Peice/Days)",
      },
    },
  ],

  // [BASE_PATH.machines]: [
  //   {
  //     key: "hours",
  //     label: "Hours Used",
  //     ui: FORM_TYPE.NUMBER,
  //     required: true,
  //     props: { min: 0, step: "0.01", placeholder: "Machine usage hours" },
  //   },
  // ],

  // [BASE_PATH.utilities]: [
  //   {
  //     key: "units_consumed",
  //     label: "Units Consumed",
  //     ui: FORM_TYPE.NUMBER,
  //     required: true,
  //     props: { min: 0, step: "0.01", placeholder: "e.g. kWh or liters" },
  //   },
  // ],

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
    {
      key: "expected_duration",
      label: "Expacted Duration (Months)",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: {
        min: 0,
        max: 100,
        step: "0.01",
        placeholder: "Expacted Duration in Months (eg. 5, 0.003, ect)",
      },
    },
  ],
  [BASE_PATH.indirectExpense]: [
    // UI will show either applied_value or percentage_value depending on DB indirect expense type;
    // frontend still supports both to be flexible.
    {
      key: "total_cost",
      label: "Total Indirect Cost (Monthly)",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Total indirect expense (monthly)",
        disabled: true,
        value: await getTotalIndirectCost(),
      },
    },
    {
      key: "applied_value",
      label: "Applied Value (fixed)",
      ui: FORM_TYPE.NUMBER,
      required: false,
      props: {
        min: 0,
        step: "0.01",
        placeholder: "Applied fixed indirect expense (optional)",
      },
    },
    // {
    //   key: "percentage_value",
    //   label: "Percentage (%)",
    //   ui: FORM_TYPE.NUMBER,
    //   required: false,
    //   props: {
    //     min: 0,
    //     max: 100,
    //     step: "0.01",
    //     placeholder: "Percentage for indirect expense",
    //   },
    // },
    {
      key: "expected_duration",
      label: "Expacted Duration (Months)",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: {
        min: 0,
        max: 100,
        step: "0.01",
        placeholder: "Expacted Duration in Months (eg. 5, 0.003, ect)",
      },
    },
  ],

  packaging_transport: [
    {
      key: "packaging_cost",
      label: "Packaging Cost",
      ui: FORM_TYPE.NUMBER,
      required: true,
      props: { min: 0, step: "0.01", placeholder: "Packaging cost (optional)" },
    },
    {
      key: "transport_cost",
      label: "Transport Cost",
      ui: FORM_TYPE.NUMBER,
      required: true,
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
