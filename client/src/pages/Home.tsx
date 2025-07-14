import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero3D from "@/components/Hero3D";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Rocket, 
  Users, 
  School, 
  Microscope, 
  Play, 
  ChevronDown,
  Star,
  Telescope,
  Headphones
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden star-field">
        <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900"></div>
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
            alt="Deep space with stars and nebula" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <Hero3D />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-space font-bold mb-6 animate-fadeIn">
            <span className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
              To The Stars
            </span>
            <br />
            <span className="text-space-50">And Beyond</span>
          </h1>
          <p className="text-xl md:text-2xl text-space-200 mb-8 animate-slideUp">
            Empowering Future Innovators and Explorers through Immersive Science Education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
            <Link href="/workshops">
              <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                <Rocket className="w-5 h-5 mr-2" />
                Explore Zoonigia
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="glass-morphism border-space-600 hover:bg-white/20 px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cosmic-blue" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-space-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-blue mb-2">2,500+</div>
              <div className="text-space-300">Students Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-purple mb-2">150+</div>
              <div className="text-space-300">Schools Partnered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-green mb-2">50+</div>
              <div className="text-space-300">Workshops Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-orange mb-2">12</div>
              <div className="text-space-300">Global Collaborations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="py-20 bg-gradient-to-br from-space-900 via-space-800 to-space-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cosmic-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cosmic-purple rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl md:text-4xl font-space italic text-cosmic-blue mb-6 leading-relaxed">
                "Astronomy is what leads a lost spirit beyond the horizons to the road of being acquainted with thyself."
              </blockquote>
              <div className="w-24 h-1 bg-gradient-to-r from-cosmic-blue to-cosmic-purple mx-auto mb-4"></div>
              <p className="text-xl text-space-300 font-medium">
                Salik Riyaz, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassMorphism className="p-6 hover:bg-white/20 transition-colors group">
              <div className="text-center">
                <Users className="w-12 h-12 text-cosmic-blue mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Register for Workshop</h3>
                <p className="text-space-300 mb-4">Join our immersive workshops and experience hands-on learning</p>
                <Link href="/workshops">
                  <Button className="bg-cosmic-blue hover:bg-blue-600">
                    Browse Workshops
                  </Button>
                </Link>
              </div>
            </GlassMorphism>
            
            <GlassMorphism className="p-6 hover:bg-white/20 transition-colors group">
              <div className="text-center">
                <School className="w-12 h-12 text-cosmic-purple mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Book School Workshop</h3>
                <p className="text-space-300 mb-4">Bring Zoonigia's expertise directly to your institution</p>
                <Link href="/schools">
                  <Button className="bg-cosmic-purple hover:bg-purple-600">
                    Book Now
                  </Button>
                </Link>
              </div>
            </GlassMorphism>
            
            <GlassMorphism className="p-6 hover:bg-white/20 transition-colors group">
              <div className="text-center">
                <Microscope className="w-12 h-12 text-cosmic-green mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Enroll in Labs</h3>
                <p className="text-space-300 mb-4">Access real-time research labs and hands-on experiments</p>
                <Button className="bg-cosmic-green hover:bg-green-600 opacity-60" disabled>
                  Coming April 2025
                </Button>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Basic astronomy course with telescope observations" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 bg-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Telescope className="w-5 h-5 text-cosmic-blue mr-2" />
                  <h3 className="text-xl font-semibold">Basic Astronomy</h3>
                </div>
                <p className="text-space-300 mb-4">Comprehensive introduction to astronomy and space science</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-blue">₹1,200 per student</span>
                  <span className="text-sm text-space-400">6 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-blue hover:bg-blue-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Robotics and AI course with hands-on projects" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Headphones className="w-5 h-5 text-cosmic-purple mr-2" />
                  <h3 className="text-xl font-semibold">Robotics & AI</h3>
                </div>
                <p className="text-space-300 mb-4">Build intelligent systems and explore artificial intelligence</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-purple">₹2,500 per student</span>
                  <span className="text-sm text-space-400">8 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-purple hover:bg-purple-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Quantum mechanics course with advanced physics" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-cosmic-green mr-2" />
                  <h3 className="text-xl font-semibold">Quantum Mechanics</h3>
                </div>
                <p className="text-space-300 mb-4">Explore the fundamental principles of quantum physics</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-green">₹3,000 per student</span>
                  <span className="text-sm text-space-400">10 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-green hover:bg-green-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-space font-bold mb-6">Ready to Explore the Universe?</h2>
            <p className="text-xl text-space-200 mb-8">
              Join thousands of students and educators who are already discovering the wonders of science with Zoonigia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/workshops">
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-4 text-lg">
                  View All Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
