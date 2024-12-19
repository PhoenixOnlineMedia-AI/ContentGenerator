import api from './api';

const contentService = {
  getContentStats: async () => {
    const response = await api.get('/content/stats');
    return response.data;
  },

  getRecentContent: async () => {
    const response = await api.get('/content/recent');
    return response.data;
  },

  createContent: async (data: any) => {
    const response = await api.post('/content', data);
    return response.data;
  }
};

export default contentService;