import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Telescope, 
  PenTool, 
  Microscope, 
  Calendar,
  Users,
  Award,
  ExternalLink,
  CreditCard
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Campaign } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const getCampaignIcon = (type: string) => {
  switch (type) {
    case "asteroid_search":
      return <Telescope className="w-8 h-8" />;
    case "poetry":
      return <PenTool className="w-8 h-8" />;
    case "research":
      return <Microscope className="w-8 h-8" />;
    default:
      return <Telescope className="w-8 h-8" />;
  }
};

const Campaigns = () => {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });
  
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    grade: ""
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const enrollMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/campaigns/enroll", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You have successfully enrolled in the campaign.",
      });
      setIsDialogOpen(false);
      setRegistrationData({
        name: "",
        email: "",
        phone: "",
        school: "",
        grade: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
    },
    onError: (error: any) => {
      console.error("Campaign enrollment error:", error);
      
      // Handle authentication errors
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to register for campaigns.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleEnrollment = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };
  
  const handleSubmitEnrollment = async () => {
    if (!selectedCampaign) return;
    
    const enrollmentData = {
      campaignId: selectedCampaign.id,
      paymentAmount: 300,
      registrationData
    };
    
    enrollMutation.mutate(enrollmentData);
  };

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case "asteroid_search":
        return <Telescope className="w-6 h-6" />;
      case "poetry":
        return <PenTool className="w-6 h-6" />;
      case "research":
        return <Microscope className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getCampaignColor = (type: string) => {
    switch (type) {
      case "asteroid_search":
        return "text-cosmic-blue";
      case "poetry":
        return "text-cosmic-purple";
      case "research":
        return "text-cosmic-green";
      default:
        return "text-cosmic-blue";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-cosmic-green";
      case "closed":
        return "bg-cosmic-orange";
      case "completed":
        return "bg-space-500";
      default:
        return "bg-cosmic-blue";
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
              Active <span className="text-cosmic-blue">Campaigns</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Join groundbreaking research campaigns and contribute to real scientific discoveries
            </p>
          </div>

          {/* Featured Campaigns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {campaigns?.map((campaign) => (
              <Card key={campaign.id} className="bg-space-800/50 border-space-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-cosmic-blue">
                      {getCampaignIcon(campaign.type)}
                      <CardTitle className="text-2xl ml-3">{campaign.title}</CardTitle>
                    </div>
                    <Badge className={campaign.status === "active" ? "bg-cosmic-green text-space-900" : "bg-cosmic-orange text-space-900"}>
                      {campaign.status === "active" ? "Registration Open" : "Registration Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-space-300 mb-6">
                    {campaign.description}
                  </p>
                  
                  <div className="bg-space-800 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-space-400">Campaign Progress</span>
                      <span className="text-sm text-cosmic-green">Ongoing Registrations</span>
                    </div>
                    <Progress value={campaign.progress || 20} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cosmic-blue mb-1">₹{campaign.price}</div>
                      <div className="text-sm text-space-400">Registration Fee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cosmic-blue mb-1">Individual</div>
                      <div className="text-sm text-space-400">Enrollment Type</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-sm text-space-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-cosmic-blue font-semibold">
                      {campaign.partner}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-cosmic-blue hover:bg-blue-600"
                    onClick={() => handleEnrollment(campaign)}
                    disabled={campaign.status !== "active"}
                  >
                    {campaign.status === "active" ? `Register Now - ₹${campaign.price}` : "Registration Closed"}
                  </Button>
                </CardContent>
              </Card>
            ))}

          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">How Campaigns Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-6 text-center">
                <div className="w-16 h-16 bg-cosmic-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-space-900">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Register</h3>
                <p className="text-space-300">
                  Choose your campaign and complete the registration process with any required prerequisites
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <div className="w-16 h-16 bg-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-space-900">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Participate</h3>
                <p className="text-space-300">
                  Engage with expert mentors, collaborate with peers, and contribute to real scientific research
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <div className="w-16 h-16 bg-cosmic-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-space-900">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Achieve</h3>
                <p className="text-space-300">
                  Receive recognition, certificates, and potentially publish your work in scientific journals
                </p>
              </GlassMorphism>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassMorphism className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Student achiever" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Priya Patel</h4>
                    <p className="text-sm text-space-400">St. Xavier's School, Mumbai</p>
                  </div>
                </div>
                <Badge className="bg-cosmic-blue text-space-900 mb-3">Asteroid Discovery</Badge>
                <p className="text-space-300">
                  "I discovered asteroid 2024ZG15 through the campaign! It's incredible to have contributed to real space science."
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Student achiever" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Arjun Krishnan</h4>
                    <p className="text-sm text-space-400">DPS School, Delhi</p>
                  </div>
                </div>
                <Badge className="bg-cosmic-green text-space-900 mb-3">Research Publication</Badge>
                <p className="text-space-300">
                  "Published my first research paper on renewable energy optimization with Zoonigia's mentorship program."
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Student achiever" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sneha Reddy</h4>
                    <p className="text-sm text-space-400">Hyderabad Public School</p>
                  </div>
                </div>
                <Badge className="bg-cosmic-purple text-space-900 mb-3">Poetry Publication</Badge>
                <p className="text-space-300">
                  "My poem 'Dancing with the Stars' was selected for The Cosmic Voyage anthology. A dream come true!"
                </p>
              </GlassMorphism>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Make Your Mark?</h3>
              <p className="text-space-300 mb-6">
                Join our next campaign and contribute to groundbreaking research while building your academic portfolio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="cosmic-gradient hover:opacity-90 px-8">
                  View All Campaigns
                </Button>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8">
                  Learn More
                </Button>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-space-800 border-space-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-space-50">
              Register for {selectedCampaign?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-space-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-space-400">Registration Fee</span>
                <span className="text-lg font-bold text-cosmic-green">₹{selectedCampaign?.price}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-cosmic-blue" />
                <span className="text-sm text-space-300">Secure payment processing</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-space-300">Full Name</Label>
                <Input
                  id="name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  className="bg-space-700 border-space-600 text-space-50"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-space-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="bg-space-700 border-space-600 text-space-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-space-300">Phone</Label>
                <Input
                  id="phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  className="bg-space-700 border-space-600 text-space-50"
                  placeholder="Enter your phone"
                />
              </div>
              <div>
                <Label htmlFor="grade" className="text-space-300">Grade/Class</Label>
                <Input
                  id="grade"
                  value={registrationData.grade}
                  onChange={(e) => setRegistrationData({...registrationData, grade: e.target.value})}
                  className="bg-space-700 border-space-600 text-space-50"
                  placeholder="Enter your grade"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="school" className="text-space-300">School/Institution</Label>
              <Input
                id="school"
                value={registrationData.school}
                onChange={(e) => setRegistrationData({...registrationData, school: e.target.value})}
                className="bg-space-700 border-space-600 text-space-50"
                placeholder="Enter your school name"
              />
            </div>
            
            <div className="flex justify-between gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-space-600 text-space-300 hover:bg-space-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitEnrollment}
                disabled={enrollMutation.isPending || !registrationData.name || !registrationData.email}
                className="bg-cosmic-blue hover:bg-blue-600 text-white"
              >
                {enrollMutation.isPending ? "Processing..." : `Pay ₹${selectedCampaign?.price} & Register`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Campaigns;
