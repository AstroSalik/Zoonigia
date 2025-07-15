import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Rocket, 
  Heart, 
  Target, 
  Users, 
  BookOpen,
  Telescope,
  Microscope,
  Globe
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-space-900 via-space-800 to-space-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-space font-bold mb-6">
              <span className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
                About Zoonigia
              </span>
            </h1>
            <p className="text-xl text-space-200 mb-8">
              Empowering future innovators and explorers through immersive science education
            </p>
            <div className="flex justify-center">
              <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                <Link href="/register">Join Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-space font-bold mb-6">Discover Zoonigia</h2>
            <p className="text-xl text-space-200 mb-8">
              Watch our introduction video to learn more about our mission and innovative approach to frontier sciences education
            </p>
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-space-800">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Tgr6BrgIBec"
                title="What is Zoonigia - Frontier Sciences Education Platform"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <GlassMorphism className="p-8">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-cosmic-blue mr-4" />
                <h2 className="text-3xl font-space font-bold">Our Mission</h2>
              </div>
              <p className="text-space-200 text-lg leading-relaxed">
                To revolutionize science education by making complex concepts accessible, engaging, and inspiring 
                for students of all ages. We believe that hands-on learning and immersive experiences unlock 
                the potential for scientific discovery and innovation.
              </p>
            </GlassMorphism>
            
            <GlassMorphism className="p-8">
              <div className="flex items-center mb-6">
                <Rocket className="w-8 h-8 text-cosmic-purple mr-4" />
                <h2 className="text-3xl font-space font-bold">Our Vision</h2>
              </div>
              <p className="text-space-200 text-lg leading-relaxed">
                To create a world where every student has access to world-class science education, 
                fostering the next generation of scientists, engineers, and innovators who will 
                shape our future and explore the cosmos.
              </p>
            </GlassMorphism>
          </div>
        </div>
      </section>



      {/* What We Do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Telescope className="w-12 h-12 text-cosmic-blue mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Immersive Workshops</h3>
                <p className="text-space-300">
                  Interactive workshops featuring telescope sessions, VR experiences, 
                  expert speakers, universe simulations, and design thinking activities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-cosmic-purple mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Comprehensive Courses</h3>
                <p className="text-space-300">
                  Structured learning programs in Basic Astronomy, Robotics & AI, 
                  Astronomy & AI, and Quantum Mechanics for all skill levels.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-cosmic-green mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Global Campaigns</h3>
                <p className="text-space-300">
                  Collaborative research projects including NASA asteroid searches, 
                  star sessions, and scientific research publication opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cosmic-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-space-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion for Learning</h3>
              <p className="text-space-300">
                We believe that curiosity and wonder are the foundations of scientific discovery.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-space-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusive Education</h3>
              <p className="text-space-300">
                Science education should be accessible to all, regardless of background or location.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cosmic-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Microscope className="w-8 h-8 text-space-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hands-On Innovation</h3>
              <p className="text-space-300">
                Real learning happens through experimentation, exploration, and creative problem-solving.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-space font-bold mb-6">Ready to Join Our Mission?</h2>
            <p className="text-xl text-space-200 mb-8">
              Be part of a community that's pushing the boundaries of science education and inspiring the next generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                <Link href="/register">Get Started Today</Link>
              </Button>
              <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-4 text-lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;