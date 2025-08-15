import { Server } from "socket.io";

let io;

function initSockets(server) {
  // Socket.IO instance
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Middleware: authenticate sockets with JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { tenantId } = socket.user;
    console.log(`Socket connected: ${socket.id} for tenant ${tenantId}`);

    // Join tenant-specific room
    socket.join(tenantId.toString());

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
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


// --------------

// import { io } from "../server.js";
// import { Phase } from "../models/Phase.js";

// export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tenantId = req.user.tenantId;

//     const updatedItem = await Item.findOneAndUpdate(
//       { _id: id, tenantId },
//       req.body,
//       { new: true }
//     );

//     if (!updatedItem) {
//       return res.status(404).json({ error: "Item not found" });
//     }

//     // Rebuild updated phase summary
//     const phase = await Phase.findById(updatedItem.currentPhaseId).lean();
//     const items = await Item.find({ currentPhaseId: updatedItem.currentPhaseId }).lean();

//     // Send to all sockets in this tenant room
//     io.to(tenantId.toString()).emit("phaseUpdated", {
//       phaseId: phase._id.toString(),
//       phaseName: phase.name,
//       items: items.map(i => ({
//         bulkGroupId: i.bulkGroupId || null,
//         name: i.formData?.name || null,
//         status: i.status,
//         quantity: i.isBulkCountBased ? i.quantity : 1
//       }))
//     });

//     res.json(updatedItem);
//   } catch (err) {
//     console.error("Error updating item", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

