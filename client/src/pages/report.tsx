import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBreakdown } from "@/components/report/score-breakdown";
import { KeyFindings } from "@/components/report/key-findings";
import { productApi, reportApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Share, 
  Bookmark, 
  ArrowLeft, 
  Tag,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

export default function Report() {
  const params = useParams();
  const reportId = params.id;
  const { toast } = useToast();

  // Fetch report data
  const { data: report, isLoading: reportLoading, error: reportError } = useQuery({
    queryKey: ['/api/reports', reportId],
    queryFn: async () => {
      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) throw new Error('Report not found');
      return response.json();
    },
    enabled: !!reportId
  });

  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/products', report?.productId],
    queryFn: async () => {
      if (!report?.productId) return null;
      const response = await fetch(`/api/products/${report.productId}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: !!report?.productId
  });

  // Generate PDF mutation
  const generatePDFMutation = useMutation({
    mutationFn: () => reportApi.generatePDF(reportId!),
    onSuccess: (data) => {
      // Create download link
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "PDF report downloaded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (reportLoading || productLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Loading your transparency report...</p>
        </div>
      </div>
    );
  }

  if (reportError || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Report Not Found</h1>
            <p className="text-slate-600 mb-6">
              The transparency report you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-primary text-white hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getOverallGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (score >= 85) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'A-', color: 'text-green-500' };
    if (score >= 75) return { grade: 'B+', color: 'text-blue-600' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500' };
    if (score >= 65) return { grade: 'B-', color: 'text-yellow-600' };
    return { grade: 'C', color: 'text-orange-600' };
  };

  const overallGrade = getOverallGrade(report.transparencyScore);

  return (
    <div className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Transparency Report</h1>
            <p className="text-lg text-slate-600">Comprehensive analysis for informed decision-making</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Report Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-slate-200 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {product?.name || 'Loading...'}
                    </h2>
                    <p className="text-slate-600">{product?.brand || 'Brand not specified'}</p>
                    <Badge variant="secondary" className="mt-2">
                      {product?.category || 'Category'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${overallGrade.color}`}>
                      {report.transparencyScore}
                    </div>
                    <p className="text-sm text-slate-600">Transparency Score</p>
                    <div className={`text-lg font-semibold ${overallGrade.color}`}>
                      {overallGrade.grade}
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                {product?.description && (
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Product Description</h4>
                    <p className="text-slate-600 text-sm">{product.description}</p>
                  </div>
                )}

                {/* Score Breakdown */}
                <ScoreBreakdown report={report} />

                {/* Key Findings */}
                <KeyFindings report={report} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card className="bg-slate-50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Report Actions</h4>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-primary text-white hover:bg-blue-700"
                    onClick={() => generatePDFMutation.mutate()}
                    disabled={generatePDFMutation.isPending}
                  >
                    {generatePDFMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Download PDF Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigator.share?.({
                        title: `Transparency Report: ${product?.name}`,
                        text: `Check out this product transparency report with a score of ${report.transparencyScore}/100`,
                        url: window.location.href
                      }).catch(() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link Copied",
                          description: "Report link copied to clipboard!"
                        });
                      });
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Account system will be available soon!"
                      });
                    }}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save to Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Tag className="text-white" size={16} />
                  </div>
                  <h4 className="font-semibold text-slate-900">Verified Report</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  This report has been generated using our AI-powered analysis and verified against our transparency standards.
                </p>
                <div className="text-xs text-slate-500">
                  Report ID: {report.id}<br />
                  Generated: {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Generate Another Report CTA */}
            <Card className="bg-primary text-white">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold mb-2">Analyze Another Product?</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Get transparency insights for more products with our AI-powered platform.
                </p>
                <Link href="/product-form">
                  <Button className="w-full bg-white text-primary hover:bg-gray-100">
                    Start New Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
