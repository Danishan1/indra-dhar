"use client";

import React, { useEffect, useState } from "react";
import styles from "./integrations.module.css";

import { apiUtil } from "@/utils/api";

import { IntegrationSection } from "@/components/integration/IntegrationSection";
import {
  INTEGRATION_FIELDS,
  mergeIntegrations,
} from "@/components/integration/integration.helper";

import { FormComponent } from "@/components/forms";
import { TextInput } from "@/components/ui";

export default function IntegrationsPage() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await apiUtil.get("/integrations");

    setList(mergeIntegrations(res.data || []));
  };

  const grouped = (category) =>
    list.filter((integration) => integration.category === category);

  const openModal = (integration) => {
    setSelected(integration);
    setForm(integration.config || {});
  };

  const closeModal = () => {
    if (loading) return;

    setSelected(null);
    setForm({});
  };

  const handleSubmit = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      if (selected.isConfigured) {
        // Create new integration
        await apiUtil.post("/integrations", {
          name: selected.name,
          type: selected.type,
          category: selected.category,
          provider: selected.provider,
          config: form,
        });
      } else {
        // Update existing integration
        await apiUtil.patch(`/integrations/${selected.id}`, {
          config: form,
          status: "CONNECTED",
        });
      }

      closeModal();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (integration) => {
    await apiUtil.patch(`/integrations/${integration.id}`, {
      status: "DISCONNECTED",
    });

    await load();
  };

  return (
    <div className={styles.page}>
      <h1>Integrations</h1>

      <IntegrationSection
        title="Data Integrations"
        integrations={grouped("INBOUND")}
        onConnect={openModal}
        onEdit={openModal}
        onDisconnect={handleDisconnect}
      />

      <IntegrationSection
        title="Notification Integrations"
        integrations={grouped("OUTBOUND")}
        onConnect={openModal}
        onEdit={openModal}
        onDisconnect={handleDisconnect}
      />

      {selected && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <FormComponent
              title={`Configure ${selected.name}`}
              description={`Configure your ${selected.name} integration.`}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              loading={loading}
              submitLabel={selected.default ? "Connect" : "Update"}
            >
              {(INTEGRATION_FIELDS[selected.type] || []).map((field) => (
                <TextInput
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={form[field.name] ?? ""}
                  required={field.required}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                />
              ))}
            </FormComponent>
          </div>
        </div>
      )}
    </div>
  );
}
