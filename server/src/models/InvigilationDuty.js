import mongoose from 'mongoose';

const invigilationDutySchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  subject: {
    subjectCode: String,
    subjectName: String,
    department: String,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Storing as string in 'HH:mm' format
    required: true,
  },
  endTime: {
    type: String, // Storing as string in 'HH:mm' format
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'REPLACED'],
    default: 'SCHEDULED',
  },
  replacement: {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    reason: String,
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Indexes for common queries
invigilationDutySchema.index({ faculty: 1, date: 1 });
invigilationDutySchema.index({ exam: 1, classroom: 1, date: 1 });
invigilationDutySchema.index({ status: 1 });
invigilationDutySchema.index({ 'replacement.status': 1 });

export const InvigilationDuty = mongoose.model('InvigilationDuty', invigilationDutySchema);
