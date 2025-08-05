import { TransparencyReport } from "@/types/product";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface KeyFindingsProps {
  report: TransparencyReport;
}

export function KeyFindings({ report }: KeyFindingsProps) {
  // Categorize findings based on sentiment/score
  const categorizeFindings = (findings: string[]) => {
    return findings.map(finding => {
      const lowerFinding = finding.toLowerCase();
      let type: 'positive' | 'warning' | 'neutral' = 'neutral';
      
      if (lowerFinding.includes('certified') || 
          lowerFinding.includes('organic') || 
          lowerFinding.includes('transparent') ||
          lowerFinding.includes('excellent') ||
          lowerFinding.includes('good')) {
        type = 'positive';
      } else if (lowerFinding.includes('could') || 
                 lowerFinding.includes('should') || 
                 lowerFinding.includes('limited') ||
                 lowerFinding.includes('concern')) {
        type = 'warning';
      }
      
      return { text: finding, type };
    });
  };

  const categorizedFindings = categorizeFindings(report.keyFindings);

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Key Findings</h4>
        <div className="space-y-3">
          {categorizedFindings.map((finding, index) => (
            <div key={index} className="flex items-start space-x-3">
              {getIcon(finding.type)}
              <p className={`${getColor(finding.type)} flex-1`}>
                {finding.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {report.recommendations && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Recommendations</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-slate-700 text-sm">
              {report.recommendations}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
