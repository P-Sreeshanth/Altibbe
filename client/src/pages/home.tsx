import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Leaf, 
  Search, 
  Play, 
  Download, 
  Brain, 
  ShieldCheck, 
  FileText, 
  Heart, 
  Lock, 
  Smartphone,
  CheckCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-secondary/20">
                <Leaf className="w-4 h-4" />
                <span>Health • Wisdom • Virtue</span>
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Transparent Product Analysis for{" "}
                <span className="text-primary">Informed Decisions</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Our AI-powered platform analyzes products through intelligent questioning, generating comprehensive transparency reports that help you make health-conscious, ethical choices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/product-form">
                  <Button size="lg" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105">
                    <Search className="w-5 h-5 mr-2" />
                    Analyze a Product
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Demo Report
                </Button>
              </div>
            </div>
            
            <div className="lg:pl-8">
              {/* Transparency Dashboard Mockup */}
              <Card className="shadow-xl border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Product Analysis</h3>
                    <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Analysis Complete</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Transparency Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">85%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Health Impact</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">92%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Ethical Rating</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-primary">78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full mt-6 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Altibbe?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform combines AI intelligence with transparency principles to deliver insights you can trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Our intelligent system generates personalized questions based on product categories and user responses for comprehensive analysis.",
                color: "text-primary",
                bgColor: "bg-primary/10"
              },
              {
                icon: ShieldCheck,
                title: "Verified Transparency",
                description: "Every report is generated using verified data sources and transparent methodology you can trust and understand.",
                color: "text-green-600",
                bgColor: "bg-green-50"
              },
              {
                icon: FileText,
                title: "Comprehensive Reports",
                description: "Generate detailed PDF reports with actionable insights, scores, and recommendations for informed decision-making.",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50"
              },
              {
                icon: Heart,
                title: "Health-Focused",
                description: "Our analysis prioritizes health impact and wellness factors to support your journey toward better living.",
                color: "text-red-500",
                bgColor: "bg-red-50"
              },
              {
                icon: Lock,
                title: "Secure & Private",
                description: "Your data is protected with enterprise-grade security. We never share personal information with third parties.",
                color: "text-purple-600",
                bgColor: "bg-purple-50"
              },
              {
                icon: Smartphone,
                title: "Mobile Responsive",
                description: "Access our platform seamlessly across all devices with a fully responsive design optimized for mobile use.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50"
              }
            ].map((feature, index) => (
              <Card key={index} className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`${feature.color} text-xl`} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple steps to get comprehensive product transparency insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Product Details",
                description: "Start by providing basic information about the product you want to analyze - name, brand, category, and description."
              },
              {
                step: "02", 
                title: "Answer AI Questions",
                description: "Our AI generates intelligent follow-up questions based on your product category and previous answers for deeper insights."
              },
              {
                step: "03",
                title: "Get Your Report",
                description: "Receive a comprehensive transparency report with scores, findings, and recommendations you can download as PDF."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Informed Decisions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start analyzing products with our AI-powered transparency platform today.
          </p>
          <Link href="/product-form">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold">
              <Search className="w-5 h-5 mr-2" />
              Start Your First Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
