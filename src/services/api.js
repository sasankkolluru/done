import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Faculty API
export const facultyAPI = {
  getAll: (params) => api.get('/faculty', { params }),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post(`/faculty/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/faculty/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Exam API
export const examAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  getStatistics: () => api.get('/exams/statistics'),
};

// Classroom API
export const classroomAPI = {
  getAll: (params) => api.get('/classrooms', { params }),
  getById: (id) => api.get(`/classrooms/${id}`),
  create: (data) => api.post('/classrooms', data),
  update: (id, data) => api.put(`/classrooms/${id}`, data),
  delete: (id) => api.delete(`/classrooms/${id}`),
  getByBuilding: (building) => api.get(`/classrooms/building/${building}`),
  checkAvailability: (data) => api.post('/classrooms/availability', data),
};

// Invigilation API
export const invigilationAPI = {
  getAll: (params) => api.get('/invigilation', { params }),
  getById: (id) => api.get(`/invigilation/${id}`),
  create: (data) => api.post('/invigilation', data),
  update: (id, data) => api.put(`/invigilation/${id}`, data),
  delete: (id) => api.delete(`/invigilation/${id}`),
  generateSchedule: (data) => api.post('/invigilation/generate', data),
  getDutyLetter: (id) => api.get(`/invigilation/${id}/duty-letter`, { responseType: 'blob' }),
  requestReplacement: (id, data) => api.post(`/invigilation/${id}/replacement-request`, data),
  approveReplacement: (requestId, data) => api.put(`/invigilation/replacement-requests/${requestId}/approve`, data),
  rejectReplacement: (requestId, data) => api.put(`/invigilation/replacement-requests/${requestId}/reject`, data),
  getMyDuties: () => api.get('/invigilation/my-duties'),
  getFacultyWorkload: () => api.get('/invigilation/faculty-workload'),
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateMe: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getNotifications: () => api.get('/users/me/notifications'),
  markNotificationAsRead: (notificationId) => api.put(`/users/me/notifications/${notificationId}/read`),
};

// File Upload API
export const fileAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  downloadFile: (fileId) => api.get(`/files/${fileId}`, { responseType: 'blob' }),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
};

export default api;
