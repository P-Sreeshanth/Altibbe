import { apiRequest } from './queryClient';
import { ProductFormData, AIQuestion, TransparencyReport } from '../types/product';

// Frontend-only mode detection
export const isStaticMode = () => {
  // Check if we're on GitHub Pages or similar static hosting
  return window.location.hostname.includes('github.io') || 
         window.location.hostname.includes('netlify.app') ||
         window.location.hostname.includes('vercel.app') ||
         !window.location.hostname.includes('localhost');
};

// Mock data for static deployment
export const mockApiRequest = async (url: string, options?: RequestInit) => {
  console.log('Static mode: Simulating API request to', url);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (url.includes('/api/products') && options?.method === 'POST') {
    // Mock product creation
    const productData = JSON.parse(options.body as string);
    return {
      id: 'demo-' + Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    };
  }
  
  if (url.includes('/generate-questions')) {
    // Mock AI questions
    return {
      questions: [
        {
          question: "What certifications does this product have?",
          type: "checkbox",
          options: ["Organic", "Fair Trade", "Non-GMO", "B-Corp", "Carbon Neutral", "None"]
        },
        {
          question: "Where are the ingredients or materials sourced from?",
          type: "select",
          options: ["Local", "National", "International", "Mixed", "Unknown"]
        },
        {
          question: "What is the packaging material?",
          type: "text"
        }
      ]
    };
  }
  
  if (url.includes('/generate-report')) {
    // Mock transparency report
    return {
      id: 'report-' + Date.now(),
      productId: 'demo-product',
      transparencyScore: 78,
      healthScore: 85,
      ethicalScore: 72,
      environmentalScore: 81,
      keyFindings: [
        "Product shows strong commitment to health standards",
        "Ethical sourcing practices are well documented",
        "Environmental impact is moderate with room for improvement"
      ],
      recommendations: "Consider implementing more sustainable packaging solutions and enhancing supply chain transparency.",
      createdAt: new Date().toISOString()
    };
  }
  
  throw new Error('Mock API endpoint not implemented');
};

export const productApi = {
  create: async (data: ProductFormData) => {
    if (isStaticMode()) {
      return await mockApiRequest('/api/products', { method: 'POST', body: JSON.stringify(data) });
    }
    const response = await apiRequest('POST', '/api/products', data);
    return response.json();
  },

  get: async (id: string) => {
    const response = await apiRequest('GET', `/api/products/${id}`);
    return response.json();
  },

  generateQuestions: async (id: string) => {
    if (isStaticMode()) {
      return await mockApiRequest(`/api/products/${id}/generate-questions`, { method: 'POST' });
    }
    const response = await apiRequest('POST', `/api/products/${id}/generate-questions`);
    return response.json();
  },

  getQuestions: async (id: string) => {
    const response = await apiRequest('GET', `/api/products/${id}/questions`);
    return response.json();
  },

  generateReport: async (id: string) => {
    if (isStaticMode()) {
      return await mockApiRequest(`/api/products/${id}/generate-report`, { method: 'POST' });
    }
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
