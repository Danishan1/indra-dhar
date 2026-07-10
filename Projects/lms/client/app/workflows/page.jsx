"use client";

import { useEffect, useState } from "react";

import WorkflowList from "@/components/workflows/WorkflowList";
import WorkflowInstallModal from "@/components/workflows/WorkflowInstallModal";
import WorkflowConfigModal from "@/components/workflows/WorkflowConfigModal";
import ExecutionTable from "@/components/workflows/ExecutionTable";

import styles from "./Workflow.module.css";
import { Button } from "@/components/ui";
import { WorkflowAPI } from "@/service";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstall, setShowInstall] = useState(false);
  const [configWorkflow, setConfigWorkflow] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [workflowResponse, catalogResponse, executionResponse] =
        await Promise.all([
          WorkflowAPI.list(),
          WorkflowAPI.catalog(),
          WorkflowAPI.executions({
            limit: 10,
          }),
        ]);

      setWorkflows(workflowResponse.data || []);
      setCatalog(catalogResponse.data || []);
      setExecutions(executionResponse.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const installWorkflow = async (key) => {
    await WorkflowAPI.install(key, {
      config: {},
    });

    setShowInstall(false);
    loadData();
  };

  const saveConfiguration = async (config, is_active) => {
    await WorkflowAPI.update(configWorkflow.key, {
      config,
      is_active: is_active,
    });

    setConfigWorkflow(null);
    loadData();
  };

  const handleDelete = async (key) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Automation? This action cannot be undone.",
    );

    if (!confirmed) return;

    await WorkflowAPI.remove(key);

    setConfigWorkflow(null);
    loadData();
  };

  if (loading) return <div className="container">Loading workflows...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Workflow Management</h1>

          <p className={styles.subtitle}>
            Manage tenant automation workflows, configurations and executions.
          </p>
        </div>

        <Button onClick={() => setShowInstall(true)}>Install Workflow</Button>
      </div>

      <section>
        <h2>Installed Workflows</h2>

        <WorkflowList
          workflows={workflows}
          onConfigure={(workflow) => setConfigWorkflow(workflow)}
          onRefresh={loadData}
        />
      </section>

      <section
        style={{
          marginTop: "40px",
        }}
      >
        <h2>Recent Executions</h2>

        <ExecutionTable executions={executions} />
      </section>

      {showInstall && (
        <WorkflowInstallModal
          workflows={catalog}
          onInstall={installWorkflow}
          onClose={() => setShowInstall(false)}
        />
      )}

      {configWorkflow && (
        <WorkflowConfigModal
          workflow={configWorkflow}
          onSave={saveConfiguration}
          onClose={() => setConfigWorkflow(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
