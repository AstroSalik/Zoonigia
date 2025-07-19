import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Users, 
  Star, 
  TrendingUp, 
  Globe,
  Award,
  Handshake,
  Download,
  Eye,
  Target,
  DollarSign,
  Network,
  Building
} from "lucide-react";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().min(2, "Organization is required"),
  role: z.string().min(2, "Role is required"),
  inquiryType: z.enum(["collaboration", "sponsorship", "investment"]),
  message: z.string().min(10, "Please provide more details"),
});

type InquiryData = z.infer<typeof inquirySchema>;

const Collaborators = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"collaborators" | "sponsors" | "investors">("collaborators");

  const form = useForm<InquiryData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      role: "",
      inquiryType: "collaboration",
      message: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryData) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...data,
        subject: `${data.inquiryType} Inquiry from ${data.organization}`,
        inquiryType: data.inquiryType,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted!",
        description: "We'll get back to you within 48 hours to discuss opportunities.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InquiryData) => {
    inquiryMutation.mutate(data);
  };

  const tabContent = {
    collaborators: {
      title: "Collaborators",
      icon: <Users className="w-8 h-8" />,
      color: "text-cosmic-blue",
      description: "Partner with us to create innovative educational experiences and research opportunities",
      benefits: [
        "Joint research projects",
        "Shared expertise and resources", 
        "Global network access",
        "Co-branded workshops",
        "Academic publications",
        "Student exchange programs"
      ]
    },
    sponsors: {
      title: "Sponsors",
      icon: <Star className="w-8 h-8" />,
      color: "text-cosmic-purple",
      description: "Support our mission while gaining visibility and making a positive impact on education",
      benefits: [
        "Brand visibility benefits",
        "Event sponsorship options",
        "CSR impact reporting",
        "Community engagement",
        "Marketing opportunities",
        "Tax benefits"
      ]
    },
    investors: {
      title: "Investors", 
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-cosmic-green",
      description: "Invest in the future of education and be part of a revolutionary EdTech platform",
      benefits: [
        "Scalable business model",
        "Growing market demand",
        "Social impact focus",
        "Strong growth potential",
        "Experienced team",
        "Global expansion plans"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              <span className="text-cosmic-blue">Collaborators</span>, <span className="text-cosmic-purple">Sponsors</span> & <span className="text-cosmic-green">Investors</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Join us in revolutionizing science education and empowering the next generation of innovators
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-space-800/50 rounded-lg p-1">
              {Object.entries(tabContent).map(([key, content]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-6 py-3 rounded-md transition-all ${
                    activeTab === key 
                      ? "bg-cosmic-blue text-space-900" 
                      : "text-space-300 hover:text-space-50"
                  }`}
                >
                  {content.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {Object.entries(tabContent).map(([key, content]) => (
              <Card 
                key={key}
                className={`bg-space-800/50 border-space-700 text-center transition-all ${
                  activeTab === key ? "ring-2 ring-cosmic-blue scale-105" : ""
                }`}
              >
                <CardHeader>
                  <div className={`${content.color} mx-auto mb-4`}>
                    {content.icon}
                  </div>
                  <CardTitle className="text-2xl">{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-space-300 mb-6">{content.description}</p>
                  <ul className="text-sm text-space-400 space-y-2 mb-6">
                    {content.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      key === "collaborators" ? "bg-cosmic-blue hover:bg-blue-600" :
                      key === "sponsors" ? "bg-cosmic-purple hover:bg-purple-600" :
                      "bg-cosmic-green hover:bg-green-600"
                    }`}
                    onClick={() => {
                      setActiveTab(key as any);
                      form.setValue("inquiryType", key === "collaborators" ? "collaboration" : key === "sponsors" ? "sponsorship" : "investment");
                    }}
                  >
                    {key === "collaborators" ? "Apply for Collaboration" :
                     key === "sponsors" ? "Download Prospectus" :
                     "Investment Opportunities"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Partners */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Our Partners</h2>
            <GlassMorphism className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-blue mb-2">NASA</div>
                  <div className="text-sm text-space-400">Research Partner</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-blue mb-2">IASC</div>
                  <div className="text-sm text-space-400">Collaboration Partner</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-blue mb-2">University of Hawaii</div>
                  <div className="text-sm text-space-400">Academic Partner</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-blue mb-2">Think Startup</div>
                  <div className="text-sm text-space-400">Collaborator</div>
                </div>
              </div>
            </GlassMorphism>
          </div>

          {/* Contact Form */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Get In Touch</h2>
            <div className="max-w-2xl mx-auto">
              <GlassMorphism className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-space-700 border-space-600">
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="collaboration">Collaboration</SelectItem>
                              <SelectItem value="sponsorship">Sponsorship</SelectItem>
                              <SelectItem value="investment">Investment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                className="bg-space-700 border-space-600"
                                {...field}
                              />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-space-700 border-space-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your organization"
                                className="bg-space-700 border-space-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Role</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your role/position"
                                className="bg-space-700 border-space-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your organization and how you'd like to collaborate..."
                              className="bg-space-700 border-space-600 min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full cosmic-gradient hover:opacity-90 transition-opacity"
                      disabled={inquiryMutation.isPending}
                    >
                      {inquiryMutation.isPending ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </form>
                </Form>
              </GlassMorphism>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Impact & Reach</h2>
            <GlassMorphism className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-cosmic-blue mb-2">50+</div>
                  <div className="text-space-300">Global Partners</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cosmic-purple mb-2">10K+</div>
                  <div className="text-space-300">Students Reached</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cosmic-green mb-2">25+</div>
                  <div className="text-space-300">Countries</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cosmic-orange mb-2">100+</div>
                  <div className="text-space-300">Educational Programs</div>
                </div>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Collaborators;