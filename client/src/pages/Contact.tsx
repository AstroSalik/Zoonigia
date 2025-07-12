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
  Mail, 
  Phone, 
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Users,
  Building,
  Heart
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum(["general", "partnership", "collaboration", "support", "media"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "general",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "contact@zoonigia.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+91 98765 43210",
      description: "Call us during business hours"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      content: "Bangalore, Karnataka, India",
      description: "Visit our headquarters"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM IST",
      description: "We're here to help"
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", href: "#" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", href: "#" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", href: "#" },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "partnership", label: "Partnership" },
    { value: "collaboration", label: "Collaboration" },
    { value: "support", label: "Technical Support" },
    { value: "media", label: "Media & Press" },
  ];

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              Get in <span className="text-cosmic-blue">Touch</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Have questions about our programs? Want to partner with us? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <p className="text-space-300 mb-8">
                Ready to embark on a journey to the stars? Reach out to us through any of the channels below, 
                and our team will be happy to assist you.
              </p>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-cosmic-blue mr-4 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-space-200 mb-1">{info.content}</p>
                      <p className="text-sm text-space-400">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="text-cosmic-blue hover:text-blue-400 transition-colors p-2 bg-space-800/50 rounded-lg hover:bg-space-700/50"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassMorphism className="p-4 text-center">
                    <MessageCircle className="w-8 h-8 text-cosmic-green mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Live Chat</h4>
                    <p className="text-xs text-space-400">Chat with our team</p>
                  </GlassMorphism>
                  
                  <GlassMorphism className="p-4 text-center">
                    <Globe className="w-8 h-8 text-cosmic-purple mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">FAQ</h4>
                    <p className="text-xs text-space-400">Find quick answers</p>
                  </GlassMorphism>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <GlassMorphism className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Send us a Message</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your full name"
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
                            <FormLabel>Email *</FormLabel>
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
                              {inquiryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Brief description of your inquiry"
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry, questions, or how we can help you..."
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
                      className="w-full cosmic-gradient hover:opacity-90 py-3"
                      disabled={contactMutation.isPending}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </GlassMorphism>
            </div>
          </div>

          {/* Contact Options */}
          <div className="mt-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Other Ways to Connect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-6 text-center">
                <Users className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">For Students & Educators</h3>
                <p className="text-space-300 mb-4">
                  Questions about workshops, courses, or enrollment? Our education team is here to help.
                </p>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                  Contact Education Team
                </Button>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Building className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">For Schools & Institutions</h3>
                <p className="text-space-300 mb-4">
                  Interested in partnerships or bringing Zoonigia to your institution? Let's talk.
                </p>
                <Button variant="outline" className="border-cosmic-green text-cosmic-green hover:bg-cosmic-green hover:text-space-900">
                  Partnership Inquiries
                </Button>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Heart className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">For Collaborators & Sponsors</h3>
                <p className="text-space-300 mb-4">
                  Want to support our mission or explore collaboration opportunities? We'd love to hear from you.
                </p>
                <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-space-900">
                  Collaboration Team
                </Button>
              </GlassMorphism>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="mt-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassMorphism className="p-6">
                  <h3 className="text-lg font-semibold mb-3">How do I register for a workshop?</h3>
                  <p className="text-space-300 text-sm">
                    You can register for workshops through our Workshops page. Simply browse available workshops, 
                    select one that interests you, and complete the registration process.
                  </p>
                </GlassMorphism>
                
                <GlassMorphism className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Can schools book custom workshops?</h3>
                  <p className="text-space-300 text-sm">
                    Yes! We offer customized workshops for schools. Contact our Schools team to discuss 
                    your specific requirements and schedule a workshop at your institution.
                  </p>
                </GlassMorphism>
                
                <GlassMorphism className="p-6">
                  <h3 className="text-lg font-semibold mb-3">What are the prerequisites for courses?</h3>
                  <p className="text-space-300 text-sm">
                    Course prerequisites vary depending on the course level. Check individual course descriptions 
                    for specific requirements. Most beginner courses have no prerequisites.
                  </p>
                </GlassMorphism>
                
                <GlassMorphism className="p-6">
                  <h3 className="text-lg font-semibold mb-3">How can I join research campaigns?</h3>
                  <p className="text-space-300 text-sm">
                    Research campaigns are announced on our Campaigns page. Registration requirements vary 
                    by campaign. Follow our updates to not miss new campaign announcements.
                  </p>
                </GlassMorphism>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                  View All FAQs
                </Button>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-16 text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Need Immediate Assistance?</h3>
              <p className="text-space-300 mb-6">
                For urgent matters or technical issues during workshops, please contact our support team directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-cosmic-green hover:bg-green-600 px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Support: +91 98765 43210
                </Button>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8">
                  <Mail className="w-5 h-5 mr-2" />
                  Email: support@zoonigia.com
                </Button>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
