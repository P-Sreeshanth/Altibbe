import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DemoBanner() {
  // Only show on static hosting
  const isStatic = window.location.hostname.includes('github.io') || 
                   window.location.hostname.includes('netlify.app') ||
                   window.location.hostname.includes('vercel.app');

  if (!isStatic) return null;

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> This is a demonstration version running on GitHub Pages. 
        AI features use sample data to showcase the platform capabilities. 
        For full functionality with real AI analysis, deploy with a backend server.
      </AlertDescription>
    </Alert>
  );
}