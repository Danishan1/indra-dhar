"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, EmailInput, FormWrapper } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { useToast } from "@/components/common";
import { BASE_PATH } from "@/utils/basePath";

export default function CreateVendorPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fields = [
    <TextInput
      key="name"
      label="Vendor Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />,
    <TextInput
      key="contact_name"
      label="Contact Name"
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
    />,
    <EmailInput
      key="email"
      label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />,
    <TextInput
      key="phone"
      label="Phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required
    />,
    <TextInput
      key="address"
      label="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />,
  ];
  const handleSubmit = async () => {
    const payload = { name, contact_name: contactName, email, phone, address };

    try {
      const res = await apiUtil.post("/vendors", payload);
      if (res.success) {
        router.push(BASE_PATH.vendors);
        addToast("success", res.message || "Vendor created successfully!");
      } else
        addToast(
          "error",
          res?.data?.message || res.message || "Vendor creation failed"
        );
    } catch (err) {
      console.error("Error: ", err);
      addToast(
        "error",
        err.response?.data?.message || err.message || "Vendor creation failed"
      );
    }
  };

  return (
    <FormWrapper
      title="Create Vendor"
      subtitle="Add a new vendor to your system"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => router.push(BASE_PATH.vendors)}
      submitLabel="Create"
      cancelLabel="Cancel"
    />
  );
}
