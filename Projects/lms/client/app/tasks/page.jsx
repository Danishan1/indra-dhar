"use client";

import AssignTaskModal from "@/components/tasks/AssignTaskModal";
import TaskManagement from "@/components/tasks/TaskManagement";

export default function DashboardPage() {
  return <TaskManagement />;
  // return <AssignTaskModal open={true}/>;
}
