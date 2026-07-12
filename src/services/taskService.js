import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
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

// Task service
export const taskService = {
  // Get all tasks (filtered by role automatically)
  getAll: async () => {
    try {
      const response = await api.get('/tasks/');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get single task
  getOne: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Create task
  create: async (taskData) => {
    try {
      const response = await api.post('/tasks/', taskData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Update task
  update: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Delete task
  delete: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Update task status only
  updateStatus: async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get tasks by status
  getByStatus: async (status) => {
    try {
      const allTasks = await taskService.getAll();
      return allTasks.filter(task => task.status === status);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get tasks by priority
  getByPriority: async (priority) => {
    try {
      const allTasks = await taskService.getAll();
      return allTasks.filter(task => task.priority === priority);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get tasks by user (admin only)
  getByUser: async (userId) => {
    try {
      const allTasks = await taskService.getAll();
      return allTasks.filter(task => task.user_id === userId);
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Error handler function
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.detail || 'An error occurred';
    const status = error.response.status;
    return new Error(`${status}: ${message}`);
  } else if (error.request) {
    // Request sent but no response
    return new Error('Network error: Could not connect to server');
  } else {
    // Something else
    return new Error(error.message || 'An unexpected error occurred');
  }
};

// Export api instance for direct use (if needed)
export default api;