import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, Target, Award, Mail, ExternalLink } from "lucide-react";

const Collaborators = () => {
  const collaboratorTypes = [
    {
      title: "Research Partners",
      description: "Leading universities and research institutions advancing frontier sciences",
      icon: <Lightbulb className="w-6 h-6" />,
      benefits: ["Joint research projects", "Publication opportunities", "Grant applications", "Resource sharing"],
      examples: ["Universities", "Research Labs", "Scientific Institutes"]
    },
    {
      title: "Industry Partners", 
      description: "Technology companies and organizations driving innovation",
      icon: <Target className="w-6 h-6" />,
      benefits: ["Real-world applications", "Internship programs", "Technology access", "Career pathways"],
      examples: ["Space agencies", "Tech companies", "Engineering firms"]
    },
    {
      title: "Educational Partners",
      description: "Schools and educational organizations expanding frontier science access",
      icon: <Users className="w-6 h-6" />,
      benefits: ["Curriculum integration", "Teacher training", "Student programs", "Resource development"],
      examples: ["Schools", "Universities", "Learning centers"]
    },
    {
      title: "Content Creators",
      description: "Science communicators and educators creating engaging content",
      icon: <Award className="w-6 h-6" />,
      benefits: ["Content collaboration", "Platform promotion", "Revenue sharing", "Creative freedom"],
      examples: ["YouTubers", "Podcasters", "Writers", "Artists"]
    }
  ];

  const currentPartners = [
    {
      name: "NASA Collaboration",
      type: "Space Agency",
      description: "Joint asteroid search campaigns and educational programs",
      badge: "Active"
    },
    {
      name: "IASC Partnership",
      type: "Research Institute", 
      description: "International Astronomical Search Collaboration for student research",
      badge: "Active"
    },
    {
      name: "Educational Institutions",
      type: "Schools Network",
      description: "Growing network of schools implementing frontier science programs",
      badge: "Expanding"
    }
  ];

  return (
    <div className="min-h-screen bg-space-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join Our <span className="cosmic-gradient bg-clip-text text-transparent">Collaboration</span> Network
          </h1>
          <p className="text-xl text-space-300 mb-8 max-w-3xl mx-auto">
            Partner with Zoonigia to advance frontier science education and research. 
            Together, we're building the future of scientific discovery.
          </p>
          <Button 
            className="cosmic-gradient px-8 py-3 text-lg font-semibold hover:opacity-90 transition-opacity"
            onClick={() => window.location.href = 'mailto:partnerships@zoonigia.com'}
          >
            <Mail className="w-5 h-5 mr-2" />
            Start Partnership Discussion
          </Button>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphism className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Partners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {currentPartners.map((partner, index) => (
                <Card key={index} className="bg-space-800/50 border-space-700 hover:border-cosmic-blue/50 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{partner.name}</CardTitle>
                      <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                        {partner.badge}
                      </Badge>
                    </div>
                    <CardDescription className="text-space-300">
                      {partner.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-space-200">{partner.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </GlassMorphism>
        </div>
      </section>

      {/* Collaboration Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Collaboration Opportunities
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {collaboratorTypes.map((type, index) => (
              <GlassMorphism key={index} className="p-8 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <div className="cosmic-gradient p-3 rounded-lg mr-4">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{type.title}</h3>
                </div>
                <p className="text-space-300 mb-6">{type.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-space-200 flex items-center">
                        <div className="w-2 h-2 cosmic-gradient rounded-full mr-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <Badge key={idx} variant="outline" className="border-cosmic-blue/30 text-cosmic-blue">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlassMorphism>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassMorphism className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Partnership Process</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="cosmic-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Initial Discussion</h3>
                <p className="text-space-300">
                  Contact us to discuss your organization's goals and how we can collaborate effectively.
                </p>
              </div>
              
              <div className="text-center">
                <div className="cosmic-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Partnership Design</h3>
                <p className="text-space-300">
                  We'll work together to create a customized partnership that maximizes mutual benefits.
                </p>
              </div>
              
              <div className="text-center">
                <div className="cosmic-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Implementation</h3>
                <p className="text-space-300">
                  Launch our collaboration with ongoing support and regular progress evaluations.
                </p>
              </div>
            </div>
          </GlassMorphism>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassMorphism className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Collaborate?</h2>
            <p className="text-xl text-space-300 mb-8">
              Let's discuss how we can work together to advance frontier science education and research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="cosmic-gradient px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
                onClick={() => window.location.href = 'mailto:partnerships@zoonigia.com'}
              >
                <Mail className="w-5 h-5 mr-2" />
                partnerships@zoonigia.com
              </Button>
              <Button 
                variant="outline"
                className="border-cosmic-blue/50 text-cosmic-blue hover:bg-cosmic-blue/10"
                onClick={() => window.location.href = '/contact'}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                General Contact
              </Button>
            </div>
          </GlassMorphism>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collaborators;