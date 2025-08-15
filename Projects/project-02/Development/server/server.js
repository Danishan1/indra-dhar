import dotenv from "dotenv";
import { createServer } from "http";
import { app } from "./src/app.js";
import { initSockets } from "./src/sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = createServer(app);

// init sockets
initSockets(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API docs available at ${PORT}/docs`);
});
