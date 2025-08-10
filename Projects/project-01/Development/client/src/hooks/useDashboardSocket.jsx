import { useEffect } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../util/baseUrl";

export function useDashboardSocket(token, onDataUpdate) {
  useEffect(() => {
    if (!token) return;

    const socket = io(baseUrl, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to dashboard socket");
    });

    socket.on("dashboardUpdate", (updatedPhase) => {
      onDataUpdate(updatedPhase);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, [token, onDataUpdate]);
}
