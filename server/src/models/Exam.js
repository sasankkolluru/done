import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  examType: {
    type: String,
    enum: ['MID_TERM', 'END_TERM', 'QUIZ', 'ASSIGNMENT'],
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING',
  },
  subjects: [
    {
      subjectCode: String,
      subjectName: String,
      department: String,
      examDate: Date,
      startTime: String,
      endTime: String,
      duration: Number, // in minutes
    },
  ],
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
examSchema.index({ examType: 1, academicYear: 1, semester: 1 });

export const Exam = mongoose.model('Exam', examSchema);
