import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  building: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    enum: ['LECTURE_HALL', 'LAB', 'SEMINAR_HALL', 'OTHER'],
    default: 'LECTURE_HALL',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  availableFrom: {
    type: String,
    default: '09:00',
  },
  availableTo: {
    type: String,
    default: '17:00',
  },
  facilities: [{
    type: String,
    enum: ['PROJECTOR', 'WHITEBOARD', 'AC', 'COMPUTERS', 'MIC', 'CAMERA', 'INTERNET'],
  }],
  department: {
    type: String,
    default: 'GENERAL',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
classroomSchema.index({ roomNumber: 1 }, { unique: true });
classroomSchema.index({ building: 1, floor: 1 });
classroomSchema.index({ capacity: 1 });

export const Classroom = mongoose.model('Classroom', classroomSchema);
