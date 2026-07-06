"use client";

import { DashboardLayout } from "@/components/common";
import { ProfileAPI } from "@/service";

export default function DashboardPage() {
  const res = ProfileAPI.useMe();

  console.log("DDDD: ", res)

  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
      <p>Welcome to your cost calculator dashboard!</p>
    </DashboardLayout>
  );
}
