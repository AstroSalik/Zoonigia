import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Telescope, 
  Microscope, 
  BookOpen, 
  Users, 
  Award,
  Rocket,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 text-space-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,20,147,0.2),transparent_50%)] pointer-events-none" />
      
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight">
                Explore the 
                <span className="cosmic-gradient bg-clip-text text-transparent"> Universe</span>
              </h1>
              <p className="text-xl text-space-300 leading-relaxed">
                Join Zoonigia's immersive space science education platform. Discover workshops, 
                collaborate with NASA on real research, and unlock your potential as a future space explorer.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="cosmic-gradient hover:opacity-90 px-8 py-6 text-lg font-semibold"
                onClick={() => window.location.href = '/api/login'}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <GlassMorphism className="p-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-space-800 border border-space-700">
                <iframe
                  src="https://www.youtube.com/embed/Tgr6BrgIBec"
                  title="Zoonigia Introduction Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Welcome to Zoonigia
                </h3>
                <p className="text-space-300">
                  Discover how we're revolutionizing space science education
                </p>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-space font-bold mb-4">
            What Makes Zoonigia Special
          </h2>
          <p className="text-xl text-space-300 max-w-3xl mx-auto">
            Experience cutting-edge space science education through hands-on workshops, 
            real research opportunities, and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassMorphism className="p-6 text-center">
            <Telescope className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Interactive Workshops</h3>
            <p className="text-space-300">
              Experience telescope observations, VR space missions, and expert-led sessions
            </p>
          </GlassMorphism>

          <GlassMorphism className="p-6 text-center">
            <Microscope className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">NASA Collaborations</h3>
            <p className="text-space-300">
              Participate in real asteroid discoveries and contribute to space research
            </p>
          </GlassMorphism>

          <GlassMorphism className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Structured Courses</h3>
            <p className="text-space-300">
              Master space science through comprehensive courses and certifications
            </p>
          </GlassMorphism>

          <GlassMorphism className="p-6 text-center">
            <Users className="w-12 h-12 text-cosmic-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-space-300">
              Connect with fellow space enthusiasts and expert mentors
            </p>
          </GlassMorphism>

          <GlassMorphism className="p-6 text-center">
            <Award className="w-12 h-12 text-cosmic-yellow mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Achievements</h3>
            <p className="text-space-300">
              Earn certificates and build your portfolio for future opportunities
            </p>
          </GlassMorphism>

          <GlassMorphism className="p-6 text-center">
            <Rocket className="w-12 h-12 text-cosmic-pink mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Career Preparation</h3>
            <p className="text-space-300">
              Develop skills for careers in space science and technology
            </p>
          </GlassMorphism>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <GlassMorphism className="p-8 max-w-3xl mx-auto">
            <Star className="w-16 h-16 text-cosmic-blue mx-auto mb-6" />
            <h3 className="text-3xl font-semibold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-space-300 mb-8 text-lg">
              Join thousands of students already exploring the cosmos with Zoonigia
            </p>
            <Button 
              className="cosmic-gradient hover:opacity-90 px-12 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/api/login'}
            >
              Sign Up Now
            </Button>
          </GlassMorphism>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;