import { Button } from "@/components/ui/button";
import { ChevronDown, Twitter, Facebook, Instagram } from "lucide-react";

export default function StellanHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-blue-900/60 to-space-900/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Cosmic particles overlay */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Social Icons - Left Side */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col gap-6">
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Navigation Dots - Right Side */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col gap-4">
          <div className="text-right">
            <span className="text-white text-sm font-medium">01</span>
            <span className="text-white/50 text-sm ml-2">/ 03</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-2 h-8 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Large STELLAN Title */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-bold text-white/20 tracking-wider animate-stellan-glow">
                STELLAN
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide">
                EXPLORING THE GALAXY
              </h2>
              
              {/* Description */}
              <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-md">
                We are committed to advancing the future of deep space travel to the farthest reaches of our solar system.
              </p>
            </div>
            
            {/* CTA Button */}
            <div>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white hover:text-space-900 bg-transparent px-8 py-3 text-lg font-medium tracking-wide transition-all duration-300"
                onClick={() => {
                  document.querySelector('#quick-actions')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                DISCOVER
              </Button>
            </div>
          </div>

          {/* Right Side - Astronaut Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Astronaut silhouette */}
              <img 
                src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Astronaut exploring space" 
                className="w-80 lg:w-96 h-auto object-contain filter contrast-125 brightness-110"
              />
              
              {/* Glow effect around astronaut */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-2xl scale-110"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>

      {/* Planet/Moon in background */}
      <div className="absolute bottom-0 right-0 w-64 h-64 lg:w-80 lg:h-80 opacity-20">
        <div className="w-full h-full bg-gradient-radial from-blue-400/30 via-purple-400/20 to-transparent rounded-full blur-xl"></div>
      </div>
    </section>
  );
}