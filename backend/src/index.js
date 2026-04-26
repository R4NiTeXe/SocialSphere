import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  });
});
