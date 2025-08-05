import { AIQuestion } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, HelpCircle } from "lucide-react";

interface AIQuestionsProps {
  questions: AIQuestion[];
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, answer: any) => void;
}

export function AIQuestions({ questions, answers, onAnswerChange }: AIQuestionsProps) {
  if (questions.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">AI Questions Loading...</h4>
            <p className="text-slate-600 text-sm">
              Our AI is generating personalized questions for your product.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="text-white" size={16} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-2">AI Follow-up Questions</h4>
          <p className="text-slate-600 text-sm mb-4">
            Based on your product category, our AI has generated these specific questions:
          </p>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionRenderer
                key={question.id || index}
                question={question}
                answer={answers[question.id || index.toString()]}
                onAnswerChange={(answer) => onAnswerChange(question.id || index.toString(), answer)}
              />
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <HelpCircle className="inline w-3 h-3 mr-1" />
              Our AI will generate additional questions based on your responses to provide the most comprehensive analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionRendererProps {
  question: AIQuestion;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

function QuestionRenderer({ question, answer, onAnswerChange }: QuestionRendererProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder="Enter your answer..."
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        );

      case 'textarea':
        return (
          <Textarea
            rows={3}
            placeholder="Enter your answer..."
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        );

      case 'select':
        return (
          <Select value={answer || ''} onValueChange={onAnswerChange}>
            <SelectTrigger className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        const selectedOptions = Array.isArray(answer) ? answer : [];
        return (
          <div className="grid grid-cols-2 gap-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswerChange([...selectedOptions, option]);
                    } else {
                      onAnswerChange(selectedOptions.filter((item: string) => item !== option));
                    }
                  }}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            placeholder="Enter your answer..."
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-blue-200">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <HelpCircle className="inline w-4 h-4 text-primary mr-2" />
        {question.question}
      </label>
      {renderInput()}
    </div>
  );
}
