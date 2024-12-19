import api from './api';

export const dashboardService = {
  async getDashboardStats() {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  async getRecentContent() {
    const response = await api.get('/api/content');
    return response.data;
  },

  async getCreditBalance() {
    const response = await api.get('/api/analytics/credit-usage');
    return response.data;
  }
};

export default dashboardService;