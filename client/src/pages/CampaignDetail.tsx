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
import { Calendar, Users, Award, Clock, Target, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import type { Campaign } from "@shared/schema";
import Navigation from "@/components/Navigation";
import TeamRegistrationForm from "@/components/TeamRegistrationForm";

// Razorpay Response Type
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Payment Form Component for Razorpay
const PaymentForm = ({ 
  selectedCampaign, 
  registrationData, 
  onSuccess, 
  onCancel 
}: {
  selectedCampaign: Campaign;
  registrationData: any;
  onSuccess: (paymentData: RazorpayResponse) => void;
  onCancel: () => void;
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaigns/create-order", data);
      return await response.json();
    },
    onSuccess: async (orderData) => {
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast({
          title: "Payment Error",
          description: "Razorpay SDK failed to load. Please check your internet connection.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Configure Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zoonigia',
        description: selectedCampaign.title,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // Payment successful - verify on backend
          try {
            const verifyRes = await apiRequest("POST", "/api/campaigns/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              onSuccess(response);
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyData.message || "Payment could not be verified",
                variant: "destructive",
              });
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast({
              title: "Verification Error",
              description: "Error verifying payment. Please contact support.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: registrationData.name || '',
          email: registrationData.email || '',
          contact: registrationData.phone || '',
        },
        theme: {
          color: '#3B82F6', // cosmic-blue
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            setIsProcessing(false);
            onCancel();
          },
        },
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsProcessing(false);
    },
    onError: (error: any) => {
      console.error('Order creation error:', error);
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create payment order",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    createOrderMutation.mutate({
      campaignId: selectedCampaign.id,
      paymentAmount: parseFloat(selectedCampaign.price || "0")
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-space-800 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-cosmic-blue mb-2">Campaign Registration</h4>
        <p className="text-sm text-gray-300">{selectedCampaign.title}</p>
        <p className="text-lg font-bold text-cosmic-orange mt-2">₹{selectedCampaign.price}</p>
      </div>

      <div className="bg-space-800 p-6 rounded-lg text-center">
        <CreditCard className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
        <h4 className="font-medium text-space-50 mb-2">Secure Payment</h4>
        <p className="text-sm text-space-300 mb-4">
          Click below to proceed with secure Razorpay payment
        </p>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="border-space-600 text-space-300 hover:bg-space-700"
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button 
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          className="bg-cosmic-blue hover:bg-blue-600 text-white"
          data-testid="button-pay"
        >
          {isProcessing ? "Processing..." : `Pay ₹${selectedCampaign.price}`}
        </Button>
      </div>
    </div>
  );
};

const CampaignDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
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

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaigns/enroll", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful!",
        description: "You have been successfully enrolled in the campaign.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsDialogOpen(false);
      setShowPayment(false);
      setRegistrationData({
        name: "",
        email: "",
        phone: "",
        school: "",
        grade: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnrollment = () => {
    if (!campaign) return;
    setIsDialogOpen(true);
    setShowPayment(false);
  };

  const handleProceedToPayment = () => {
    if (!campaign) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: RazorpayResponse) => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
    
    // Complete the enrollment
    enrollMutation.mutate({
      campaignId: campaign?.id,
      paymentId: paymentData.razorpay_payment_id,
      orderId: paymentData.razorpay_order_id,
      paymentAmount: parseFloat(campaign?.price || "0"),
      registrationData
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    toast({
      title: "Payment Cancelled",
      description: "You can try again when you're ready.",
    });
  };

  if (authLoading || isLoading) {
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
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center">Campaign not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4 bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30">
              {campaign.type || 'Campaign'}
            </Badge>
            <h1 className="text-4xl font-space font-bold mb-4">{campaign.title}</h1>
            <p className="text-xl text-space-200 max-w-3xl">{campaign.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Details */}
              <Card className="bg-space-800/50 border-space-700">
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-space-700/50 rounded-lg">
                    <Calendar className="w-6 h-6 text-cosmic-blue mb-2" />
                    <span className="text-sm text-space-400">Start Date</span>
                    <span className="font-semibold">{new Date(campaign.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-space-700/50 rounded-lg">
                    <Clock className="w-6 h-6 text-cosmic-purple mb-2" />
                    <span className="text-sm text-space-400">End Date</span>
                    <span className="font-semibold">{new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-space-700/50 rounded-lg">
                    <Users className="w-6 h-6 text-cosmic-green mb-2" />
                    <span className="text-sm text-space-400">Participants</span>
                    <span className="font-semibold">{(campaign as any).participantCount || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-space-700/50 rounded-lg">
                    <Award className="w-6 h-6 text-cosmic-orange mb-2" />
                    <span className="text-sm text-space-400">Price</span>
                    <span className="font-semibold">₹{campaign.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Full Description */}
              {(campaign as any).fullDescription && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardHeader>
                    <CardTitle>About This Campaign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-space-200 leading-relaxed whitespace-pre-wrap">
                        {(campaign as any).fullDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Highlights */}
              {(campaign as any).highlights && (campaign as any).highlights.length > 0 && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(campaign as any).highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Target className="w-5 h-5 text-cosmic-blue mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-space-200">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <Card className="bg-space-800/50 border-space-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    ₹{campaign.price}
                    {(campaign as any).priceDetails && (
                      <span className="text-sm font-normal text-space-400 block mt-1">
                        {(campaign as any).priceDetails}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-space-300">
                    Secure your spot in this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full cosmic-gradient hover:opacity-90"
                        size="lg"
                        disabled={!isAuthenticated || campaign.status !== "Accepting Registrations"}
                        onClick={handleEnrollment}
                        data-testid="button-enroll"
                      >
                        {!isAuthenticated ? "Login to Enroll" : 
                         campaign.status !== "Accepting Registrations" ? "Registration Closed" :
                         "Enroll Now"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-space-800 border-space-700 text-space-50 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{showPayment ? "Complete Payment" : "Campaign Registration"}</DialogTitle>
                      </DialogHeader>
                      
                      {!showPayment ? (
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-space-200">Full Name *</Label>
                              <Input
                                id="name"
                                value={registrationData.name}
                                onChange={(e) => setRegistrationData(prev => ({...prev, name: e.target.value}))}
                                className="bg-space-700 border-space-600 text-white"
                                placeholder="Enter your full name"
                                data-testid="input-name"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-space-200">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={registrationData.email}
                                onChange={(e) => setRegistrationData(prev => ({...prev, email: e.target.value}))}
                                className="bg-space-700 border-space-600 text-white"
                                placeholder="Enter your email"
                                data-testid="input-email"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-space-200">Phone Number</Label>
                              <Input
                                id="phone"
                                value={registrationData.phone}
                                onChange={(e) => setRegistrationData(prev => ({...prev, phone: e.target.value}))}
                                className="bg-space-700 border-space-600 text-white"
                                placeholder="Enter your phone number"
                                data-testid="input-phone"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="school" className="text-space-200">School/Institution</Label>
                              <Input
                                id="school"
                                value={registrationData.school}
                                onChange={(e) => setRegistrationData(prev => ({...prev, school: e.target.value}))}
                                className="bg-space-700 border-space-600 text-white"
                                placeholder="Enter your school or institution"
                                data-testid="input-school"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grade" className="text-space-200">Grade/Level</Label>
                              <Input
                                id="grade"
                                value={registrationData.grade}
                                onChange={(e) => setRegistrationData(prev => ({...prev, grade: e.target.value}))}
                                className="bg-space-700 border-space-600 text-white"
                                placeholder="Enter your grade or level"
                                data-testid="input-grade"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between gap-4 pt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                              className="border-space-600 text-space-300 hover:bg-space-700"
                              data-testid="button-cancel"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleProceedToPayment}
                              disabled={!registrationData.name || !registrationData.email}
                              className="bg-cosmic-blue hover:bg-blue-600"
                              data-testid="button-proceed"
                            >
                              Proceed to Payment
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <PaymentForm 
                          selectedCampaign={campaign}
                          registrationData={registrationData}
                          onSuccess={handlePaymentSuccess}
                          onCancel={handlePaymentCancel}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Secure payment processing • 30-day money-back guarantee
                    </p>
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

export default CampaignDetail;
