import dotenv from "dotenv";
import { createServer } from "http";
import { app } from "./src/app.js";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
  },
});

// Emit events when phases are updated
export const emitPhaseUpdate = (tenantId) => {
  // Emit an event to all connected clients for this tenant

  io.emit("phaseUpdated", { tenantId });
};

// Listen for connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API docs available at ${PORT}/docs`);
});
