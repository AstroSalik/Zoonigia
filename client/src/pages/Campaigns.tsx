import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Telescope, 
  PenTool, 
  Microscope, 
  Calendar,
  Users,
  Award,
  ExternalLink,
  CreditCard,
  Mail,
  Phone
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Campaign } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
console.log('Stripe public key found:', import.meta.env.VITE_STRIPE_PUBLIC_KEY?.substring(0, 20) + '...');
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment Form Component
const PaymentForm = ({ 
  selectedCampaign, 
  registrationData, 
  onSuccess, 
  onCancel 
}: {
  selectedCampaign: Campaign;
  registrationData: any;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Stripe setup:", { stripe: !!stripe, elements: !!elements });
    if (stripe && elements) {
      setIsLoading(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/campaigns?success=true`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-space-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-space-400">Campaign Registration</span>
          <span className="text-lg font-bold text-cosmic-green">₹{selectedCampaign.price}</span>
        </div>
        <div className="text-sm text-space-300">
          {selectedCampaign.title}
        </div>
      </div>

      <div className="bg-space-700 p-4 rounded-lg">
        <div className="text-sm text-space-300 mb-4">Payment Details</div>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-blue"></div>
            <span className="ml-2 text-space-300">Loading payment form...</span>
          </div>
        ) : (
          <PaymentElement 
            options={{
              layout: "tabs"
            }}
          />
        )}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="border-space-600 text-space-300 hover:bg-space-700"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || isProcessing || isLoading}
          className="bg-cosmic-blue hover:bg-blue-600 text-white"
        >
          {isProcessing ? "Processing..." : isLoading ? "Loading..." : `Pay ₹${selectedCampaign.price}`}
        </Button>
      </div>
    </form>
  );
};

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
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create payment intent mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaigns/create-payment-intent", data);
      return await response.json();
    },
    onSuccess: (data) => {
      console.log('Payment intent created successfully:', data);
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    },
    onError: (error: any) => {
      console.error("Payment intent creation error:", error);
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
        title: "Payment Setup Failed",
        description: "Unable to set up payment. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const enrollMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaigns/enroll", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You have successfully enrolled in the campaign.",
      });
      setIsDialogOpen(false);
      setShowPayment(false);
      setClientSecret("");
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
    setShowPayment(false);
    setClientSecret("");
  };
  
  const handleSubmitEnrollment = async () => {
    if (!selectedCampaign) return;
    
    console.log('Creating payment intent for campaign:', selectedCampaign.id, 'Amount:', selectedCampaign.price);
    // Create payment intent first
    createPaymentMutation.mutate({
      campaignId: selectedCampaign.id,
      paymentAmount: parseFloat(selectedCampaign.price)
    });
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
    
    // Complete the enrollment
    enrollMutation.mutate({
      campaignId: selectedCampaign?.id,
      paymentIntentId: clientSecret?.split('_secret_')[0],
      registrationData
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setClientSecret("");
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
              Join groundbreaking research campaigns and contribute to real scientific discoveries that advance our understanding of the universe
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
                    <Badge className={
                      campaign.status === "upcoming" ? "bg-cosmic-yellow text-space-900" :
                      campaign.status === "active" ? "bg-cosmic-green text-space-900" : 
                      "bg-cosmic-orange text-space-900"
                    }>
                      {campaign.status === "upcoming" ? "Coming Soon" :
                       campaign.status === "active" ? "Registration Open" : 
                       "Registration Closed"}
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
                      <span className={`text-sm ${
                        campaign.status === "upcoming" ? "text-cosmic-yellow" :
                        campaign.status === "active" ? "text-cosmic-green" :
                        "text-cosmic-orange"
                      }`}>
                        {campaign.status === "upcoming" ? "Upcoming" :
                         campaign.status === "active" ? "Ongoing Registrations" :
                         "Registration Closed"}
                      </span>
                    </div>
                    <Progress value={campaign.progress || 20} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cosmic-blue mb-1">
                        {campaign.price && parseFloat(campaign.price) > 0 ? `₹${campaign.price}` : 'FREE'}
                      </div>
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
                  
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button 
                      className="w-full bg-cosmic-blue hover:bg-blue-600"
                      disabled={campaign.status !== "active"}
                    >
                      {campaign.status === "upcoming" ? "Registrations Open Soon" :
                       campaign.status === "active" ? `Register Now - ${campaign.price && parseFloat(campaign.price) > 0 ? `₹${campaign.price}` : 'FREE'}` : 
                       "Registration Closed"}
                    </Button>
                  </Link>
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

          {/* Community Voice */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Community Voice</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassMorphism className="p-8">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 rounded-full bg-cosmic-blue/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-cosmic-blue font-bold text-2xl">AG</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-space-50">Aayushmaan Gupta</h3>
                  </div>
                </div>
                <p className="text-space-200 leading-relaxed italic">
                  "Zoonigia's commitment to making science accessible, fostering a supportive work environment, and valuing its contributors' input across disciplines, as well as providing great chances for professional and personal development, makes it an outstanding platform. A major highlight was my successful participation in the Zoonigia Asteroid Search Campaign (ZASC), where I dealt with real data from NASA's International Asteroid Search Campaign (IASC) to make successful findings, learning about how real observational astronomers work, and gaining experience as well. This hands-on experience, facilitated by Zoonigia, was invaluable for me, as this was my first ever opportunity to work in my field of passion. Beyond the campaigns, my growth has been exponential. Being appointed as the admin of the Astronomy group has allowed me to learn extensively in my field, including other fields such as physics, literature, and philosophy, thanks to the diverse educational focus of the community. As a scriptwriter in the content creation team, I have genuinely enjoyed my work. The collaborative environment is excellent; my colleagues are incredibly helpful and supportive, making the work not just productive but a pleasure. My time at Zoonigia has been absolutely transformative, combining my passion for astronomy with a deep dive into content creation."
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-8">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 rounded-full bg-cosmic-green/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-cosmic-green font-bold text-2xl">MF</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-space-50">Maheera Fatima</h3>
                  </div>
                </div>
                <p className="text-space-200 leading-relaxed italic">
                  "Being part of the Zoonigia Asteroid Search Campaign (ZASC) was such a cool experience. Zoonigia is an amazing platform that connects students and space enthusiasts with real research opportunities. I got to work with real telescope data, look for asteroids, and learn how actual space discoveries happen. It was exciting, crazy, and made me even more interested in space and astronomy."
                </p>
              </GlassMorphism>
            </div>
          </div>

          {/* Campaign Contact Section */}
          <div className="mb-16">
            <GlassMorphism className="p-8 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-semibold mb-4">Need Help with Campaigns?</h3>
              <p className="text-space-300 mb-6">
                Have questions about our campaigns or need assistance with registration? Contact our campaign team directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-cosmic-blue hover:bg-blue-600 px-8"
                  onClick={() => window.location.href = 'mailto:campaigns@zoonigia.com'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  campaigns@zoonigia.com
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8"
                  onClick={() => window.location.href = 'tel:+919596241169'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9596241169
                </Button>
              </div>
            </GlassMorphism>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Make Your Mark?</h3>
              <p className="text-space-300 mb-6">
                Join our next campaign and contribute to groundbreaking research while building your academic portfolio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="cosmic-gradient hover:opacity-90 px-8"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  View All Campaigns
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8"
                  onClick={() => window.location.href = 'mailto:campaigns@zoonigia.com?subject=Campaign Information Request'}
                >
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
              {showPayment ? "Complete Payment" : "Register for Campaign"}
            </DialogTitle>
          </DialogHeader>
          
          {!showPayment ? (
            // Registration Form
            <div className="space-y-4">
              <div className="bg-space-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-space-400">Registration Fee</span>
                  <span className="text-lg font-bold text-cosmic-green">₹{selectedCampaign?.price}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-cosmic-blue" />
                  <span className="text-sm text-space-300">Secure payment processing with Stripe</span>
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
                  disabled={createPaymentMutation.isPending || !registrationData.name || !registrationData.email}
                  className="bg-cosmic-blue hover:bg-blue-600 text-white"
                >
                  {createPaymentMutation.isPending ? "Setting up payment..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          ) : (
            // Payment Form
            <div className="space-y-4">
              {!clientSecret ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-blue"></div>
                  <span className="ml-2 text-space-300">Setting up payment...</span>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    selectedCampaign={selectedCampaign}
                    registrationData={registrationData}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </Elements>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Campaigns;
