import { Server } from "socket.io";

let io;
const userSocketMap = {}; // { userId: socketId }

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log(`User connected: ${userId} (Socket: ${socket.id})`);
    }

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`User disconnected: ${userId}`);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const emitToUser = (userId, event, data) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};
