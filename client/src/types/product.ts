export interface ProductFormData {
  name: string;
  brand?: string;
  category: string;
  description?: string;
}

export interface AIQuestion {
  id?: string;
  question: string;
  answer?: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  metadata?: Record<string, any>;
}

export interface TransparencyReport {
  id: string;
  productId: string;
  transparencyScore: number;
  healthScore: number;
  ethicalScore: number;
  environmentalScore: number;
  keyFindings: string[];
  recommendations: string;
  createdAt: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const PRODUCT_CATEGORIES = [
  { value: 'food-beverages', label: 'Food & Beverages' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'household', label: 'Household Products' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'cosmetics', label: 'Cosmetics' },
  { value: 'clothing', label: 'Clothing & Textiles' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' }
];
