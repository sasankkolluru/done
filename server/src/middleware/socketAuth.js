import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';

// Protect routes with JWT for WebSocket connections
export const protectSocket = async (socket, next) => {
  let token;

  // Get token from handshake query
  if (socket.handshake.query && socket.handshake.query.token) {
    token = socket.handshake.query.token;
  }
  
  // Get token from cookies
  else if (socket.handshake.cookies && socket.handshake.cookies.token) {
    token = socket.handshake.cookies.token;
  }
  
  // Get token from Authorization header
  else if (socket.handshake.headers.authorization && 
           socket.handshake.headers.authorization.startsWith('Bearer')) {
    token = socket.handshake.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    console.log('No token, authorization denied');
    return next(new Error('Not authorized, no token'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('No user found with this id');
      return next(new Error('Not authorized, user not found'));
    }

    // Attach user to the socket for use in event handlers
    socket.user = user;
    
    next();
  } catch (err) {
    console.log('Invalid token');
    return next(new Error('Not authorized, token failed'));
  }
};

// Grant access to specific roles
export const authorizeSocket = (...roles) => {
  return (socket, next) => {
    if (!roles.includes(socket.user.role)) {
      console.log(`User role ${socket.user.role} is not authorized`);
      return next(new Error(`User role ${socket.user.role} is not authorized`));
    }
    next();
  };
};
