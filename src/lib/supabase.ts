import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  role: 'admin' | 'faculty';
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
};

export type Faculty = {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  specialization?: string;
  max_duties_per_month: number;
  total_duties_assigned: number;
  created_at: string;
  updated_at: string;
};

export type Exam = {
  id: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
  department: string;
  course?: string;
  semester?: string;
  total_students: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type Classroom = {
  id: string;
  room_number: string;
  building: string;
  capacity: number;
  facilities?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type DutySchedule = {
  id: string;
  exam_id: string;
  faculty_id: string;
  classroom_id?: string;
  duty_date: string;
  duty_hours: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_change';
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type ChangeRequest = {
  id: string;
  faculty_id: string;
  schedule_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_response?: string;
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'duty_assigned' | 'duty_changed' | 'request_approved' | 'request_rejected' | 'system';
  read: boolean;
  link?: string;
  created_at: string;
};
