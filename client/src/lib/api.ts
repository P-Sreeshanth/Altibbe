import { apiRequest } from './queryClient';
import { ProductFormData, AIQuestion, TransparencyReport } from '../types/product';

export const productApi = {
  create: async (data: ProductFormData) => {
    const response = await apiRequest('POST', '/api/products', data);
    return response.json();
  },

  get: async (id: string) => {
    const response = await apiRequest('GET', `/api/products/${id}`);
    return response.json();
  },

  generateQuestions: async (id: string) => {
    const response = await apiRequest('POST', `/api/products/${id}/generate-questions`);
    return response.json();
  },

  getQuestions: async (id: string) => {
    const response = await apiRequest('GET', `/api/products/${id}/questions`);
    return response.json();
  },

  generateReport: async (id: string) => {
    const response = await apiRequest('POST', `/api/products/${id}/generate-report`);
    return response.json();
  },

  getReport: async (id: string) => {
    const response = await apiRequest('GET', `/api/products/${id}/report`);
    return response.json();
  }
};

export const questionApi = {
  updateAnswer: async (id: string, answer: string) => {
    const response = await apiRequest('PATCH', `/api/questions/${id}`, { answer });
    return response.json();
  }
};

export const reportApi = {
  generatePDF: async (id: string) => {
    const response = await apiRequest('POST', `/api/reports/${id}/pdf`);
    return response.json();
  }
};

export const formSessionApi = {
  create: async (data: any) => {
    const response = await apiRequest('POST', '/api/form-sessions', data);
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest('PATCH', `/api/form-sessions/${id}`, data);
    return response.json();
  },

  get: async (id: string) => {
    const response = await apiRequest('GET', `/api/form-sessions/${id}`);
    return response.json();
  }
};
