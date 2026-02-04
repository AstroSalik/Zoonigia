import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Calendar, MapPin, Award, Users, School, ChevronLeft, ChevronRight } from "lucide-react";
import type { Course, Campaign } from "@shared/schema";
import { useRef } from "react";

interface FeaturedItemsResponse {
  courses: Course[];
  campaigns: Campaign[];
}

const FeaturedCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery<FeaturedItemsResponse>({
    queryKey: ["/api/featured"],
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
      </div>
    );
  }

  const allFeaturedItems = [
    ...(data?.campaigns || []).map(item => ({ ...item, itemType: 'campaign' as const })),
    ...(data?.courses || []).map(item => ({ ...item, itemType: 'course' as const }))
  ].sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

  if (allFeaturedItems.length === 0) {
    return null;
  }

  const getItemColor = (item: typeof allFeaturedItems[0]) => {
    if (item.itemType === 'campaign') {
      return {
        bg: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20',
        border: 'border-purple-500/30',
        text: 'text-purple-300',
        badge: 'bg-purple-500/20 text-purple-300',
      };
    } else {
      const field = (item as Course).field;
      switch (field) {
        case 'quantum_mechanics':
          return { bg: 'bg-quantum-purple/10', border: 'border-quantum-purple/30', text: 'text-quantum-purple', badge: 'bg-quantum-purple/20 text-quantum-purple' };
        case 'tech_ai':
          return { bg: 'bg-tech-green/10', border: 'border-tech-green/30', text: 'text-tech-green', badge: 'bg-tech-green/20 text-tech-green' };
        case 'astrophysics':
          return { bg: 'bg-cosmic-blue/10', border: 'border-cosmic-blue/30', text: 'text-cosmic-blue', badge: 'bg-cosmic-blue/20 text-cosmic-blue' };
        default:
          return { bg: 'bg-space-700/50', border: 'border-space-600', text: 'text-space-200', badge: 'bg-space-600/20 text-space-200' };
      }
    }
  };

  return (
    <div className="relative py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-8 h-8 text-cosmic-blue mr-3" />
          <h2 className="text-3xl md:text-4xl font-space font-bold text-center">
            Featured Programs
          </h2>
        </div>
        <p className="text-center text-space-200 text-lg mb-12 max-w-2xl mx-auto">
          Discover our handpicked selection of exceptional learning experiences and innovation challenges
        </p>

        <div className="relative w-full max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full bg-space-800/80 border border-space-600 hover:bg-space-700 hover:border-cosmic-blue transition-all shadow-lg backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-cosmic-blue" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full bg-space-800/80 border border-space-600 hover:bg-space-700 hover:border-cosmic-blue transition-all shadow-lg backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-cosmic-blue" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allFeaturedItems.map((item) => {
              const colors = getItemColor(item);
              const isCampaign = item.itemType === 'campaign';
              const linkHref = isCampaign ? `/campaigns/${item.id}` : `/courses/${item.id}`;

              return (
                <div 
                  key={`${item.itemType}-${item.id}`} 
                  className="flex-none w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] snap-start"
                  data-testid={`featured-item-${item.itemType}-${item.id}`}
                >
                  <Card className={`glass-morphism border-2 ${colors.border} hover:border-cosmic-blue/50 transition-all h-full`}>
                    <CardContent className="p-0">
                      {item.imageUrl && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg bg-space-800">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback image if loading fails
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
                            }}
                          />
                          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${colors.badge} backdrop-blur-sm text-sm font-medium flex items-center gap-1`}>
                            <Sparkles className="w-4 h-4" />
                            Featured
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2" data-testid={`featured-title-${item.id}`}>{item.title}</h3>
                        <p className="text-space-300 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {isCampaign && (item as any).location && (
                            <div className="flex items-center text-sm text-space-400">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{(item as any).location}</span>
                            </div>
                          )}
                          {isCampaign && (item as Campaign).duration && (
                            <div className="flex items-center text-sm text-space-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{(item as Campaign).duration}</span>
                            </div>
                          )}
                          {!isCampaign && (item as Course).duration && (
                            <div className="flex items-center text-sm text-space-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{(item as Course).duration}</span>
                            </div>
                          )}
                          {item.price && parseFloat(item.price) > 0 ? (
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 mr-2 text-yellow-500" />
                              <span className={colors.text}>₹{item.price}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 mr-2 text-green-500" />
                              <span className="text-green-400">FREE</span>
                            </div>
                          )}
                        </div>

                        <Link href={linkHref}>
                          <Button 
                            className="w-full bg-cosmic-blue hover:bg-blue-600 transition-all"
                            data-testid={`button-learn-more-${item.id}`}
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
            
            {/* Workshop Registration */}
            <div className="flex-none w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] snap-start">
              <Card className="glass-morphism border-2 border-cosmic-blue/30 hover:border-cosmic-blue/50 transition-all h-full">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg bg-space-800">
                    <img
                      src="/stock_images/students_workshop_ha_74353f01.jpg"
                      alt="Workshop Registration"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cosmic-blue/20 text-cosmic-blue backdrop-blur-sm text-sm font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Workshops
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Workshop Registration</h3>
                    <p className="text-space-300 mb-4">Join our immersive workshops exploring frontier sciences through hands-on discovery</p>
                    <Link href="/workshops" className="w-full">
                      <Button className="w-full bg-cosmic-blue hover:bg-blue-600">
                        Register Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
