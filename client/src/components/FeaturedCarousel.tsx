import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Calendar, MapPin, Award, Users } from "lucide-react";
import type { Course, Campaign } from "@shared/schema";

interface FeaturedItemsResponse {
  courses: Course[];
  campaigns: Campaign[];
}

const FeaturedCarousel = () => {
  const { data, isLoading } = useQuery<FeaturedItemsResponse>({
    queryKey: ["/api/featured"],
  });

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
    <div className="relative py-16">
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

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {allFeaturedItems.map((item) => {
              const colors = getItemColor(item);
              const isCampaign = item.itemType === 'campaign';
              const linkHref = isCampaign ? `/campaigns/${item.id}` : `/courses/${item.id}`;

              return (
                <CarouselItem key={`${item.itemType}-${item.id}`} className="md:basis-1/2 lg:basis-1/3" data-testid={`featured-item-${item.itemType}-${item.id}`}>
                  <Card className={`glass-morphism border-2 ${colors.border} hover:border-cosmic-blue/50 transition-all h-full`}>
                    <CardContent className="p-0">
                      {item.imageUrl && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
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
                          {isCampaign && (item as Campaign).partner && (
                            <div className="flex items-center text-sm text-space-400">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{(item as Campaign).partner}</span>
                            </div>
                          )}
                          {isCampaign && (item as Campaign).startDate && (
                            <div className="flex items-center text-sm text-space-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {new Date((item as Campaign).startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                {(item as Campaign).endDate && ` - ${new Date((item as Campaign).endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                              </span>
                            </div>
                          )}
                          {!isCampaign && (item as Course).duration && (
                            <div className="flex items-center text-sm text-space-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{(item as Course).duration}</span>
                            </div>
                          )}
                          {isCampaign && (item as Campaign).targetParticipants && (
                            <div className="flex items-center text-sm text-space-400">
                              <Users className="w-4 h-4 mr-2" />
                              <span>{(item as Campaign).targetParticipants} participants</span>
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
                            className={`w-full ${colors.bg} border ${colors.border} hover:bg-cosmic-blue/20 transition-all`}
                            data-testid={`button-learn-more-${item.id}`}
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" data-testid="carousel-prev" />
          <CarouselNext className="hidden md:flex" data-testid="carousel-next" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
