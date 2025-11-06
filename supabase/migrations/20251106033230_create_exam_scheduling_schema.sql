/*
  # Exam Duty Scheduling System - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the Exam Duty Scheduling System,
  including tables for users, faculty, exams, schedules, change requests, and notifications.

  ## Tables Created

  ### 1. profiles
  - Extends auth.users with role and profile information
  - Fields: id (uuid), role (admin/faculty), full_name, email, phone, department, photo_url
  - RLS: Users can read their own profile, admins can read all

  ### 2. faculty
  - Stores faculty-specific information
  - Fields: id, user_id, employee_id, department, specialization, max_duties_per_month
  - RLS: Faculty can read their own data, admins can manage all

  ### 3. exams
  - Stores exam information
  - Fields: id, exam_name, exam_date, start_time, end_time, subject, department, course
  - RLS: All authenticated users can read, only admins can modify

  ### 4. classrooms
  - Stores classroom/venue information
  - Fields: id, room_number, building, capacity, facilities
  - RLS: All authenticated users can read, only admins can modify

  ### 5. duty_schedules
  - Main scheduling table linking faculty to exam duties
  - Fields: id, exam_id, faculty_id, classroom_id, duty_date, duty_hours, status
  - RLS: Faculty can read their own schedules, admins can manage all

  ### 6. change_requests
  - Handles faculty requests for duty changes
  - Fields: id, faculty_id, schedule_id, reason, status, admin_response
  - RLS: Faculty can create and read their own requests, admins can manage all

  ### 7. notifications
  - System notifications for users
  - Fields: id, user_id, title, message, type, read, created_at
  - RLS: Users can read and update their own notifications

  ### 8. system_settings
  - Global system configuration
  - Fields: id, key, value, description
  - RLS: All authenticated users can read, only admins can modify

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies enforce role-based access control
  - Foreign key constraints maintain data integrity
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'faculty');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE duty_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending_change');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('duty_assigned', 'duty_changed', 'request_approved', 'request_rejected', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'faculty',
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  department text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  department text NOT NULL,
  specialization text,
  max_duties_per_month integer DEFAULT 10,
  total_duties_assigned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can read own data"
  ON faculty FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all faculty"
  ON faculty FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage faculty"
  ON faculty FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  exam_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  subject text NOT NULL,
  department text NOT NULL,
  course text,
  semester text,
  total_students integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage exams"
  ON exams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text NOT NULL,
  building text NOT NULL,
  capacity integer NOT NULL,
  facilities text[],
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read classrooms"
  ON classrooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classrooms"
  ON classrooms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create duty_schedules table
CREATE TABLE IF NOT EXISTS duty_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE SET NULL,
  duty_date date NOT NULL,
  duty_hours numeric(3,1) DEFAULT 3.0,
  status duty_status DEFAULT 'scheduled',
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE duty_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can read own schedules"
  ON duty_schedules FOR SELECT
  TO authenticated
  USING (
    faculty_id IN (
      SELECT id FROM faculty WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all schedules"
  ON duty_schedules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage schedules"
  ON duty_schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create change_requests table
CREATE TABLE IF NOT EXISTS change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES duty_schedules(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status request_status DEFAULT 'pending',
  admin_response text,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can create own requests"
  ON change_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    faculty_id IN (
      SELECT id FROM faculty WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can read own requests"
  ON change_requests FOR SELECT
  TO authenticated
  USING (
    faculty_id IN (
      SELECT id FROM faculty WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requests"
  ON change_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'system',
  read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('max_duties_per_month', '10', 'Maximum duties per faculty per month'),
  ('min_gap_between_duties', '1', 'Minimum days gap between consecutive duties'),
  ('duty_hours_default', '3.0', 'Default duty hours per session'),
  ('theme_primary_color', '#3b82f6', 'Primary theme color'),
  ('allow_faculty_requests', 'true', 'Allow faculty to submit change requests')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_duty_schedules_faculty_id ON duty_schedules(faculty_id);
CREATE INDEX IF NOT EXISTS idx_duty_schedules_exam_id ON duty_schedules(exam_id);
CREATE INDEX IF NOT EXISTS idx_duty_schedules_duty_date ON duty_schedules(duty_date);
CREATE INDEX IF NOT EXISTS idx_change_requests_faculty_id ON change_requests(faculty_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON change_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
