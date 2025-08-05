import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ProductFormData, AIQuestion, FormStep } from "@/types/product";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { ProductFormStep } from "@/components/forms/product-form-step";
import { AIQuestions } from "@/components/forms/ai-questions";
import { useToast } from "@/hooks/use-toast";
import { productApi, questionApi } from "@/lib/api";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Product Information",
    description: "Tell us about the product you'd like to analyze",
    completed: false
  },
  {
    id: 2,
    title: "AI Questions",
    description: "Answer intelligent follow-up questions based on your product",
    completed: false
  },
  {
    id: 3, 
    title: "Review & Generate",
    description: "Review your responses and generate the transparency report",
    completed: false
  }
];

export default function ProductForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});
  const [steps, setSteps] = useState(FORM_STEPS);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      description: ""
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: (product) => {
      setProductId(product.id);
      setSteps(prev => prev.map(step => 
        step.id === 1 ? { ...step, completed: true } : step
      ));
      setCurrentStep(2);
      generateQuestionsMutation.mutate(product.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate AI questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: productApi.generateQuestions,
    onSuccess: (data) => {
      setAiQuestions(data.questions || []);
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to generate AI questions. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update question answer mutation
  const updateAnswerMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) => 
      questionApi.updateAnswer(questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'questions'] });
    }
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: productApi.generateReport,
    onSuccess: (report) => {
      toast({
        title: "Success",
        description: "Transparency report generated successfully!",
        variant: "default"
      });
      setLocation(`/report/${report.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger();
      if (isValid) {
        const formData = form.getValues();
        createProductMutation.mutate(formData);
      }
    } else if (currentStep === 2) {
      // Move to review step
      setSteps(prev => prev.map(step => 
        step.id === 2 ? { ...step, completed: true } : step
      ));
      setCurrentStep(3);  
    } else if (currentStep === 3) {
      // Generate report
      if (productId) {
        generateReportMutation.mutate(productId);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Find the actual question from aiQuestions to get the real ID
    const question = aiQuestions.find((q, index) => 
      q.id === questionId || index.toString() === questionId
    );
    
    if (question?.id) {
      updateAnswerMutation.mutate({ 
        questionId: question.id, 
        answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer) 
      });
    }
  };

  const canGoNext = () => {
    if (currentStep === 1) {
      return form.formState.isValid;
    }
    if (currentStep === 2) {
      // Allow proceeding even if not all questions are answered
      return true;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProductFormStep form={form} />;
      case 2:
        return (
          <AIQuestions
            questions={aiQuestions}
            answers={questionAnswers}
            onAnswerChange={handleAnswerChange}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Review Your Submission</h4>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p><strong>Product:</strong> {form.getValues('name')}</p>
                <p><strong>Brand:</strong> {form.getValues('brand') || 'Not specified'}</p>
                <p><strong>Category:</strong> {form.getValues('category')}</p>
                {form.getValues('description') && (
                  <p><strong>Description:</strong> {form.getValues('description')}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Questions Answered</h4>
              <p className="text-slate-600">
                {Object.keys(questionAnswers).length} of {aiQuestions.length} questions answered
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                Ready to generate your comprehensive transparency report? This will analyze all provided information and create detailed scores and recommendations.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isLoading = createProductMutation.isPending || 
                   generateQuestionsMutation.isPending ||
                   generateReportMutation.isPending;

  return (
    <div className="bg-slate-50 py-20">
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext()}
        canGoPrevious={currentStep > 1}
        isLastStep={currentStep === 3}
        isLoading={isLoading}
      >
        {renderStepContent()}
      </MultiStepForm>
    </div>
  );
}
