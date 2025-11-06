import api from '@/services/api';

const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/v1/admin/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  
  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/v1/admin/users', { params });
    return response.data;
  },
  
  createUser: async (userData) => {
    const response = await api.post('/v1/admin/users', userData);
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/v1/admin/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/v1/admin/users/${id}`);
    return response.data;
  },
  
  // System Settings
  updateSettings: async (settings) => {
    const response = await api.put('/v1/admin/settings', settings);
    return response.data;
  },
  
  // Backup & Restore
  createBackup: async () => {
    const response = await api.post('/v1/admin/backup');
    return response.data;
  },
  
  restoreBackup: async (backupData) => {
    const response = await api.post('/v1/admin/restore', backupData);
    return response.data;
  },
  
  // Logs
  getLogs: async (params = {}) => {
    const response = await api.get('/v1/admin/logs', { params });
    return response.data;
  },
  
  // System Status
  getSystemStatus: async () => {
    const response = await api.get('/v1/admin/status');
    return response.data;
  }
};

export default adminAPI;
