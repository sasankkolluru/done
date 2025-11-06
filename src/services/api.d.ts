declare module '@/services/api' {
  export interface APIResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
  }

  export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    notifications: boolean;
    dark_mode: boolean;
  }

  export interface UpdateProfileData {
    full_name?: string;
    email?: string;
    phone?: string;
    notifications?: boolean;
    dark_mode?: boolean;
  }

  export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
  }

  export interface DutySchedule {
    id: string;
    faculty_id: string;
    exam_id: string;
    classroom_id: string;
    duty_date: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    duration_hours?: number;
    exam?: {
      exam_name: string;
      subject: string;
      exam_date: string;
      start_time: string;
      end_time: string;
    };
    classroom?: {
      room_number: string;
      building: string;
    };
  }

  export interface ChangeRequest {
    id: string;
    faculty_id: string;
    schedule_id: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  }

  export const userAPI: {
    getMe: () => Promise<APIResponse<UserProfile>>;
    updateMe: (data: UpdateProfileData) => Promise<APIResponse<UserProfile>>;
    changePassword: (data: ChangePasswordData) => Promise<APIResponse<{ success: boolean }>>;
  };

  export const facultyAPI: {
    getMyDuties: () => Promise<APIResponse<DutySchedule[]>>;
    getChangeRequests: () => Promise<APIResponse<ChangeRequest[]>>;
  };
}
