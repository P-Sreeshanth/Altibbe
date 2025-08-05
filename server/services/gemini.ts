import { GoogleGenAI } from "@google/genai";

// Use Google Gemini for AI functionality
const genai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyAQpyIN7O-JVduda_xz_68tkfmuotbEjwY"
});

export interface AIQuestion {
  question: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  metadata?: Record<string, any>;
}

export interface TransparencyScoring {
  transparencyScore: number;
  healthScore: number;
  ethicalScore: number;
  environmentalScore: number;
  keyFindings: string[];
  recommendations: string;
}

export async function generateFollowUpQuestions(
  productName: string,
  category: string,
  description?: string,
  existingAnswers: Record<string, any> = {}
): Promise<AIQuestion[]> {
  try {
    const prompt = `You are an expert product transparency analyst. Based on the following product information, generate 3-5 intelligent follow-up questions that will help assess the product's transparency, health impact, ethical sourcing, and environmental footprint.

Product Details:
- Name: ${productName}
- Category: ${category}
- Description: ${description || 'Not provided'}
- Existing answers: ${JSON.stringify(existingAnswers)}

Generate questions that are:
1. Specific to the product category
2. Focused on transparency, health, ethics, and environment
3. Actionable and answerable by someone familiar with the product
4. Progressive (building on existing answers if any)

Return your response as a JSON object with this exact format:
{
  "questions": [
    {
      "question": "Question text here",
      "type": "text|select|checkbox|textarea",
      "options": ["option1", "option2"] // only for select/checkbox types
    }
  ]
}`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  type: { type: "string" },
                  options: { type: "array", items: { type: "string" } }
                },
                required: ["question", "type"]
              }
            }
          },
          required: ["questions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{"questions": []}');
    return result.questions || [];
  } catch (error) {
    console.error('Error generating AI questions:', error);
    // Return fallback questions based on category
    return getFallbackQuestions(category);
  }
}

export async function calculateTransparencyScore(
  productData: {
    name: string;
    category: string;
    description?: string;
    questions: Array<{ question: string; answer: string }>;
  }
): Promise<TransparencyScoring> {
  try {
    const prompt = `You are a product transparency scoring expert. Analyze this product data and provide scoring across four dimensions: transparency, health impact, ethical practices, and environmental impact.

Product Data:
${JSON.stringify(productData, null, 2)}

Provide scores (0-100) and analysis in this exact JSON format:
{
  "transparencyScore": 85,
  "healthScore": 92,
  "ethicalScore": 78,
  "environmentalScore": 65,
  "keyFindings": [
    "Specific finding 1 about the product",
    "Specific finding 2 about the product",
    "Specific finding 3 about the product"
  ],
  "recommendations": "Detailed recommendations for improvement or validation of positive aspects"
}

Scoring guidelines:
- Transparency (0-100): Information availability, clarity, verifiability
- Health (0-100): Safety, nutritional value, absence of harmful ingredients
- Ethical (0-100): Fair labor, responsible sourcing, social impact
- Environmental (0-100): Sustainability, carbon footprint, packaging`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            transparencyScore: { type: "number" },
            healthScore: { type: "number" },
            ethicalScore: { type: "number" },
            environmentalScore: { type: "number" },
            keyFindings: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: { type: "string" }
          },
          required: ["transparencyScore", "healthScore", "ethicalScore", "environmentalScore", "keyFindings", "recommendations"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{}');
    
    // Ensure all required fields are present with defaults
    return {
      transparencyScore: Math.max(0, Math.min(100, result.transparencyScore || 0)),
      healthScore: Math.max(0, Math.min(100, result.healthScore || 0)),
      ethicalScore: Math.max(0, Math.min(100, result.ethicalScore || 0)),
      environmentalScore: Math.max(0, Math.min(100, result.environmentalScore || 0)),
      keyFindings: result.keyFindings || ["Analysis in progress"],
      recommendations: result.recommendations || "Complete analysis to receive recommendations"
    };
  } catch (error) {
    console.error('Error calculating transparency score:', error);
    throw new Error('Failed to calculate transparency score');
  }
}

function getFallbackQuestions(category: string): AIQuestion[] {
  const baseQuestions: AIQuestion[] = [
    {
      question: "What certifications does this product have?",
      type: "checkbox",
      options: ["Organic", "Fair Trade", "Non-GMO", "B-Corp", "Carbon Neutral", "None"]
    },
    {
      question: "Where are the ingredients or materials sourced from?",
      type: "select",
      options: ["Local", "National", "International", "Mixed", "Unknown"]
    }
  ];

  const categorySpecific: Record<string, AIQuestion[]> = {
    "food-beverages": [
      {
        question: "What preservatives or additives are included?",
        type: "textarea"
      },
      {
        question: "What type of packaging is used?",
        type: "checkbox",
        options: ["Recyclable", "Biodegradable", "Plastic-free", "Minimal packaging"]
      }
    ],
    "personal-care": [
      {
        question: "Is this product tested on animals?",
        type: "select",
        options: ["Never tested on animals", "Not tested by us", "Third-party testing", "Unknown"]
      },
      {
        question: "What potentially harmful ingredients are avoided?",
        type: "checkbox",
        options: ["Parabens", "Sulfates", "Phthalates", "Synthetic fragrances", "None specified"]
      }
    ]
  };

  return [...baseQuestions, ...(categorySpecific[category] || [])];
}