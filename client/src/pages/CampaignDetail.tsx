import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Award, Clock, Target, CreditCard, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import type { Campaign } from "@shared/schema";
import Navigation from "@/components/Navigation";
import TeamRegistrationForm from "@/components/TeamRegistrationForm";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Payment Form Component
const PaymentForm = ({ 
  selectedCampaign, 
  registrationData, 
  onSuccess, 
  onCancel,
  orderData,
  userId
}: {
  selectedCampaign: Campaign;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
  orderData: any;
  userId: string;
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      if (loaded) {
        setIsLoading(false);
      } else {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please refresh the page.",
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  const handlePayment = async () => {
    if (!orderData || isProcessing) return;

    setIsProcessing(true);

    try {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zoonigia",
        description: selectedCampaign.title,
        order_id: orderData.orderId,
        handler: function (response: any) {
          onSuccess({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentAmount: (orderData.amount / 100).toString(),
            userId: userId,
            campaignId: selectedCampaign.id
          });
        },
        prefill: {
          name: registrationData.name,
          email: registrationData.email,
          contact: registrationData.phone
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-space-800 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-cosmic-blue mb-2">Campaign Registration</h4>
        <p className="text-sm text-gray-300">{selectedCampaign.title}</p>
        <p className="text-lg font-bold text-cosmic-orange mt-2">₹{selectedCampaign.price}</p>
      </div>

      <div className="bg-space-800 p-4 rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-cosmic-blue border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-space-300 text-sm mb-2">Click the button below to complete your payment</p>
            <p className="text-xs text-space-400">Secure payment processing</p>
          </div>
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
          type="button"
          onClick={handlePayment}
          disabled={isProcessing || isLoading}
          className="bg-cosmic-blue hover:bg-blue-600 text-white"
        >
          {isProcessing ? "Processing..." : isLoading ? "Loading..." : `Pay ₹${selectedCampaign.price}`}
        </Button>
      </div>
    </div>
  );
};

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    grade: ""
  });

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ["/api/campaigns", id],
    enabled: !!id,
  });

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !id) return;

      try {
        const response = await fetch(`/api/campaigns/${id}/participant/${user.id}`);
        const participant = await response.json();
        setIsEnrolled(!!participant);
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    };

    checkEnrollment();
  }, [user, id]);

  // Create Razorpay order mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaigns/create-payment-order", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setOrderData(data);
      setShowPayment(true);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
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
        description: "You have successfully registered for the campaign.",
      });
      setIsDialogOpen(false);
      setShowPayment(false);
      setOrderData(null);
      setIsEnrolled(true);
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnrollment = () => {
    if (!campaign) return;
    setIsDialogOpen(true);
    setShowPayment(false);
    setOrderData(null);
  };

  const handleSubmitEnrollment = async () => {
    if (!campaign) return;
    
    // Create Razorpay order first
    createPaymentMutation.mutate({
      campaignId: campaign.id,
      paymentAmount: parseFloat(campaign.price || "0")
    });
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
    
    // Complete the enrollment
    enrollMutation.mutate(paymentData);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderData(null);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900">
        <div className="animate-spin w-12 h-12 border-4 border-cosmic-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Campaign Not Found</h1>
          <p className="text-gray-400">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Campaign Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue">
              Research Campaign
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
              {campaign.status}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-xl text-gray-300 mb-6">{campaign.description}</p>
          
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-space-800/50 border-space-700">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-cosmic-blue mx-auto mb-2" />
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-semibold">
                  {campaign.status === "upcoming" ? "TBD" : campaign.duration || "TBD"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-space-800/50 border-space-700">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-cosmic-orange mx-auto mb-2" />
                <p className="text-sm text-gray-400">Field</p>
                <p className="font-semibold">
                  {campaign.status === "upcoming" ? "TBD" : campaign.field || "TBD"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-space-800/50 border-space-700">
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 text-cosmic-yellow mx-auto mb-2" />
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-semibold">
                  {campaign.status === "upcoming" ? "TBD" : `₹${campaign.price || 0}`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {campaign.status === "upcoming" && (
              <Card className="bg-space-800/50 border-space-700 mb-8">
                <CardContent className="p-8 text-center">
                  <div className="text-cosmic-yellow mb-4">
                    <Clock className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Campaign Coming Soon</h3>
                  <p className="text-gray-300 mb-6">
                    This campaign is currently in preparation. Detailed information, requirements, and registration will be available soon.
                  </p>
                  <div className="text-sm text-gray-400">
                    <p>• Campaign timeline and milestones will be announced</p>
                    <p>• Registration requirements and pricing will be confirmed</p>
                    <p>• Full campaign details and resources will be provided</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {campaign.status !== "upcoming" && (
              <>
                {campaign.type === 'ideathon' ? (
              <>
                {/* Campaign Overview */}
                <Card className="bg-space-800/50 border-space-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">Campaign Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-blue">About Youth Ideathon 2025</h3>
                      <p className="text-gray-300 mb-4">
                        A national innovation championship organized by Think Startup in collaboration with Zoonigia, 
                        hosted at the prestigious IIT Delhi campus. This is your opportunity to showcase innovative solutions 
                        to real-world problems and compete for substantial prizes.
                      </p>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Team-based innovation competition (3-5 members per team)</li>
                        <li>• Mentorship from industry experts and IIT Delhi faculty</li>
                        <li>• Top 100 teams invited to grand finale at IIT Delhi</li>
                        <li>• ₹100,000 prize money per winning team (10 winners)</li>
                        <li>• Certificates and recognition for all participants</li>
                        <li>• Networking opportunities with startups and investors</li>
                      </ul>
                    </div>

                    <Separator className="bg-space-700" />

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-purple">Competition Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">Think Startup & Zoonigia</h4>
                          <p className="text-sm text-gray-400">National innovation championship organized by leading EdTech platforms</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">IIT Delhi Venue</h4>
                          <p className="text-sm text-gray-400">Grand finale hosted at IIT Delhi campus</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">Prize Pool</h4>
                          <p className="text-sm text-gray-400">₹10 Lakhs total - ₹1 Lakh per winning team (10 winners)</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">Team Competition</h4>
                          <p className="text-sm text-gray-400">3-5 member teams with mentor guidance</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-space-700" />

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-yellow">Timeline & Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-blue" />
                          <span className="text-sm"><strong>Phase 1:</strong> Registration</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-purple" />
                          <span className="text-sm"><strong>Phase 2:</strong> Top 1500</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-orange" />
                          <span className="text-sm"><strong>Phase 3:</strong> Top 500</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-yellow" />
                          <span className="text-sm"><strong>Phase 4:</strong> Top 100 (Grand Finale at IIT Delhi)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile-only Join Campaign section */}
                <Card className="bg-space-800/50 border-space-700 mb-8 lg:hidden">
                  <CardHeader>
                    <CardTitle className="text-xl">Join the Campaign</CardTitle>
                    <CardDescription>
                      Become part of real space science research
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {campaign.status === "upcoming" ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cosmic-yellow mb-2">Coming Soon</div>
                        <p className="text-sm text-gray-400">Registration opens soon</p>
                      </div>
                    ) : campaign.price && parseFloat(campaign.price) > 0 ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cosmic-blue mb-2">₹{campaign.price}</div>
                        <p className="text-sm text-gray-400">Full campaign access</p>
                        <p className="text-xs text-gray-500 mt-1">Scholarships available</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                        <p className="text-sm text-gray-400">Free registration</p>
                      </div>
                    )}

                    <Separator className="bg-space-700" />

                    <div className="space-y-2">
                      {campaign.status !== "upcoming" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span>{campaign.duration || "TBD"}</span>
                        </div>
                      )}
                      {campaign.status !== "upcoming" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Field:</span>
                          <span>{campaign.field || "TBD"}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant="outline" className={
                          campaign.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                          campaign.status === 'accepting_registrations' ? 'bg-green-500/20 text-green-400 border-green-500' :
                          campaign.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                          campaign.status === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500' :
                          'bg-gray-500/20 text-gray-400 border-gray-500'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      {campaign.status === "upcoming" && (
                        <div className="text-center mt-4">
                          <p className="text-sm text-cosmic-yellow">More details will be available soon</p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-space-700" />

                    <div className="space-y-3">
                      <Button 
                        disabled={campaign.status !== "accepting_registrations"}
                        className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-purple hover:from-cosmic-purple hover:to-cosmic-blue transition-all duration-300"
                        onClick={() => {
                          document.getElementById('team-registration-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {campaign.status === "upcoming" ? "Coming Soon" : 
                         campaign.status === "accepting_registrations" ? "Register Your Team" : 
                         "Registration Closed"}
                      </Button>
                      <p className="text-xs text-center text-space-400">
                        Team-based registration required
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="bg-space-800/50 border-space-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Team Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-cosmic-blue mb-3">Team Structure</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• 3-5 team members (3 required, 2 optional)</li>
                          <li>• 1 team leader to coordinate</li>
                          <li>• 1 mentor from school/institution</li>
                          <li>• All team members must be students</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-cosmic-purple mb-3">What You'll Gain</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Free registration and participation</li>
                          <li>• Expert mentorship from industry leaders</li>
                          <li>• Chance to win ₹1 Lakh prize money</li>
                          <li>• Certificates and recognition</li>
                          <li>• Networking with startups and investors</li>
                          <li>• Keynote session by Salik Riyaz, Founder & CEO of Zoonigia Pvt Ltd</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Campaign Image */}
                <div className="mb-8">
                  <img 
                    src="https://zoonigia.wordpress.com/wp-content/uploads/2025/03/5astr-1.jpg" 
                    alt={campaign.title}
                    className="w-full h-64 object-cover rounded-lg bg-space-800"
                  />
                </div>

                {/* Campaign Overview */}
                <Card className="bg-space-800/50 border-space-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">Campaign Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-blue">What You'll Discover</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Work with real astronomical datasets from Pan-STARRS telescope</li>
                        <li>• Get trained in specialized astronomical software (license provided free)</li>
                        <li>• Join the official International Asteroid Search Campaign</li>
                        <li>• Discover and name your own asteroid (if found)</li>
                        <li>• Receive prestigious certificate featuring NASA, IASC, Pan-STARRS, and Zoonigia</li>
                        <li>• Contribute to actual astronomical research</li>
                      </ul>
                    </div>

                    <Separator className="bg-space-700" />

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-purple">Research Focus</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">NASA Collaboration</h4>
                          <p className="text-sm text-gray-400">Direct collaboration with NASA Citizen Science program</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">IASC Partnership</h4>
                          <p className="text-sm text-gray-400">Part of International Astronomical Search Collaboration</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">Pan-STARRS Data</h4>
                          <p className="text-sm text-gray-400">Access to real telescope data from University of Hawaii</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-cosmic-orange mb-2">Official Recognition</h4>
                          <p className="text-sm text-gray-400">Opportunity to officially name discovered asteroids</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-space-700" />

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-cosmic-yellow">Timeline & Milestones</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-blue" />
                          <span className="text-sm"><strong>Phase 1:</strong> Software training and astronomical data analysis basics</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-purple" />
                          <span className="text-sm"><strong>Phase 2:</strong> Official participation in International Asteroid Search Campaign</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-orange" />
                          <span className="text-sm"><strong>Phase 3:</strong> Discovery verification and naming process</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-cosmic-yellow" />
                          <span className="text-sm"><strong>Phase 4:</strong> Certification and recognition ceremony</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="bg-space-800/50 border-space-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-cosmic-blue mb-3">Technical Requirements</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Computer with internet connection</li>
                          <li>• No prior astronomy experience required</li>
                          <li>• Open to all ages (mentorship provided)</li>
                          <li>• Commitment to campaign duration</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-cosmic-purple mb-3">What's Included</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Free astronomical software license</li>
                          <li>• Access to real Pan-STARRS telescope data</li>
                          <li>• Expert mentorship and training</li>
                          <li>• Official NASA/IASC certificate</li>
                          <li>• Scholarship opportunities available</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="bg-space-800/50 border-space-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">Join the Campaign</CardTitle>
                <CardDescription>
                  Become part of real space science research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.status === "upcoming" ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cosmic-yellow mb-2">Coming Soon</div>
                    <p className="text-sm text-gray-400">Registration opens soon</p>
                  </div>
                ) : campaign.price && parseFloat(campaign.price) > 0 ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cosmic-blue mb-2">₹{campaign.price}</div>
                    <p className="text-sm text-gray-400">Full campaign access</p>
                    <p className="text-xs text-gray-500 mt-1">Scholarships available</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                    <p className="text-sm text-gray-400">Free registration</p>
                  </div>
                )}

                <Separator className="bg-space-700" />

                <div className="space-y-2">
                  {campaign.status !== "upcoming" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span>{campaign.duration || "TBD"}</span>
                    </div>
                  )}
                  {campaign.status !== "upcoming" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Field:</span>
                      <span>{campaign.field || "TBD"}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant="outline" className={
                      campaign.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                      campaign.status === 'accepting_registrations' ? 'bg-green-500/20 text-green-400 border-green-500' :
                      campaign.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                      campaign.status === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500' :
                      'bg-gray-500/20 text-gray-400 border-gray-500'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  {campaign.status === "upcoming" && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-cosmic-yellow">More details will be available soon</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-space-700" />

                {isEnrolled ? (
                  <div className="w-full bg-cosmic-green/20 border border-cosmic-green rounded-lg p-3 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-cosmic-green" />
                    <span className="text-cosmic-green font-semibold">Already Registered</span>
                  </div>
                ) : campaign.type === 'ideathon' ? (
                  <div className="space-y-3">
                    <Button 
                      disabled={campaign.status !== "accepting_registrations"}
                      className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-purple hover:from-cosmic-purple hover:to-cosmic-blue transition-all duration-300"
                      onClick={() => {
                        document.getElementById('team-registration-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {campaign.status === "upcoming" ? "Coming Soon" : 
                       campaign.status === "accepting_registrations" ? "Register Your Team" : 
                       "Registration Closed"}
                    </Button>
                    <p className="text-xs text-center text-space-400">
                      Team-based registration required
                    </p>
                  </div>
                ) : (
                  <>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={handleEnrollment}
                        disabled={campaign.status !== "accepting_registrations"}
                        className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-purple hover:from-cosmic-purple hover:to-cosmic-blue transition-all duration-300"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {campaign.status === "upcoming" ? "Coming Soon" : 
                         campaign.status === "accepting_registrations" ? "Register & Pay Now" : 
                         "Registration Closed"}
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="bg-space-800 border-space-700 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-cosmic-blue">
                        {showPayment ? "Complete Payment" : "Campaign Registration"}
                      </DialogTitle>
                    </DialogHeader>
                    
                    {!showPayment ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-space-200">Full Name</Label>
                            <Input
                              id="name"
                              value={registrationData.name}
                              onChange={(e) => setRegistrationData(prev => ({...prev, name: e.target.value}))}
                              className="bg-space-700 border-space-600 text-white"
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email" className="text-space-200">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={registrationData.email}
                              onChange={(e) => setRegistrationData(prev => ({...prev, email: e.target.value}))}
                              className="bg-space-700 border-space-600 text-white"
                              placeholder="Enter your email"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone" className="text-space-200">Phone Number</Label>
                            <Input
                              id="phone"
                              value={registrationData.phone}
                              onChange={(e) => setRegistrationData(prev => ({...prev, phone: e.target.value}))}
                              className="bg-space-700 border-space-600 text-white"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="school" className="text-space-200">School/Organization</Label>
                            <Input
                              id="school"
                              value={registrationData.school}
                              onChange={(e) => setRegistrationData(prev => ({...prev, school: e.target.value}))}
                              className="bg-space-700 border-space-600 text-white"
                              placeholder="Enter your school or organization"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="grade" className="text-space-200">Grade/Level</Label>
                            <Input
                              id="grade"
                              value={registrationData.grade}
                              onChange={(e) => setRegistrationData(prev => ({...prev, grade: e.target.value}))}
                              className="bg-space-700 border-space-600 text-white"
                              placeholder="Enter your grade or level"
                            />
                          </div>
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
                            className="bg-cosmic-blue hover:bg-blue-600"
                          >
                            {createPaymentMutation.isPending ? "Processing..." : "Proceed to Payment"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <PaymentForm 
                        selectedCampaign={campaign}
                        registrationData={registrationData}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handlePaymentCancel}
                        orderData={orderData}
                        userId={user?.id || ""}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Secure payment processing • 30-day money-back guarantee
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Registration Form for Ideathon Campaigns */}
        {campaign.type === 'ideathon' && campaign.status === 'accepting_registrations' && (
          <div id="team-registration-form" className="container mx-auto px-4 mt-8 max-w-4xl">
            <TeamRegistrationForm 
              campaignId={campaign.id}
              onSuccess={() => {
                toast({
                  title: "Success!",
                  description: "Your team has been registered successfully.",
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}