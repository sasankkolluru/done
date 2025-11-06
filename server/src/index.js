import express from 'express';
<<<<<<< HEAD
=======
import { createServer } from 'http';
import { Server } from 'socket.io';
>>>>>>> 7dbaff3 (Resolve merge conflicts)
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';
<<<<<<< HEAD
=======
import { protectSocket } from './middleware/auth.js';
>>>>>>> 7dbaff3 (Resolve merge conflicts)

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
<<<<<<< HEAD

// Enable CORS
app.use(cors());
=======
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io'
});

// Socket.IO connection handler
io.use(protectSocket);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join user to their room
  socket.on('join', ({ userId }) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// Enable CORS for regular HTTP requests
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
>>>>>>> 7dbaff3 (Resolve merge conflicts)

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import facultyRoutes from './routes/faculty.js';
import examRoutes from './routes/exams.js';
import classroomRoutes from './routes/classrooms.js';
import invigilationRoutes from './routes/invigilation.js';
<<<<<<< HEAD
=======
import adminRoutes from './routes/admin.js';
>>>>>>> 7dbaff3 (Resolve merge conflicts)

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/classrooms', classroomRoutes);
app.use('/api/v1/invigilation', invigilationRoutes);
<<<<<<< HEAD
=======
app.use('/api/v1/admin', adminRoutes);
>>>>>>> 7dbaff3 (Resolve merge conflicts)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
=======
// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`WebSocket server running on ws://localhost:${PORT}/socket.io`.cyan.underline);
});
>>>>>>> 7dbaff3 (Resolve merge conflicts)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
<<<<<<< HEAD
  server.close(() => process.exit(1));
=======
  httpServer.close(() => process.exit(1));
>>>>>>> 7dbaff3 (Resolve merge conflicts)
});
