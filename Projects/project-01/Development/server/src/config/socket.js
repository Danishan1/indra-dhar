import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);
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

export { io };
