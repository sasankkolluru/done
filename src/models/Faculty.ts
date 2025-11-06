import mongoose, { Document, Schema } from 'mongoose';

export interface IFaculty extends Document {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Temporary Faculty';
  maxHoursPerWeek: number;
  isAvailable: boolean;
  unavailableDates: Date[];
  subjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

const facultySchema = new Schema<IFaculty>(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: {
      type: String,
      required: true,
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Temporary Faculty']
    },
    maxHoursPerWeek: { type: Number, default: 8 },
    isAvailable: { type: Boolean, default: true },
    unavailableDates: [{ type: Date }],
    subjects: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes for faster queries
facultySchema.index({ department: 1, isAvailable: 1 });
facultySchema.index({ email: 1 }, { unique: true });

export const Faculty = mongoose.model<IFaculty>('Faculty', facultySchema);
