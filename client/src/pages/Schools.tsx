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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Building, 
  Users, 
  CheckCircle, 
  Globe, 
  Lock, 
  Handshake,
  Award,
  Target,
  BookOpen,
  Calendar
} from "lucide-react";

const schoolInquirySchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  location: z.string().min(2, "Location is required"),
  studentCount: z.string().min(1, "Student count is required"),
  workshopType: z.enum(["open", "restricted"]),
  preferredPrograms: z.array(z.string()).min(1, "Select at least one program"),
  additionalRequirements: z.string().optional(),
});

type SchoolInquiryData = z.infer<typeof schoolInquirySchema>;

const Schools = () => {
  const { toast } = useToast();
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const form = useForm<SchoolInquiryData>({
    resolver: zodResolver(schoolInquirySchema),
    defaultValues: {
      schoolName: "",
      contactPerson: "",
      email: "",
      phone: "",
      location: "",
      studentCount: "",
      workshopType: "open",
      preferredPrograms: [],
      additionalRequirements: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: SchoolInquiryData) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...data,
        subject: "School Partnership Inquiry",
        message: `School: ${data.schoolName}\nContact: ${data.contactPerson}\nPhone: ${data.phone}\nLocation: ${data.location}\nStudents: ${data.studentCount}\nWorkshop Type: ${data.workshopType}\nPrograms: ${data.preferredPrograms.join(", ")}\nAdditional Requirements: ${data.additionalRequirements}`,
        inquiryType: "partnership",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted!",
        description: "We'll contact you within 24 hours to discuss partnership opportunities.",
      });
      form.reset();
      setSelectedPrograms([]);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SchoolInquiryData) => {
    inquiryMutation.mutate({ ...data, preferredPrograms: selectedPrograms });
  };

  const programOptions = [
    { id: "telescope", label: "Telescope Sessions", icon: "🔭" },
    { id: "vr", label: "VR Experiences", icon: "🥽" },
    { id: "expert", label: "Expert Speaker Sessions", icon: "👨‍🔬" },
    { id: "research", label: "Research Labs", icon: "🔬" },
    { id: "design", label: "Design Thinking Workshops", icon: "💡" },
    { id: "universe", label: "Universe Simulation", icon: "🌌" },
  ];

  const handleProgramChange = (programId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrograms([...selectedPrograms, programId]);
    } else {
      setSelectedPrograms(selectedPrograms.filter(p => p !== programId));
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
              Partner with <span className="text-cosmic-blue">Zoonigia</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Transform your science education with our comprehensive programs designed specifically for educational institutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Hero Image */}
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students collaborating in modern science classroom" 
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-semibold mb-6">Why Partner with Us?</h2>
              <p className="text-space-300 mb-6">
                Join 150+ schools worldwide that have already transformed their science education with Zoonigia's innovative programs.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cosmic-green mr-3" />
                  <span>Host workshops and events at your campus</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cosmic-green mr-3" />
                  <span>Counseling sessions for students</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cosmic-green mr-3" />
                  <span>Collaborative student-led research projects</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cosmic-green mr-3" />
                  <span>Group enrollments with special pricing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cosmic-green mr-3" />
                  <span>15% revenue share for partner schools</span>
                </div>
              </div>
              
              <GlassMorphism className="p-6">
                <h3 className="text-xl font-semibold mb-4">Workshop Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-cosmic-blue mr-2" />
                    <span className="text-sm">Open Workshop</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-cosmic-purple mr-2" />
                    <span className="text-sm">Campus Restricted</span>
                  </div>
                </div>
              </GlassMorphism>
            </div>
          </div>

          {/* Partnership Inquiry Form */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Request Partnership</h2>
            <div className="max-w-4xl mx-auto">
              <GlassMorphism className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School/Institution Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ABC International School"
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
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Principal/Coordinator Name"
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
                                placeholder="contact@school.edu"
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+91 98765 43210"
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
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City, State, Country"
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
                        name="studentCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Students</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-space-700 border-space-600">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="50-100">50-100 students</SelectItem>
                                  <SelectItem value="100-300">100-300 students</SelectItem>
                                  <SelectItem value="300-500">300-500 students</SelectItem>
                                  <SelectItem value="500+">500+ students</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="workshopType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workshop Type Preference</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-space-700 border-space-600">
                                <SelectValue placeholder="Select workshop type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open Workshop (Community can join)</SelectItem>
                                <SelectItem value="restricted">Campus Restricted (School students only)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="text-base font-medium mb-4 block">
                        Preferred Programs (Select all that apply)
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {programOptions.map((program) => (
                          <div key={program.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={program.id}
                              checked={selectedPrograms.includes(program.id)}
                              onCheckedChange={(checked) => handleProgramChange(program.id, checked as boolean)}
                            />
                            <label
                              htmlFor={program.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {program.icon} {program.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Requirements or Questions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your specific needs, preferred dates, or any questions..."
                              className="bg-space-700 border-space-600"
                              rows={4}
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
                      disabled={inquiryMutation.isPending}
                    >
                      <Handshake className="w-5 h-5 mr-2" />
                      {inquiryMutation.isPending ? "Submitting..." : "Request Partnership"}
                    </Button>
                  </form>
                </Form>
              </GlassMorphism>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-6">
                <div className="text-center mb-4">
                  <Award className="w-12 h-12 text-cosmic-blue mx-auto mb-3" />
                  <h3 className="text-xl font-semibold">St. Xavier's School</h3>
                  <p className="text-space-400">Mumbai, India</p>
                </div>
                <p className="text-space-300 text-sm">
                  "Zoonigia's workshops transformed our science curriculum. Our students discovered 3 asteroids in the NASA campaign!"
                </p>
                <div className="mt-4 text-center">
                  <span className="text-cosmic-blue font-semibold">500+ students engaged</span>
                </div>
              </GlassMorphism>

              <GlassMorphism className="p-6">
                <div className="text-center mb-4">
                  <Target className="w-12 h-12 text-cosmic-green mx-auto mb-3" />
                  <h3 className="text-xl font-semibold">Delhi Public School</h3>
                  <p className="text-space-400">Delhi, India</p>
                </div>
                <p className="text-space-300 text-sm">
                  "The VR experiences brought space exploration to our classrooms. Student engagement increased by 200%!"
                </p>
                <div className="mt-4 text-center">
                  <span className="text-cosmic-green font-semibold">300+ students enrolled</span>
                </div>
              </GlassMorphism>

              <GlassMorphism className="p-6">
                <div className="text-center mb-4">
                  <BookOpen className="w-12 h-12 text-cosmic-purple mx-auto mb-3" />
                  <h3 className="text-xl font-semibold">Hyderabad Public School</h3>
                  <p className="text-space-400">Hyderabad, India</p>
                </div>
                <p className="text-space-300 text-sm">
                  "Our students published 5 research papers with Zoonigia's mentorship. Exceptional academic growth!"
                </p>
                <div className="mt-4 text-center">
                  <span className="text-cosmic-purple font-semibold">150+ students mentored</span>
                </div>
              </GlassMorphism>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <GlassMorphism className="p-8">
              <h2 className="text-3xl font-space font-bold text-center mb-8">Partnership Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cosmic-blue mb-2">150+</div>
                  <div className="text-space-300">Partner Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cosmic-green mb-2">2,500+</div>
                  <div className="text-space-300">Students Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cosmic-purple mb-2">85%</div>
                  <div className="text-space-300">Improved Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cosmic-orange mb-2">50+</div>
                  <div className="text-space-300">Research Publications</div>
                </div>
              </div>
            </GlassMorphism>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your Science Education?</h3>
              <p className="text-space-300 mb-6">
                Join the revolution in science education and give your students access to real-world research opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="cosmic-gradient hover:opacity-90 px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8">
                  Download Brochure
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

export default Schools;
