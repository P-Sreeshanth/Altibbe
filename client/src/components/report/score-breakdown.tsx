import { TransparencyReport } from "@/types/product";
import { Leaf, Shield, Scale, Recycle } from "lucide-react";

interface ScoreBreakdownProps {
  report: TransparencyReport;
}

export function ScoreBreakdown({ report }: ScoreBreakdownProps) {
  const scores = [
    {
      label: 'Health Impact',
      value: report.healthScore,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      icon: Leaf,
      grade: getGrade(report.healthScore)
    },
    {
      label: 'Ethical Rating',
      value: report.ethicalScore,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      icon: Scale,
      grade: getGrade(report.ethicalScore)
    },
    {
      label: 'Environmental',
      value: report.environmentalScore,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: Recycle,
      grade: getGrade(report.environmentalScore)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {scores.map((score) => {
        const Icon = score.icon;
        return (
          <div key={score.label} className={`text-center p-4 ${score.bgColor} rounded-lg`}>
            <div className={`w-12 h-12 ${score.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Icon className="text-white" size={20} />
            </div>
            <div className="text-2xl font-bold" style={{ color: score.color.replace('bg-', '#').replace('-500', '') }}>
              {score.grade}
            </div>
            <p className="text-sm text-slate-600">{score.label}</p>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${score.color}`}
                style={{ width: `${score.value}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{score.value}/100</p>
          </div>
        );
      })}
    </div>
  );
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'D';
}
