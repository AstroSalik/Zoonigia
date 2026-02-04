import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GlassMorphism from '@/components/GlassMorphism';
import { Sparkles, Target, Users, Rocket, Heart, Globe } from 'lucide-react';

const OurPledge: React.FC = () => {
  const pledges = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "To Make Exploration Boundless",
      description: "We believe that curiosity knows no limits. From the depths of science and technology to the expanses of philosophy and literature, we vow to create opportunities for discovery and learning.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "To Empower the Next Generation",
      description: "We pledge to equip young minds with the tools, knowledge, and opportunities they need to become leaders, thinkers, and changemakers in their fields.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "To Push the Frontiers of Innovation",
      description: "From space research to artificial intelligence, from STEAM education to real-world applications, Zoonigia is committed to breaking barriers and redefining possibilities.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "To Remain Ethical & Responsible",
      description: "Integrity is at the heart of everything we do. We pledge to uphold ethical innovation, sustainability, and inclusivity, ensuring that science and technology serve the greater good.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "To Collaborate & Build a Global Network",
      description: "We stand for collective progress—bridging gaps, fostering collaborations, and bringing together the best minds from across the world to solve challenges that impact us all.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-space-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic-blue/20 rounded-full mb-6 animate-fadeIn">
              <Sparkles className="w-5 h-5 text-cosmic-blue" />
              <span className="text-cosmic-blue font-semibold">Our Mission & Values</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-blue via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fadeIn">
              The Zoonigia Pledge
            </h1>
            
            <p className="text-xl text-space-300 mb-8 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              At Zoonigia, we are not just building an organization—we are pioneering a movement. A movement that dares to explore, innovate, and inspire. With every step we take, we commit ourselves to the pursuit of knowledge, the empowerment of minds, and the advancement of humanity.
            </p>
          </div>

          {/* Pledge Cards */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Our Pledge
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {pledges.map((pledge, index) => (
                <GlassMorphism
                  key={index}
                  className="p-6 hover:scale-105 transition-all duration-300 group"
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pledge.color} p-0.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-space-800 rounded-2xl flex items-center justify-center text-white">
                      {pledge.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cosmic-blue transition-colors">
                    {pledge.title}
                  </h3>
                  
                  <p className="text-space-300 leading-relaxed">
                    {pledge.description}
                  </p>
                </GlassMorphism>
              ))}
            </div>
          </div>

          {/* Who We Are Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <GlassMorphism className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
                Who We Are
              </h2>
              <p className="text-lg text-space-300 leading-relaxed mb-6">
                Our vibrant, privately held organization focuses on engagement and education. Our goal is to bring the marvels of the universe to communities and schools by providing engaging activities such as lectures, presentations, workshops, and compelling stargazing and planetary observation evenings.
              </p>
            </GlassMorphism>
          </div>

          {/* Our Approach Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <GlassMorphism className="p-8 md:p-12 bg-gradient-to-br from-space-800/50 to-cosmic-blue/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
                Our Approach
              </h2>
              <p className="text-lg text-space-300 leading-relaxed">
                Here at Zoonigia, we've set out to shed light and revolutionize how learners engage with frontier sciences, technology, and creativity, especially in the uncharted territory of the underprivileged regions. We want to show off the vastness of the universe in the beautiful lands where people don't know much about it. Our mission is to break barriers—geographical, intellectual, and financial—ensuring that every aspiring mind, especially in underrepresented regions, gain access to world-class opportunities. Our vibrant, privately held organization focuses on engagement and education. Our primary goal at this moment is to bring the marvels of the universe to communities and institutions by providing engaging activities such as lectures, presentations, workshops, and compelling stargazing and planetary observation evenings.
              </p>
            </GlassMorphism>
          </div>

          {/* Promise Section - Final CTA */}
          <div className="max-w-5xl mx-auto">
            <GlassMorphism className="p-8 md:p-12 text-center bg-gradient-to-r from-cosmic-blue/20 via-purple-500/20 to-pink-500/20 border-2 border-cosmic-blue/30">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cosmic-blue to-purple-500 mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-cosmic-blue to-purple-400 bg-clip-text text-transparent">
                Our Promise to the World
              </h2>
              
              <p className="text-xl text-white font-semibold mb-4 leading-relaxed">
                We are Zoonigia—driven by passion, fueled by purpose, and committed to shaping a future where knowledge is limitless, exploration is encouraged, and innovation transforms lives.
              </p>
              
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-cosmic-blue to-purple-500 rounded-full mb-6">
                <p className="text-lg font-bold text-white">
                  This is not just a pledge. This is our mission.
                </p>
              </div>
              
              <p className="text-xl text-space-100 mb-8">
                And we invite you to be a part of it. 🚀✨
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://chat.whatsapp.com/FKvscXisb9A99paGjqQSzR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full text-white font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                >
                  <Sparkles className="w-5 h-5" />
                  Join Our WhatsApp Community
                </a>
                
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cosmic-blue to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-white font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-cosmic-blue/50"
                >
                  <Heart className="w-5 h-5" />
                  Get Involved
                </a>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OurPledge;

