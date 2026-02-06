"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  const typeOptions = [
    { value: "fixed", label: "Fixed" },
    // { value: "percentage", label: "Percentage" },
  ];
  const freOptions = [
    { value: "Monthly", label: "Monthly" },
    // { value: "Yearly", label: "Yearly" },
    // { value: "Per Hour", label: "Per Hour" },
    // { value: "Unit Produced", label: "Unit Produced" },
    // { value: "% of Direct Cost", label: "% of Direct Cost" },
    // { value: "per_batch", label: "Per Batch" },
  ];

  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.indirectExpense}
      basePath={BASE_PATH.indirectExpense}
      title="Indirect Expense"
      fields={[
        {
          key: "name",
          label: "Indirect Expense Name",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "type",
          label: "Type",
          type: FORM_TYPE.RADIO,
          options: typeOptions,
          required: true,
        },
        {
          key: "frequency",
          label: "Allocation Bases",
          type: FORM_TYPE.SELECT,
          required: true,
          options: freOptions,
        },
        { key: "value", label: "Amount", type: FORM_TYPE.TEXT, required: true },
        // { key: "is_global", label: "Is Global", type: FORM_TYPE.SWITCH },
      ]}
    />
  );
}
