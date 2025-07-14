import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import AdminRoute from "@/components/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Shield, Users, BookOpen, Calendar, Mail, Plus, Edit, Trash2, 
  Eye, MessageSquare, CheckCircle, XCircle, Star, GraduationCap,
  Rocket, Target, Award, Phone, MapPin, Clock, IndianRupee
} from "lucide-react";
import { 
  User, BlogPost, Workshop, Course, Campaign, ContactInquiry, CourseLesson,
  insertBlogPostSchema, insertWorkshopSchema, insertCourseSchema, insertCampaignSchema, insertCourseLessonSchema
} from "@shared/schema";

// Form schemas
const blogPostFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  tags: z.string().optional(),
});

const workshopFormSchema = insertWorkshopSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.string().min(1, "Category is required"),
  requirements: z.string().optional(),
  outcomes: z.string().optional(),
});

const courseFormSchema = insertCourseSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  field: z.string().min(1, "Field is required"),
  requirements: z.string().optional(),
  outcomes: z.string().optional(),
});

const campaignFormSchema = insertCampaignSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.string().optional(),
  maxParticipants: z.number().min(1, "Max participants must be at least 1"),
  status: z.enum(["active", "closed", "completed"]),
  partner: z.string().optional(),
  imageUrl: z.string().optional(),
});

