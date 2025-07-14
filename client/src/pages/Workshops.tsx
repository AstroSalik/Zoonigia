import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Workshop } from "@shared/schema";

const Workshops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const { data: workshops, isLoading } = useQuery<Workshop[]>({
    queryKey: ["/api/workshops"],
  });

  const filteredWorkshops = workshops?.filter((workshop) => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || workshop.type === selectedType;
    const matchesLocation = selectedLocation === "all" || 
                           (selectedLocation === "virtual" && workshop.isVirtual) ||
                           (selectedLocation === "in-person" && !workshop.isVirtual);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const getWorkshopIcon = (type: string) => {
    switch (type) {
      case "telescope":
        return <Telescope className="w-5 h-5" />;
      case "vr":
        return <Headphones className="w-5 h-5" />;
      case "expert_session":
        return <Star className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getWorkshopColor = (type: string) => {
    switch (type) {
      case "telescope":
        return "text-cosmic-blue";
      case "vr":
        return "text-cosmic-purple";
      case "expert_session":
        return "text-cosmic-green";
      default:
        return "text-cosmic-blue";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              Immersive <span className="text-cosmic-blue">Workshops</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Experience hands-on learning through our immersive workshops featuring telescope sessions, VR experiences, expert speaker sessions, universe simulation, design thinking, and more
            </p>
          </div>

          {/* Filters */}
          <GlassMorphism className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
                <Input
                  placeholder="Search workshops..."
                  className="pl-10 bg-space-700 border-space-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Workshop Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="telescope">Telescope Sessions</SelectItem>
                  <SelectItem value="vr">VR Experiences</SelectItem>
                  <SelectItem value="expert_session">Expert Sessions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                Filter
              </Button>
            </div>
          </GlassMorphism>

          {/* Workshop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops?.map((workshop) => (
              <Card key={workshop.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
                <div className="relative">
                  <img 
                    src={workshop.imageUrl || "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"} 
                    alt={workshop.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold">
                    {workshop.isVirtual ? "Virtual" : "In-Person"}
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${getWorkshopColor(workshop.type)}`}>
                      {getWorkshopIcon(workshop.type)}
                      <CardTitle className="text-xl font-semibold ml-2">{workshop.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-space-300 mb-4">{workshop.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-space-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {workshop.startDate} - {workshop.endDate}
                    </div>
                    
                    {workshop.location && (
                      <div className="flex items-center text-sm text-space-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {workshop.location}
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-space-400">
                      <Users className="w-4 h-4 mr-2" />
                      {workshop.currentParticipants || 0} / {workshop.maxParticipants || 'Unlimited'} registered
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cosmic-blue">
                      ₹{workshop.price}
                    </span>
                    <Button className="bg-cosmic-blue hover:bg-blue-600">
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredWorkshops?.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-space-300 mb-4">No workshops found</h3>
              <p className="text-space-400 mb-8">Try adjusting your filters or search terms</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedLocation("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Can't find what you're looking for?</h3>
              <p className="text-space-300 mb-6">
                Contact us to discuss custom workshop options for your school or organization
              </p>
              <Button className="cosmic-gradient hover:opacity-90">
                Request Custom Workshop
              </Button>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Workshops;
