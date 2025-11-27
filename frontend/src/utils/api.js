import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users/create', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Doctors API
export const doctorsAPI = {
  create: (data) => api.post('/doctors', data),
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getByUserId: (userId) => api.get(`/doctors/user/${userId}`),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  search: (specialization) => api.get(`/doctors/search/${specialization}`),
};

// Appointments API
export const appointmentsAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getDoctorAppointments: () => api.get('/appointments/doctor-appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Health Records API
export const recordsAPI = {
  create: (data) => api.post('/records', data),
  getMy: () => api.get('/records'),
  getAll: () => api.get('/records/all'),
  getById: (id) => api.get(`/records/${id}`),
  getByUserId: (userId) => api.get(`/records/user/${userId}`),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`),
  getStats: () => api.get('/records/stats/summary'),
};

// Schedule API
export const scheduleAPI = {
  getDoctorSchedule: (doctorId) => api.get(`/schedule/doctor/${doctorId}`),
  getAvailableSlots: (doctorId, date) => api.get(`/schedule/available-slots/${doctorId}/${date}`),
  createSchedule: (data) => api.post('/schedule', data),
  updateSchedule: (id, data) => api.put(`/schedule/${id}`, data),
  deleteSchedule: (id) => api.delete(`/schedule/${id}`),
  applyLeave: (data) => api.post('/schedule/leave', data),
  getMyLeaves: () => api.get('/schedule/leaves'),
  deleteLeave: (id) => api.delete(`/schedule/leave/${id}`),
  // Admin functions
  getAllLeaves: () => api.get('/schedule/leaves/all'),
  reviewLeave: (id, data) => api.put(`/schedule/leaves/${id}/review`, data),
};

// Analytics API
export const analyticsAPI = {
  getMonthlyStats: (year) => api.get(`/analytics/monthly${year ? `?year=${year}` : ''}`),
  getRevenueStats: (year) => api.get(`/analytics/revenue${year ? `?year=${year}` : ''}`),
  getDoctorPerformance: (year, doctorId) => api.get(`/analytics/doctor-performance${year ? `?year=${year}` : ''}${doctorId ? `&doctorId=${doctorId}` : ''}`),
};

export default api;
