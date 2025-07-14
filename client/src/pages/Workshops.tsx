import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, ChevronRight, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Registration form schema
const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  age: z.string().min(1, "Age is required"),
  organization: z.string().optional(),
  experience: z.string().min(1, "Please select your experience level"),
  interests: z.string().min(10, "Please tell us about your interests"),
  workshopType: z.string().min(1, "Please select a workshop type"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Workshops = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      organization: "",
      experience: "",
      interests: "",
      workshopType: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await apiRequest("POST", "/api/workshops/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "We'll contact you soon with workshop details.",
      });
      form.reset();
      setIsDialogOpen(false);
      setSelectedWorkshop(null);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registrationMutation.mutate(data);
  };

  const handleRegister = (workshopId: string) => {
    setSelectedWorkshop(workshopId);
    form.setValue("workshopType", workshopId);
    setIsDialogOpen(true);
  };

  // Workshop offerings data
  const workshopOfferings = [
    {
      id: "telescope",
      title: "Telescope Sessions",
      description: "Explore the cosmos through professional-grade telescopes with expert guidance",
      icon: <Telescope className="w-8 h-8" />,
      color: "cosmic-blue",
      features: [
        "Professional telescope operation",
        "Celestial object identification",
        "Astrophotography basics",
        "Star chart navigation",
        "Real-time sky observations"
      ],
      duration: "3-4 hours",
      groupSize: "8-12 participants",
      difficulty: "Beginner to Advanced",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "vr",
      title: "VR Space Experiences",
      description: "Immerse yourself in virtual reality journeys through space and time",
      icon: <Headphones className="w-8 h-8" />,
      color: "cosmic-purple",
      features: [
        "Virtual space station tours",
        "Planet surface exploration",
        "Historical space missions",
        "Interactive solar system",
        "Asteroid field navigation"
      ],
      duration: "2-3 hours",
      groupSize: "6-10 participants",
      difficulty: "All levels",
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "expert",
      title: "Expert Speaker Sessions",
      description: "Learn from renowned astronomers, physicists, and space industry professionals",
      icon: <Mic className="w-8 h-8" />,
      color: "cosmic-green",
      features: [
        "Live Q&A with experts",
        "Career guidance in astronomy",
        "Latest space discoveries",
        "Research methodology",
        "Industry insights"
      ],
      duration: "1-2 hours",
      groupSize: "20-50 participants",
      difficulty: "All levels",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "simulation",
      title: "Universe Simulation",
      description: "Experience advanced computer simulations of cosmic phenomena",
      icon: <Monitor className="w-8 h-8" />,
      color: "cosmic-orange",
      features: [
        "Black hole simulations",
        "Galaxy formation models",
        "Planetary system dynamics",
        "Gravitational wave visualization",
        "Dark matter interactions"
      ],
      duration: "2-3 hours",
      groupSize: "10-15 participants",
      difficulty: "Intermediate to Advanced",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "design",
      title: "Design Thinking",
      description: "Apply design thinking principles to solve space exploration challenges",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "cosmic-pink",
      features: [
        "Problem identification",
        "Creative brainstorming",
        "Prototype development",
        "User experience design",
        "Innovation methodologies"
      ],
      duration: "4-5 hours",
      groupSize: "8-12 participants",
      difficulty: "All levels",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "mission",
      title: "Space Mission Planning",
      description: "Design and plan your own space missions with professional tools",
      icon: <Rocket className="w-8 h-8" />,
      color: "cosmic-red",
      features: [
        "Mission objective setting",
        "Spacecraft design basics",
        "Trajectory planning",
        "Budget considerations",
        "Risk assessment"
      ],
      duration: "3-4 hours",
      groupSize: "6-10 participants",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-space font-bold mb-4">
                Immersive <span className="text-cosmic-blue">Workshops</span>
              </h1>
              <p className="text-xl md:text-2xl text-space-200 max-w-4xl mx-auto">
                Experience hands-on learning through our comprehensive workshops featuring telescope sessions, VR experiences, expert speaker sessions, universe simulation, design thinking, and space mission planning
              </p>
            </div>
            <div className="flex justify-center items-center gap-4 text-space-300 mb-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Interactive Learning</span>
              </div>
              <div className="w-1 h-1 bg-space-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Flexible Duration</span>
              </div>
              <div className="w-1 h-1 bg-space-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Expert Guidance</span>
              </div>
            </div>
            
            <div className="bg-space-800/30 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-cosmic-blue mb-2">Eligibility</h3>
              <p className="text-space-300">
                Workshops are typically designed for students from Class 5 onwards. Schools can request workshops for lower classes based on specific requirements and content adaptation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-cosmic-blue hover:bg-cosmic-blue/80 text-space-50 px-8 py-3 text-lg"
              >
                Register for Workshop
              </Button>
              <Button 
                variant="outline" 
                className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-3 text-lg"
              >
                Contact for Details
              </Button>
            </div>
          </div>

          {/* Workshop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {workshopOfferings.map((workshop) => (
              <Card key={workshop.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={workshop.image} 
                    alt={workshop.title}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-900/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <div className={`bg-${workshop.color} p-1.5 rounded-full`}>
                      <div className="w-5 h-5 text-white flex items-center justify-center">
                        {workshop.icon}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-space-700/80 text-xs">
                      {workshop.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-space-50">{workshop.title}</CardTitle>
                  <p className="text-space-300 text-sm">{workshop.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-cosmic-blue" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-cosmic-green" />
                        <span>{workshop.groupSize}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-space-200 text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {workshop.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-space-300">
                            <Check className="w-2.5 h-2.5 text-cosmic-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <GlassMorphism className="p-8 text-center">
            <h2 className="text-2xl font-space font-bold mb-4">
              Ready to Explore the <span className="text-cosmic-blue">Universe</span>?
            </h2>
            <p className="text-lg text-space-200 mb-6 max-w-2xl mx-auto">
              Join our immersive workshops and embark on a journey through space science education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-cosmic-blue hover:bg-cosmic-blue/80 text-space-50 px-8 py-3"
              >
                Register for Workshop
              </Button>
              <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-3">
                Contact for Details
              </Button>
            </div>
          </GlassMorphism>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-space-800 border-space-700 text-space-50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-space">Register for Workshop</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your age" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="School, company, or organization" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-space-700 border-space-600">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workshopType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workshop Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-space-700 border-space-600">
                          <SelectValue placeholder="Select workshop type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="telescope">Telescope Sessions</SelectItem>
                        <SelectItem value="vr">VR Space Experiences</SelectItem>
                        <SelectItem value="expert">Expert Speaker Sessions</SelectItem>
                        <SelectItem value="simulation">Universe Simulation</SelectItem>
                        <SelectItem value="design">Design Thinking</SelectItem>
                        <SelectItem value="mission">Space Mission Planning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests & Goals</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your interests in space science and what you hope to learn"
                        {...field} 
                        className="bg-space-700 border-space-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80 text-space-50"
                disabled={registrationMutation.isPending}
              >
                {registrationMutation.isPending ? "Submitting..." : "Register Now"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Workshops;