const lessonFormSchema = insertCourseLessonSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  videoUrl: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  orderIndex: z.number().min(1, "Order index is required"),
  type: z.enum(["video", "text", "quiz", "assignment"]),
  resources: z.string().optional(),
  isPreview: z.boolean().default(false),
});

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [showWorkshopDialog, setShowWorkshopDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Data queries
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
  });

  const { data: workshops = [] } = useQuery<Workshop[]>({
    queryKey: ["/api/admin/workshops"],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/campaigns"],
  });

  const { data: inquiries = [] } = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  // Forms
  const blogForm = useForm<z.infer<typeof blogPostFormSchema>>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      imageUrl: "",
      tags: "",
    },
  });

  const workshopForm = useForm<z.infer<typeof workshopFormSchema>>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      price: "0.00",
      capacity: 1,
      level: "beginner",
      category: "",
      requirements: "",
      outcomes: "",
    },
  });

  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      price: "0.00",
      capacity: 1,
      level: "beginner",
      field: "",
      requirements: "",
      outcomes: "",
    },
  });

  const campaignForm = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      startDate: "",
      endDate: "",
      price: "0.00",
      maxParticipants: 1,
      status: "active",
      partner: "",
      imageUrl: "",
    },
  });

  const lessonForm = useForm<z.infer<typeof lessonFormSchema>>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      duration: 10,
      orderIndex: 1,
      type: "video",
      resources: "",
      isPreview: false,
    },
  });

  // Mutations
  const createBlogPost = useMutation({
    mutationFn: async (data: z.infer<typeof blogPostFormSchema>) => {
      const response = await apiRequest("POST", "/api/admin/blog-posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blog post created successfully!" });
      blogForm.reset();
      setShowBlogDialog(false);
    },
    onError: (error) => {
      toast({ title: "Error creating blog post", description: error.message, variant: "destructive" });
    },
  });

  const createWorkshop = useMutation({
    mutationFn: async (data: z.infer<typeof workshopFormSchema>) => {
      const response = await apiRequest("POST", "/api/admin/workshops", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      toast({ title: "Workshop created successfully!" });
      workshopForm.reset();
      setShowWorkshopDialog(false);
    },
    onError: (error) => {
      toast({ title: "Error creating workshop", description: error.message, variant: "destructive" });
    },
  });

  const createCourse = useMutation({
    mutationFn: async (data: z.infer<typeof courseFormSchema>) => {
      const response = await apiRequest("POST", "/api/admin/courses", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course created successfully!" });
      courseForm.reset();
      setShowCourseDialog(false);
    },
    onError: (error) => {
      toast({ title: "Error creating course", description: error.message, variant: "destructive" });
    },
  });

  const createCampaign = useMutation({
    mutationFn: async (data: z.infer<typeof campaignFormSchema>) => {
      const response = await apiRequest("POST", "/api/admin/campaigns", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaign created successfully!" });
      campaignForm.reset();
      setShowCampaignDialog(false);
    },
    onError: (error) => {
      toast({ title: "Error creating campaign", description: error.message, variant: "destructive" });
    },
  });

  const createLesson = useMutation({
    mutationFn: async (data: z.infer<typeof lessonFormSchema>) => {
      if (!selectedCourse) throw new Error("No course selected");
      const response = await apiRequest("POST", `/api/admin/courses/${selectedCourse.id}/lessons`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Lesson created successfully!" });
      lessonForm.reset();
      setShowLessonDialog(false);
    },
    onError: (error) => {
      toast({ title: "Error creating lesson", description: error.message, variant: "destructive" });
    },
  });

  const updateUserAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}`, { isAdmin });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error updating user", description: error.message, variant: "destructive" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting user", description: error.message, variant: "destructive" });
    },
  });

  const handleUserAction = (user: User, action: string) => {
    if (action === "makeAdmin") {
      updateUserAdmin.mutate({ userId: user.id, isAdmin: true });
    } else if (action === "removeAdmin") {
      updateUserAdmin.mutate({ userId: user.id, isAdmin: false });
    } else if (action === "delete") {
      if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
        deleteUser.mutate(user.id);
      }
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-cosmic-blue" />
                  <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                </div>
                <p className="text-space-300">
                  Comprehensive platform management and content creation system
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 mb-8 bg-space-800 border-space-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-cosmic-blue">
                    <Target className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-cosmic-blue">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-cosmic-blue">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="workshops" className="data-[state=active]:bg-cosmic-blue">
                    <Calendar className="w-4 h-4 mr-2" />
                    Workshops
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="data-[state=active]:bg-cosmic-blue">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="data-[state=active]:bg-cosmic-blue">
                    <Rocket className="w-4 h-4 mr-2" />
                    Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="data-[state=active]:bg-cosmic-blue">
                    <Mail className="w-4 h-4 mr-2" />
                    Inquiries
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <GlassMorphism className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-space-400 text-sm font-medium">Total Users</p>
                          <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-space-400 text-sm font-medium">Blog Posts</p>
                          <p className="text-2xl font-bold text-white">{blogPosts.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10">
                          <BookOpen className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-space-400 text-sm font-medium">Workshops</p>
                          <p className="text-2xl font-bold text-white">{workshops.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/10">
                          <Calendar className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-space-400 text-sm font-medium">Inquiries</p>
                          <p className="text-2xl font-bold text-white">{inquiries.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-500/10">
                          <Mail className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </GlassMorphism>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassMorphism className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Recent Users</h3>
                      <div className="space-y-3">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-space-800/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cosmic-blue/20 flex items-center justify-center">
                                <span className="text-cosmic-blue font-semibold text-sm">
                                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.firstName || user.email}</p>
                                <p className="text-space-400 text-sm">{user.email}</p>
                              </div>
                            </div>
                            {user.isAdmin && (
                              <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                                Admin
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Recent Inquiries</h3>
                      <div className="space-y-3">
                        {inquiries.slice(0, 5).map((inquiry) => (
                          <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg bg-space-800/50">
                            <div>
                              <p className="text-white font-medium">{inquiry.name}</p>
                              <p className="text-space-400 text-sm">{inquiry.email}</p>
                              <p className="text-space-300 text-sm mt-1">{inquiry.message.substring(0, 50)}...</p>
                            </div>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              {inquiry.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </GlassMorphism>
                  </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <GlassMorphism className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">User Management</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                          Total: {users.length}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Admins: {users.filter(u => u.isAdmin).length}
                        </Badge>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">User</TableHead>
                            <TableHead className="text-space-300">Email</TableHead>
                            <TableHead className="text-space-300">Role</TableHead>
                            <TableHead className="text-space-300">Joined</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id} className="border-space-700">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-cosmic-blue/20 flex items-center justify-center">
                                    <span className="text-cosmic-blue font-semibold text-sm">
                                      {user.firstName?.[0] || user.email[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-space-300">{user.email}</TableCell>
                              <TableCell>
                                {user.isAdmin ? (
                                  <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                                    Admin
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-space-400 border-space-600">
                                    User
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-space-300">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserAction(user, user.isAdmin ? 'removeAdmin' : 'makeAdmin')}
                                    className="text-yellow-400 hover:bg-yellow-400/10"
                                  >
                                    {user.isAdmin ? <XCircle className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserAction(user, 'delete')}
                                    className="text-red-400 hover:bg-red-400/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>

                  {/* User Detail Dialog */}
                  {selectedUser && (
                    <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                      <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">User Details</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Complete user information and management options
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-space-400 text-sm">Name</p>
                              <p className="text-white font-medium">
                                {selectedUser.firstName ? `${selectedUser.firstName} ${selectedUser.lastName || ''}` : 'Not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Email</p>
                              <p className="text-white font-medium">{selectedUser.email}</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Role</p>
                              <p className="text-white font-medium">
                                {selectedUser.isAdmin ? 'Administrator' : 'User'}
                              </p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Joined</p>
                              <p className="text-white font-medium">
                                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedUser(null)}
                              className="border-space-600 text-space-300"
                            >
                              Close
                            </Button>
                            <Button
                              onClick={() => handleUserAction(selectedUser, selectedUser.isAdmin ? 'removeAdmin' : 'makeAdmin')}
                              className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                            >
                              {selectedUser.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Content Management</h3>
                    <Button 
                      onClick={() => setShowBlogDialog(true)}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Blog Post
                    </Button>
                  </div>

                  {/* Blog Post Creation Dialog */}
                  <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Blog Post</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Add a new educational blog post to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...blogForm}>
                          <form onSubmit={blogForm.handleSubmit((data) => createBlogPost.mutate(data))} className="space-y-4">
                            <FormField
                              control={blogForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={blogForm.control}
                                name="author"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Author</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={blogForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="space-science">Space Science</SelectItem>
                                        <SelectItem value="astronomy">Astronomy</SelectItem>
                                        <SelectItem value="physics">Physics</SelectItem>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="research">Research</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={blogForm.control}
                              name="excerpt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Excerpt</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={blogForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Content</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white min-h-32" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={blogForm.control}
                                name="imageUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Image URL (Optional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={blogForm.control}
                                name="tags"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Tags (Optional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Comma-separated tags" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowBlogDialog(false)}
                                className="border-space-600 text-space-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={createBlogPost.isPending}
                                className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              >
                                {createBlogPost.isPending ? "Creating..." : "Create Post"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Title</TableHead>
                            <TableHead className="text-space-300">Author</TableHead>
                            <TableHead className="text-space-300">Category</TableHead>
                            <TableHead className="text-space-300">Created</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post) => (
                            <TableRow key={post.id} className="border-space-700">
                              <TableCell className="text-white font-medium">{post.title}</TableCell>
                              <TableCell className="text-space-300">{post.author}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-cosmic-blue border-cosmic-blue">
                                  {post.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-400/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>
                </TabsContent>

                <TabsContent value="workshops" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Workshop Management</h3>
                    <Button 
                      onClick={() => setShowWorkshopDialog(true)}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workshop
                    </Button>
                  </div>

                  {/* Workshop Creation Dialog */}
                  <Dialog open={showWorkshopDialog} onOpenChange={setShowWorkshopDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Workshop</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Add a new educational workshop to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...workshopForm}>
                          <form onSubmit={workshopForm.handleSubmit((data) => createWorkshop.mutate(data))} className="space-y-4">
                            <FormField
                              control={workshopForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={workshopForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="telescope">Telescope Sessions</SelectItem>
                                        <SelectItem value="vr">VR Experiences</SelectItem>
                                        <SelectItem value="expert">Expert Sessions</SelectItem>
                                        <SelectItem value="hands-on">Hands-on Activities</SelectItem>
                                        <SelectItem value="research">Research Methods</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={workshopForm.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={workshopForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={workshopForm.control}
                                name="duration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Duration</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g., 2 hours" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={workshopForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Price (₹)</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={workshopForm.control}
                                name="capacity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Capacity</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={workshopForm.control}
                                name="requirements"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Requirements (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={workshopForm.control}
                                name="outcomes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Learning Outcomes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowWorkshopDialog(false)}
                                className="border-space-600 text-space-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={createWorkshop.isPending}
                                className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              >
                                {createWorkshop.isPending ? "Creating..." : "Create Workshop"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Title</TableHead>
                            <TableHead className="text-space-300">Category</TableHead>
                            <TableHead className="text-space-300">Level</TableHead>
                            <TableHead className="text-space-300">Duration</TableHead>
                            <TableHead className="text-space-300">Price</TableHead>
                            <TableHead className="text-space-300">Capacity</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workshops.map((workshop) => (
                            <TableRow key={workshop.id} className="border-space-700">
                              <TableCell className="text-white font-medium">{workshop.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-purple-400 border-purple-400">
                                  {workshop.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  {workshop.level}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">{workshop.duration}</TableCell>
                              <TableCell className="text-space-300">₹{workshop.price}</TableCell>
                              <TableCell className="text-space-300">{workshop.capacity}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-400/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>
                </TabsContent>

                <TabsContent value="courses" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Course Management</h3>
                    <Button 
                      onClick={() => setShowCourseDialog(true)}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  </div>

                  {/* Course Creation Dialog */}
                  <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Course</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Add a new educational course to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...courseForm}>
                          <form onSubmit={courseForm.handleSubmit((data) => createCourse.mutate(data))} className="space-y-4">
                            <FormField
                              control={courseForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="field"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Field</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select field" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="astronomy">Astronomy</SelectItem>
                                        <SelectItem value="astrophysics">Astrophysics</SelectItem>
                                        <SelectItem value="space-technology">Space Technology</SelectItem>
                                        <SelectItem value="planetary-science">Planetary Science</SelectItem>
                                        <SelectItem value="astrobiology">Astrobiology</SelectItem>
                                        <SelectItem value="cosmology">Cosmology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={courseForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="duration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Duration</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g., 8 weeks" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Price (₹)</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="capacity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Capacity</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="requirements"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Requirements (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="outcomes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Learning Outcomes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowCourseDialog(false)}
                                className="border-space-600 text-space-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={createCourse.isPending}
                                className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              >
                                {createCourse.isPending ? "Creating..." : "Create Course"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Title</TableHead>
                            <TableHead className="text-space-300">Field</TableHead>
                            <TableHead className="text-space-300">Level</TableHead>
                            <TableHead className="text-space-300">Duration</TableHead>
                            <TableHead className="text-space-300">Price</TableHead>
                            <TableHead className="text-space-300">Capacity</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course) => (
                            <TableRow key={course.id} className="border-space-700">
                              <TableCell className="text-white font-medium">{course.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-green-400 border-green-400">
                                  {course.field}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  {course.level}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">{course.duration}</TableCell>
                              <TableCell className="text-space-300">₹{course.price}</TableCell>
                              <TableCell className="text-space-300">{course.capacity}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowLessonDialog(true);
                                    }}
                                    className="text-purple-400 hover:bg-purple-400/10"
                                    title="Manage Lessons"
                                  >
                                    <BookOpen className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-400/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>

                  {/* Lesson Management Dialog */}
                  <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Manage Lessons - {selectedCourse?.title}
                        </DialogTitle>
                        <DialogDescription className="text-space-300">
                          Add and manage lessons for this course
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Add Lesson Form */}
                        <div className="border-b border-space-700 pb-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Add New Lesson</h4>
                          <Form {...lessonForm}>
                            <form onSubmit={lessonForm.handleSubmit((data) => createLesson.mutate(data))} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={lessonForm.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Lesson Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={lessonForm.control}
                                  name="type"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Type</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                            <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-space-700 border-space-600">
                                          <SelectItem value="video">Video</SelectItem>
                                          <SelectItem value="text">Text</SelectItem>
                                          <SelectItem value="quiz">Quiz</SelectItem>
                                          <SelectItem value="assignment">Assignment</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={lessonForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={lessonForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Content</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="bg-space-700 border-space-600 text-white min-h-32" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-3 gap-4">
                                <FormField
                                  control={lessonForm.control}
                                  name="videoUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Video URL (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="https://youtube.com/..." className="bg-space-700 border-space-600 text-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={lessonForm.control}
                                  name="duration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Duration (minutes)</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="number"
                                          onChange={(e) => field.onChange(Number(e.target.value))}
                                          className="bg-space-700 border-space-600 text-white"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={lessonForm.control}
                                  name="orderIndex"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Order</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="number"
                                          onChange={(e) => field.onChange(Number(e.target.value))}
                                          className="bg-space-700 border-space-600 text-white"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={lessonForm.control}
                                  name="resources"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-space-300">Resources (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Links to downloadable resources" className="bg-space-700 border-space-600 text-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={lessonForm.control}
                                  name="isPreview"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-space-600 p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-space-300">Preview Lesson</FormLabel>
                                        <FormDescription className="text-space-400">
                                          Allow free preview of this lesson
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="submit"
                                  disabled={createLesson.isPending}
                                  className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                                >
                                  {createLesson.isPending ? "Adding..." : "Add Lesson"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
                        
                        {/* Existing Lessons List */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Course Lessons</h4>
                          <div className="text-space-300 text-center py-8">
                            Lesson management will be expanded here to show existing lessons
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Campaign Management</h3>
                    <Button 
                      onClick={() => setShowCampaignDialog(true)}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>

                  {/* Campaign Creation Dialog */}
                  <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Campaign</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Add a new research campaign to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...campaignForm}>
                          <form onSubmit={campaignForm.handleSubmit((data) => createCampaign.mutate(data))} className="space-y-4">
                            <FormField
                              control={campaignForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={campaignForm.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="asteroid_search">Asteroid Search</SelectItem>
                                        <SelectItem value="poetry">Poetry</SelectItem>
                                        <SelectItem value="research">Research</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={campaignForm.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-space-700 border-space-600">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={campaignForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={campaignForm.control}
                              name="partner"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Partner (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="NASA, IASC, etc." className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={campaignForm.control}
                                name="startDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Start Date</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="date" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={campaignForm.control}
                                name="endDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">End Date</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="date" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={campaignForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Price (₹)</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={campaignForm.control}
                                name="maxParticipants"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Max Participants</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="bg-space-700 border-space-600 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={campaignForm.control}
                              name="imageUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Image URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://example.com/image.jpg" className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-2 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowCampaignDialog(false)}
                                className="border-space-600 text-space-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={createCampaign.isPending}
                                className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              >
                                {createCampaign.isPending ? "Creating..." : "Create Campaign"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Title</TableHead>
                            <TableHead className="text-space-300">Type</TableHead>
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Duration</TableHead>
                            <TableHead className="text-space-300">Price</TableHead>
                            <TableHead className="text-space-300">Max Participants</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaigns.map((campaign) => (
                            <TableRow key={campaign.id} className="border-space-700">
                              <TableCell className="text-white font-medium">{campaign.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-orange-400 border-orange-400">
                                  {campaign.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    campaign.status === 'active' ? 'text-green-400 border-green-400' :
                                    campaign.status === 'closed' ? 'text-blue-400 border-blue-400' :
                                    'text-gray-400 border-gray-400'
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">
                                {campaign.startDate && campaign.endDate 
                                  ? `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                                  : 'N/A'
                                }
                              </TableCell>
                              <TableCell className="text-space-300">₹{campaign.price}</TableCell>
                              <TableCell className="text-space-300">{campaign.maxParticipants}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-400/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>
                </TabsContent>

                <TabsContent value="inquiries" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Inquiry Management</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                        Total: {inquiries.length}
                      </Badge>
                    </div>
                  </div>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Contact</TableHead>
                            <TableHead className="text-space-300">Type</TableHead>
                            <TableHead className="text-space-300">Subject</TableHead>
                            <TableHead className="text-space-300">Message</TableHead>
                            <TableHead className="text-space-300">Date</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id} className="border-space-700">
                              <TableCell>
                                <div>
                                  <p className="text-white font-medium">{inquiry.name}</p>
                                  <p className="text-space-400 text-sm">{inquiry.email}</p>
                                  {inquiry.phone && (
                                    <p className="text-space-400 text-sm">{inquiry.phone}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  {inquiry.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">{inquiry.subject}</TableCell>
                              <TableCell className="text-space-300 max-w-xs truncate">
                                {inquiry.message}
                              </TableCell>
                              <TableCell className="text-space-300">
                                {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`, '_blank')}
                                    className="text-green-400 hover:bg-green-400/10"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>

                  {/* Inquiry Detail Dialog */}
                  {selectedInquiry && (
                    <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
                      <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Inquiry Details</DialogTitle>
                          <DialogDescription className="text-space-300">
                            Complete inquiry information and response options
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-space-400 text-sm">Name</p>
                              <p className="text-white font-medium">{selectedInquiry.name}</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Email</p>
                              <p className="text-white font-medium">{selectedInquiry.email}</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Phone</p>
                              <p className="text-white font-medium">{selectedInquiry.phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Organization</p>
                              <p className="text-white font-medium">{selectedInquiry.organization || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Type</p>
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {selectedInquiry.type}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Date</p>
                              <p className="text-white font-medium">
                                {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-space-400 text-sm mb-2">Subject</p>
                            <p className="text-white font-medium">{selectedInquiry.subject}</p>
                          </div>
                          <div>
                            <p className="text-space-400 text-sm mb-2">Message</p>
                            <div className="bg-space-700 p-3 rounded-lg">
                              <p className="text-white">{selectedInquiry.message}</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedInquiry(null)}
                              className="border-space-600 text-space-300"
                            >
                              Close
                            </Button>
                            <Button
                              onClick={() => window.open(`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`, '_blank')}
                              className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Reply via Email
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;