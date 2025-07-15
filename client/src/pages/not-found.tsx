import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="min-h-screen w-full flex items-center justify-center">
            <Card className="w-full max-w-md mx-4 bg-space-800/50 border-space-700">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="flex justify-center mb-6">
                  <Rocket className="h-16 w-16 text-cosmic-blue" />
                </div>
                <h1 className="text-4xl font-space font-bold text-space-50 mb-4">404</h1>
                <h2 className="text-xl font-semibold text-space-200 mb-4">Page Not Found</h2>
                <p className="text-space-300 mb-6">
                  This page seems to have drifted into deep space. Let's get you back on course.
                </p>
                <Link href="/">
                  <Button className="cosmic-gradient hover:opacity-90 px-6 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
