const socketIO = require('socket.io');

let io;
const activeRooms = new Map(); // roomId -> { doctorId, patientId, startTime }
const userSockets = new Map(); // userId -> socketId

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // User joins with their ID
    socket.on('user:join', ({ userId, userName, role }) => {
      userSockets.set(userId, socket.id);
      socket.userId = userId;
      socket.userName = userName;
      socket.userRole = role;
      console.log(`${userName} (${role}) joined with socket ${socket.id}`);
    });

    // Join video room
    socket.on('room:join', ({ roomId, userId, userName, role }) => {
      socket.join(roomId);

      // Track active room
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          participants: [],
          startTime: new Date(),
          messages: [],
        });
      }

      const room = activeRooms.get(roomId);
      room.participants.push({ userId, userName, role, socketId: socket.id });

      // Notify others in the room
      socket.to(roomId).emit('user:joined', {
        userId,
        userName,
        role,
        socketId: socket.id,
      });

      // Send current room state to the new user
      socket.emit('room:state', {
        participants: room.participants.filter(p => p.socketId !== socket.id),
        messages: room.messages,
      });

      console.log(`${userName} joined room ${roomId}`);
    });

    // WebRTC signaling
    socket.on('call:initiate', ({ to, signal, from }) => {
      io.to(to).emit('call:incoming', { signal, from });
    });

    socket.on('call:accept', ({ to, signal }) => {
      io.to(to).emit('call:accepted', { signal });
    });

    // Chat messages
    socket.on('chat:message', ({ roomId, message, userName, timestamp }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const chatMessage = { userName, message, timestamp };
        room.messages.push(chatMessage);
        io.to(roomId).emit('chat:message', chatMessage);
      }
    });

    // Screen sharing
    socket.on('screen:start', ({ roomId, userName }) => {
      socket.to(roomId).emit('screen:started', { userName, socketId: socket.id });
    });

    socket.on('screen:stop', ({ roomId }) => {
      socket.to(roomId).emit('screen:stopped', { socketId: socket.id });
    });

    // Call controls
    socket.on('call:mute', ({ roomId, isMuted }) => {
      socket.to(roomId).emit('user:muted', { socketId: socket.id, isMuted });
    });

    socket.on('call:video-toggle', ({ roomId, isVideoOff }) => {
      socket.to(roomId).emit('user:video-toggled', { socketId: socket.id, isVideoOff });
    });

    // Leave room
    socket.on('room:leave', ({ roomId, userId }) => {
      handleUserLeave(socket, roomId, userId);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Clean up user from all rooms
      activeRooms.forEach((room, roomId) => {
        const participantIndex = room.participants.findIndex(
          (p) => p.socketId === socket.id
        );

        if (participantIndex !== -1) {
          const participant = room.participants[participantIndex];
          handleUserLeave(socket, roomId, participant.userId);
        }
      });

      // Remove from user sockets map
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
    });

    // Recording events
    socket.on('recording:start', ({ roomId, userName }) => {
      socket.to(roomId).emit('recording:started', { userName });
    });

    socket.on('recording:stop', ({ roomId }) => {
      socket.to(roomId).emit('recording:stopped');
    });
  });

  return io;
};

const handleUserLeave = (socket, roomId, userId) => {
  socket.leave(roomId);

  const room = activeRooms.get(roomId);
  if (room) {
    // Remove participant
    room.participants = room.participants.filter((p) => p.socketId !== socket.id);

    // Notify others
    socket.to(roomId).emit('user:left', { socketId: socket.id, userId });

    // Clean up empty rooms
    if (room.participants.length === 0) {
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} closed`);
    }
  }
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const notifyUser = (userId, event, data) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  notifyUser,
  activeRooms,
};
