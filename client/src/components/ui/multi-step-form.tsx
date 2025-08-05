import { ReactNode } from "react";
import { ProgressBar } from "./progress-bar";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave?: () => void;
  children: ReactNode;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSave,
  children,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep = false,
  isLoading = false
}: MultiStepFormProps) {
  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          {currentStepData?.title || "Product Analysis Form"}
        </h2>
        <p className="text-lg text-slate-600">
          {currentStepData?.description || "Our AI will ask intelligent follow-up questions based on your responses"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar
          value={progress}
          showLabel
          label={`Step ${currentStep} of ${steps.length}`}
        />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {currentStepData?.title}
          </h3>
          <p className="text-slate-600">
            {currentStepData?.description}
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || currentStep === 1 || isLoading}
            className="px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            {onSave && (
              <Button
                type="button"
                variant="outline"
                onClick={onSave}
                disabled={isLoading}
                className="px-6 py-3"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
            <Button
              type="button"
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="px-6 py-3 bg-primary text-white hover:bg-blue-700"
            >
              {isLastStep ? 'Generate Report' : 'Continue'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
