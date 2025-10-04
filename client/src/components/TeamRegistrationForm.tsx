import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Award, GraduationCap, UserPlus } from "lucide-react";
import { insertCampaignTeamRegistrationSchema } from "@shared/schema";

const teamRegistrationFormSchema = insertCampaignTeamRegistrationSchema.extend({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  teamLeaderName: z.string().min(2, "Team leader name is required"),
  teamLeaderEmail: z.string().email("Valid email is required"),
  teamLeaderPhone: z.string().min(10, "Valid phone number is required"),
  teamMember2Name: z.string().min(2, "Team member 2 name is required"),
  teamMember2Email: z.string().email("Valid email is required"),
  teamMember2Phone: z.string().min(10, "Valid phone number is required"),
  teamMember3Name: z.string().min(2, "Team member 3 name is required"),
  teamMember3Email: z.string().email("Valid email is required"),
  teamMember3Phone: z.string().min(10, "Valid phone number is required"),
  teamMember4Name: z.string().optional(),
  teamMember4Email: z.string().email("Valid email is required").optional().or(z.literal('')),
  teamMember4Phone: z.string().optional(),
  teamMember5Name: z.string().optional(),
  teamMember5Email: z.string().email("Valid email is required").optional().or(z.literal('')),
  teamMember5Phone: z.string().optional(),
  mentorName: z.string().min(2, "Mentor name is required"),
  mentorEmail: z.string().email("Valid email is required"),
  mentorPhone: z.string().min(10, "Valid phone number is required"),
});

type TeamRegistrationFormData = z.infer<typeof teamRegistrationFormSchema>;

interface TeamRegistrationFormProps {
  campaignId: number;
  onSuccess?: () => void;
}

const TeamRegistrationForm = ({ campaignId, onSuccess }: TeamRegistrationFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showOptionalMembers, setShowOptionalMembers] = useState(false);

  const form = useForm<TeamRegistrationFormData>({
    resolver: zodResolver(teamRegistrationFormSchema),
    defaultValues: {
      campaignId,
      schoolName: "",
      teamLeaderName: "",
      teamLeaderEmail: "",
      teamLeaderPhone: "",
      teamMember2Name: "",
      teamMember2Email: "",
      teamMember2Phone: "",
      teamMember3Name: "",
      teamMember3Email: "",
      teamMember3Phone: "",
      teamMember4Name: "",
      teamMember4Email: "",
      teamMember4Phone: "",
      teamMember5Name: "",
      teamMember5Email: "",
      teamMember5Phone: "",
      mentorName: "",
      mentorEmail: "",
      mentorPhone: "",
    },
  });

  const registerTeamMutation = useMutation({
    mutationFn: async (data: TeamRegistrationFormData) => {
      const response = await apiRequest("POST", `/api/campaigns/${campaignId}/team-register`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Team Registered Successfully!",
        description: "Your team has been registered for the campaign. We'll contact you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error registering your team. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeamRegistrationFormData) => {
    registerTeamMutation.mutate(data);
  };

  return (
    <Card className="glass-morphism border-cosmic-blue/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6 text-cosmic-blue" />
          Team Registration
        </CardTitle>
        <CardDescription>
          Register your team for this campaign. All team members will receive updates and information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* School Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cosmic-blue" />
                <h3 className="text-lg font-semibold">School Information</h3>
              </div>
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your school name" {...field} data-testid="input-school-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Team Leader */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cosmic-purple" />
                <h3 className="text-lg font-semibold">Team Leader</h3>
              </div>
              <FormField
                control={form.control}
                name="teamLeaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Team leader name" {...field} data-testid="input-team-leader-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="teamLeaderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="leader@example.com" {...field} data-testid="input-team-leader-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamLeaderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-team-leader-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Required Team Members */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-tech-green" />
                <h3 className="text-lg font-semibold">Team Members (2 Required)</h3>
              </div>
              
              {/* Team Member 2 */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-space-300">Team Member 2 *</p>
                <FormField
                  control={form.control}
                  name="teamMember2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Member name" {...field} data-testid="input-member-2-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="teamMember2Email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="member2@example.com" {...field} data-testid="input-member-2-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamMember2Phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-member-2-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-space-300">Team Member 3 *</p>
                <FormField
                  control={form.control}
                  name="teamMember3Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Member name" {...field} data-testid="input-member-3-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="teamMember3Email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="member3@example.com" {...field} data-testid="input-member-3-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamMember3Phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-member-3-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Optional Team Members */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full glass-morphism border-cosmic-blue/30"
                onClick={() => setShowOptionalMembers(!showOptionalMembers)}
                data-testid="button-toggle-optional-members"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {showOptionalMembers ? "Hide" : "Add"} Optional Team Members (Up to 2)
              </Button>

              {showOptionalMembers && (
                <div className="space-y-4 animate-slideDown">
                  {/* Team Member 4 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-space-300">Team Member 4 (Optional)</p>
                    <FormField
                      control={form.control}
                      name="teamMember4Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Member name" {...field} data-testid="input-member-4-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="teamMember4Email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="member4@example.com" {...field} data-testid="input-member-4-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamMember4Phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-member-4-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Team Member 5 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-space-300">Team Member 5 (Optional)</p>
                    <FormField
                      control={form.control}
                      name="teamMember5Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Member name" {...field} data-testid="input-member-5-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="teamMember5Email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="member5@example.com" {...field} data-testid="input-member-5-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamMember5Phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-member-5-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Team Mentor */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Team Mentor</h3>
              </div>
              <FormField
                control={form.control}
                name="mentorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mentor name" {...field} data-testid="input-mentor-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mentorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="mentor@example.com" {...field} data-testid="input-mentor-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mentorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 1234567890" {...field} data-testid="input-mentor-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cosmic-gradient"
              disabled={registerTeamMutation.isPending}
              data-testid="button-submit-team-registration"
            >
              {registerTeamMutation.isPending ? "Registering Team..." : "Register Team"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TeamRegistrationForm;
