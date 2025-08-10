import { Server } from "socket.io";

let io;

function initSockets(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    // join room: tenant-<tenantId>-phase-<phaseId>
    socket.on("join", ({ tenantId, phaseId }) => {
      if (tenantId) socket.join(`tenant-${tenantId}`);
      if (phaseId) socket.join(`tenant-${tenantId}-phase-${phaseId}`);
    });

    socket.on("leave", ({ tenantId, phaseId }) => {
      if (tenantId) socket.leave(`tenant-${tenantId}`);
      if (phaseId) socket.leave(`tenant-${tenantId}-phase-${phaseId}`);
    });

    socket.on("disconnect", () => {
      // cleanup
    });
  });
}

function emitToPhase(tenantId, phaseId, event, payload) {
  if (!io) return;
  io.to(`tenant-${tenantId}-phase-${phaseId}`).emit(event, payload);
}

function emitToTenant(tenantId, event, payload) {
  if (!io) return;
  io.to(`tenant-${tenantId}`).emit(event, payload);
}

export { initSockets, emitToPhase, emitToTenant };
