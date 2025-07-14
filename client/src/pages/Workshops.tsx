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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, ChevronRight, Check, Mail, Phone, Building, Globe } from "lucide-react";
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
  organization: z.string().optional(),
  experience: z.string().min(1, "Please select your experience level"),
  interests: z.string().min(10, "Please tell us about your interests"),
  requestLowerClass: z.boolean().default(false),
  contactMethod: z.string().min(1, "Please select preferred contact method"),
  workshopType: z.enum(["campus", "community"], {
    required_error: "Please select workshop type",
  }),
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
      organization: "",
      experience: "",
      interests: "",
      requestLowerClass: false,
      contactMethod: "",
      workshopType: "community",
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

      difficulty: "Beginner to Advanced",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
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

      difficulty: "All levels",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
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

      difficulty: "All levels",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
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
                onClick={() => window.location.href = '/contact'}
              >
                Contact for Details
              </Button>
            </div>
          </div>

          {/* Workshop Overview Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-space font-bold mb-4">
              The <span className="text-cosmic-blue">Ultimate</span> Workshop Experience
            </h2>
            <p className="text-xl text-space-200 max-w-4xl mx-auto">
              All the activities below are delivered in a single comprehensive workshop session, making it the most complete space science education experience available
            </p>
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

          {/* School Partnership Information */}
          <GlassMorphism className="p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-space font-bold mb-4">
                <span className="text-cosmic-green">School Partnership</span> Benefits
              </h2>
              <p className="text-lg text-space-200 max-w-3xl mx-auto">
                Educational institutions earn 10-20% revenue share from workshops hosted at their campus
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl font-bold text-cosmic-green">10-20%</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Revenue Share</h3>
                <p className="text-space-300 text-sm">
                  Schools receive a percentage of workshop revenue based on participation and hosting
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-cosmic-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Campus Workshops</h3>
                <p className="text-space-300 text-sm">
                  Host exclusive workshops on your campus with customized content for your students
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-cosmic-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Community Access</h3>
                <p className="text-space-300 text-sm">
                  Open workshops to your local community and increase engagement opportunities
                </p>
              </div>
            </div>
          </GlassMorphism>

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
              <Button 
                variant="outline" 
                className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-3"
                onClick={() => window.location.href = '/contact'}
              >
                Contact for Details
              </Button>
            </div>
          </GlassMorphism>
        </div>
      </div>
      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-space-800 border-space-700 text-space-50 max-w-md max-h-[90vh] overflow-y-auto">
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
                name="requestLowerClass"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-space-600 bg-space-700/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-2 border-white bg-space-800 data-[state=checked]:bg-cosmic-blue data-[state=checked]:border-cosmic-blue data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Request for Lower Classes
                      </FormLabel>
                      <p className="text-xs text-space-300">
                        Check this if you need workshops adapted for students below Class 5. Content will be modified based on age group.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-space-700 border-space-600">
                          <SelectValue placeholder="How would you like us to contact you?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Call
                          </div>
                        </SelectItem>
                        <SelectItem value="both">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <Phone className="w-4 h-4" />
                            Either Email or Phone
                          </div>
                        </SelectItem>
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
              
              <div className="bg-space-700/50 p-4 rounded-lg border border-space-600">
                <h4 className="font-semibold text-space-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cosmic-blue" />
                  Next Steps
                </h4>
                <p className="text-xs text-space-300">After registration, our team will contact you within 48 hours to discuss workshop details, scheduling, and any specific requirements you may have.</p>
              </div>
              
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