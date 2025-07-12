import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { UserPlus, GraduationCap, Building, Users, Star } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  userType: z.enum(["student", "educator", "school", "collaborator", "sponsor"]),
  institution: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { toast } = useToast();
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "student",
      institution: "",
      additionalInfo: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiRequest("POST", "/api/users", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Welcome to Zoonigia! Check your email for next steps.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const userTypeOptions = [
    { value: "student", label: "Student", icon: GraduationCap },
    { value: "educator", label: "Educator", icon: Users },
    { value: "school", label: "Institution/School", icon: Building },
    { value: "collaborator", label: "Collaborator", icon: UserPlus },
    { value: "sponsor", label: "Sponsor", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-space font-bold mb-4">
                Join the <span className="text-cosmic-blue">Zoonigia</span> Community
              </h1>
              <p className="text-xl text-space-200">
                Start your journey to the stars and beyond
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Registration Form */}
              <GlassMorphism className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Create Your Account</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedUserType(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-space-700 border-space-600">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="bg-space-700 border-space-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(selectedUserType === "educator" || selectedUserType === "school") && (
                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution/School Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your institution name"
                                className="bg-space-700 border-space-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your interests or goals..."
                              className="bg-space-700 border-space-600"
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
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </GlassMorphism>

              {/* Benefits Section */}
              <div className="space-y-6">
                <GlassMorphism className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cosmic-blue flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2" />
                    For Students
                  </h3>
                  <ul className="space-y-2 text-space-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Access to workshops and courses
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Real-time research lab enrollment
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Campaign participation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Personalized learning dashboard
                    </li>
                  </ul>
                </GlassMorphism>

                <GlassMorphism className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cosmic-purple flex items-center">
                    <Building className="w-6 h-6 mr-2" />
                    For Schools
                  </h3>
                  <ul className="space-y-2 text-space-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Host workshops at your campus
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Group enrollments and discounts
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Collaborative research opportunities
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      15% revenue share benefits
                    </li>
                  </ul>
                </GlassMorphism>

                <GlassMorphism className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cosmic-orange flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    For Collaborators & Sponsors
                  </h3>
                  <ul className="space-y-2 text-space-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Partnership opportunities
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Brand visibility and impact
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Access to exclusive events
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cosmic-green rounded-full mr-3"></span>
                      Direct access to global networks
                    </li>
                  </ul>
                </GlassMorphism>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
