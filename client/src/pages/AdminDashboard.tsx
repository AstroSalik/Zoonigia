import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
  Rocket, Target, Award, Phone, Clock, IndianRupee,
  Download, RefreshCw, Crown, Heart, Loader2, AlertTriangle,
  FileSpreadsheet, ExternalLink as ExternalLinkIcon, Ticket, Percent
} from "lucide-react";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdvancedDataTable } from "@/components/admin/AdvancedDataTable";
import { DashboardSkeleton, ErrorState, EmptyState } from "@/components/admin/LoadingSkeleton";
import RefundManagement from "@/components/admin/RefundManagement";
import { exportUsers, exportCourses, exportInquiries, exportWorkshops, exportCampaigns } from "@/lib/exportUtils";
import { 
  User, BlogPost, Workshop, Course, Campaign, ContactInquiry, WorkshopRegistration, CourseRegistration,
  InsertBlogPost, InsertWorkshop, InsertCourse, InsertCampaign, lessonFormSchema
} from "@shared/schema";

// Form schemas
const blogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
  authorTitle: z.string().optional(),
  authorImageUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  featuredImage: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
  scheduledDate: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
});

const workshopFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  maxParticipants: z.coerce.number().optional(),
  price: z.string().min(0, "Price is required"),
  imageUrl: z.string().optional(),
});

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  about: z.string().optional(),
  field: z.enum(["quantum_mechanics", "tech_ai", "astrophysics", "space_technology", "robotics", "biotechnology", "nanotechnology", "renewable_energy"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.string().optional(),
  price: z.string().optional(),
  isFree: z.boolean().default(false),
  instructorName: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["upcoming", "accepting_registrations", "live"]).default("upcoming"),
  category: z.string().optional(),
  capacity: z.number().optional(),
  requirements: z.string().optional(),
  outcomes: z.string().optional(),
});

const campaignFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  field: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  partner: z.string().optional(),
  price: z.string().min(0, "Price is required"),
  isFree: z.boolean().default(false),
  maxParticipants: z.coerce.number().optional(),
  targetParticipants: z.coerce.number().optional(),
  requirements: z.string().optional(),
  timeline: z.string().optional(),
  outcomes: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["upcoming", "accepting_registrations", "active", "closed", "completed"]).default("upcoming"),
});

const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  courseId: z.string().optional(),
  timeLimit: z.number().min(0).default(0),
  passingScore: z.number().min(0).max(100).default(70),
  maxAttempts: z.number().min(1).default(3),
  questions: z.array(z.any()).default([]),
});

const couponFormSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Code must be 50 characters or less"),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0.01, "Discount value must be greater than 0"),
  courseId: z.coerce.number().optional().nullable(),
  workshopId: z.coerce.number().optional().nullable(),
  campaignId: z.coerce.number().optional().nullable(),
  minPurchaseAmount: z.coerce.number().optional().nullable(),
  maxDiscountAmount: z.coerce.number().optional().nullable(),
  usageLimit: z.coerce.number().optional().nullable(),
  userUsageLimit: z.coerce.number().min(1).default(1),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  isActive: z.boolean().default(true),
});

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'not_authenticated'>('checking');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [showWorkshopDialog, setShowWorkshopDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editMode, setEditMode] = useState<{
    type: 'blog' | 'workshop' | 'course' | 'campaign' | 'coupon' | null;
    item: any;
  }>({ type: null, item: null });
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
    open: boolean;
    registration: WorkshopRegistration | null;
  }>({ open: false, registration: null });
  const [statisticsDialog, setStatisticsDialog] = useState<{
    open: boolean;
    type: string;
    item: any;
  }>({ open: false, type: '', item: null });
  const { toast } = useToast();

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { waitForAuth } = await import('@/lib/adminClient');
        await waitForAuth();
        setAuthStatus('authenticated');
      } catch (error) {
        console.error('Admin Dashboard - Authentication failed:', error);
        setAuthStatus('not_authenticated');
        toast({
          title: "Authentication Required",
          description: "Please sign in with Google to access the admin dashboard.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [toast]);

  // Data queries with loading and error states
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: blogPosts = [], isLoading: blogPostsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
  });

  const { data: workshops = [], isLoading: workshopsLoading } = useQuery<Workshop[]>({
    queryKey: ["/api/admin/workshops"],
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/campaigns"],
  });

  const { data: workshopRegistrations = [] } = useQuery<WorkshopRegistration[]>({
    queryKey: ["/api/admin/workshop-registrations"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: courseRegistrations = [], refetch: refetchCourseRegistrations } = useQuery<CourseRegistration[]>({
    queryKey: ["/api/admin/course-registrations"],
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const { data: inquiries = [] } = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/inquiries"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: loveMessages = [] } = useQuery({
    queryKey: ["/api/admin/love-messages"],
    refetchInterval: 10000, // Refetch every 10 seconds for love messages
  });

  const { data: campaignParticipants = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/campaign-participants"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: couponCodes = [], isLoading: couponCodesLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/coupon-codes"],
  });

  // Combined loading state for overview
  const isOverviewLoading = usersLoading || blogPostsLoading || workshopsLoading || coursesLoading || campaignsLoading;

  // Notification system - check for new registrations
  const prevRegistrationsCount = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (prevRegistrationsCount.current !== null && workshopRegistrations.length > prevRegistrationsCount.current) {
      toast({
        title: "New Workshop Registration",
        description: "A new workshop registration has been received!",
        className: "bg-cosmic-blue/10 border-cosmic-blue text-white",
      });
    }
    prevRegistrationsCount.current = workshopRegistrations.length;
  }, [workshopRegistrations.length, toast]);

  const prevInquiriesCount = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (prevInquiriesCount.current !== null && inquiries.length > prevInquiriesCount.current) {
      toast({
        title: "New Contact Inquiry",
        description: "A new contact inquiry has been received!",
        className: "bg-green-500/10 border-green-500 text-white",
      });
    }
    prevInquiriesCount.current = inquiries.length;
  }, [inquiries.length, toast]);

  const prevCampaignParticipantsCount = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (prevCampaignParticipantsCount.current !== null && (campaignParticipants as any[]).length > prevCampaignParticipantsCount.current) {
      toast({
        title: "New Campaign Enrollment",
        description: "Someone has enrolled in a campaign!",
        className: "bg-purple-500/10 border-purple-500 text-white",
      });
    }
    prevCampaignParticipantsCount.current = (campaignParticipants as any[]).length;
  }, [(campaignParticipants as any[]).length, toast]);

  // Status update mutation
  const updateRegistrationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/workshop-registrations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshop-registrations"] });
      toast({
        title: "Status Updated",
        description: "Registration status has been updated successfully.",
        className: "bg-green-500/10 border-green-500 text-white",
      });
      setStatusUpdateDialog({ open: false, registration: null });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update registration status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Forms
  const blogForm = useForm<z.infer<typeof blogPostFormSchema>>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      authorName: "",
      authorTitle: "",
      authorImageUrl: "",
      imageUrl: "",
      featuredImage: "",
      categories: [],
      tags: [],
      seoTitle: "",
      seoDescription: "",
      isPublished: false,
      scheduledDate: "",
      status: "draft",
    },
  });

  const workshopForm = useForm<z.infer<typeof workshopFormSchema>>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      startDate: "",
      endDate: "",
      location: "",
      isVirtual: false,
      maxParticipants: undefined,
      price: "0.00",
      imageUrl: "",
    },
  });

  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      about: "",
      field: "astrophysics",
      level: "beginner",
      duration: "",
      price: "",
      instructorName: "",
      imageUrl: "",
      status: "upcoming",
      category: "",
      capacity: undefined,
      requirements: "",
      outcomes: "",
    },
  });

  // Watch course status to dynamically update form requirements
  const watchedCourseStatus = courseForm.watch("status");

  const campaignForm = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      field: "",
      duration: "",
      startDate: "",
      endDate: "",
      price: "0.00",
      maxParticipants: undefined,
      targetParticipants: undefined,
      status: "upcoming",
      partner: "",
      imageUrl: "",
      requirements: "",
      timeline: "",
      outcomes: "",
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

  const quizForm = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      timeLimit: 0,
      passingScore: 70,
      maxAttempts: 3,
      questions: [],
    },
  });

  const couponForm = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      courseId: null,
      workshopId: null,
      campaignId: null,
      minPurchaseAmount: null,
      maxDiscountAmount: null,
      usageLimit: null,
      userUsageLimit: 1,
      validFrom: "",
      validUntil: "",
      isActive: true,
    },
  });

  // Edit handlers
  const handleEditBlog = (blog: BlogPost) => {
    navigate(`/admin/blog-editor/${blog.id}`);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setEditMode({ type: 'workshop', item: workshop });
    workshopForm.reset({
      title: workshop.title,
      description: workshop.description,
      type: workshop.type,
      startDate: workshop.startDate,
      endDate: workshop.endDate,
      location: workshop.location || "",
      isVirtual: workshop.isVirtual || false,
      maxParticipants: workshop.maxParticipants || undefined,
      price: workshop.price || "0.00",
      imageUrl: workshop.imageUrl || "",
    });
    setShowWorkshopDialog(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditMode({ type: 'course', item: course });
    courseForm.reset({
      title: course.title,
      description: course.description,
      about: course.about || "",
      field: course.field as any,
      level: course.level as any,
      duration: course.duration || "",
      price: course.price || "",
      instructorName: course.instructorName || "",
      imageUrl: course.imageUrl || "",
      status: course.status as any || "upcoming",
      category: course.category || "",
      capacity: (course as any).capacity || undefined,
      requirements: (course as any).requirements || "",
      outcomes: (course as any).outcomes || "",
    });
    setShowCourseDialog(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditMode({ type: 'campaign', item: campaign });
    campaignForm.reset({
      title: campaign.title,
      description: campaign.description,
      type: campaign.type,
      field: campaign.field || "",
      duration: campaign.duration || "",
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      price: campaign.price || "0.00",
      maxParticipants: campaign.maxParticipants ?? undefined,
      targetParticipants: campaign.targetParticipants ?? undefined,
      status: campaign.status as any,
      partner: campaign.partner || "",
      imageUrl: campaign.imageUrl || "",
      requirements: campaign.requirements || "",
      timeline: campaign.timeline || "",
      outcomes: campaign.outcomes || "",
    });
    setShowCampaignDialog(true);
  };

  const handleUpdateCampaignStats = (campaign: Campaign) => {
    // This function would open a dialog to update campaign statistics
    toast({ title: "Campaign statistics management", description: "Statistics update functionality coming soon!" });
  };

  const handleManageStatistics = (type: string, item: any) => {
    setStatisticsDialog({ open: true, type, item });
  };

  const closeDialogs = () => {
    setShowBlogDialog(false);
    setShowWorkshopDialog(false);
    setShowCourseDialog(false);
    setShowCampaignDialog(false);
    setShowCouponDialog(false);
    setEditMode({ type: null, item: null });
  };

  const handleEditCoupon = (coupon: any) => {
    setEditMode({ type: 'coupon', item: coupon });
    couponForm.reset({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: parseFloat(coupon.discountValue),
      courseId: coupon.courseId || null,
      workshopId: coupon.workshopId || null,
      campaignId: coupon.campaignId || null,
      minPurchaseAmount: coupon.minPurchaseAmount ? parseFloat(coupon.minPurchaseAmount) : null,
      maxDiscountAmount: coupon.maxDiscountAmount ? parseFloat(coupon.maxDiscountAmount) : null,
      usageLimit: coupon.usageLimit || null,
      userUsageLimit: coupon.userUsageLimit || 1,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : "",
      isActive: coupon.isActive !== false,
    });
    setShowCouponDialog(true);
  };

  // Mutations
  const createBlogPost = useMutation({
    mutationFn: async (data: z.infer<typeof blogPostFormSchema>) => {
      const method = editMode.type === 'blog' ? 'PUT' : 'POST';
      const url = editMode.type === 'blog' ? `/api/admin/blog-posts/${editMode.item.id}` : '/api/admin/blog-posts';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: editMode.type === 'blog' ? "Blog post updated successfully!" : "Blog post created successfully!" });
      blogForm.reset();
      closeDialogs();
    },
    onError: (error) => {
      toast({ title: editMode.type === 'blog' ? "Error updating blog post" : "Error creating blog post", description: error.message, variant: "destructive" });
    },
  });

  const createWorkshop = useMutation({
    mutationFn: async (data: z.infer<typeof workshopFormSchema>) => {
      const method = editMode.type === 'workshop' ? 'PUT' : 'POST';
      const url = editMode.type === 'workshop' ? `/api/admin/workshops/${editMode.item.id}` : '/api/admin/workshops';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      toast({ title: editMode.type === 'workshop' ? "Workshop updated successfully!" : "Workshop created successfully!" });
      workshopForm.reset();
      closeDialogs();
    },
    onError: (error) => {
      toast({ title: editMode.type === 'workshop' ? "Error updating workshop" : "Error creating workshop", description: error.message, variant: "destructive" });
    },
  });

  const createCourse = useMutation({
    mutationFn: async (data: z.infer<typeof courseFormSchema>) => {
      const method = editMode.type === 'course' ? 'PUT' : 'POST';
      const url = editMode.type === 'course' ? `/api/admin/courses/${editMode.item.id}` : '/api/admin/courses';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: editMode.type === 'course' ? "Course updated successfully!" : "Course created successfully!" });
      courseForm.reset();
      closeDialogs();
    },
    onError: (error) => {
      toast({ title: editMode.type === 'course' ? "Error updating course" : "Error creating course", description: error.message, variant: "destructive" });
    },
  });

  const createCampaign = useMutation({
    mutationFn: async (data: z.infer<typeof campaignFormSchema>) => {
      const method = editMode.type === 'campaign' ? 'PUT' : 'POST';
      const url = editMode.type === 'campaign' ? `/api/admin/campaigns/${editMode.item.id}` : '/api/admin/campaigns';
      const response = await apiRequest(method, url, data);
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: editMode.type === 'campaign' ? "Campaign updated successfully!" : "Campaign created successfully!" });
      campaignForm.reset();
      closeDialogs();
    },
    onError: (error: any) => {
      console.error("[Frontend] Campaign creation error:", error);
      toast({ title: editMode.type === 'campaign' ? "Error updating campaign" : "Error creating campaign", description: error.message, variant: "destructive" });
    },
  });

  const createQuiz = useMutation({
    mutationFn: async (data: z.infer<typeof quizFormSchema>) => {
      const quizData = {
        ...data,
        courseId: data.courseId === "standalone" ? null : data.courseId
      };
      const response = await apiRequest('POST', '/api/admin/quizzes', quizData);
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Quiz created successfully!" });
      quizForm.reset();
      setShowQuizDialog(false);
    },
    onError: (error: any) => {
      console.error("[Frontend] Quiz creation error:", error);
      toast({ title: "Error creating quiz", description: error.message, variant: "destructive" });
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

  const createCoupon = useMutation({
    mutationFn: async (data: z.infer<typeof couponFormSchema>) => {
      const method = editMode.type === 'coupon' ? 'PUT' : 'POST';
      const url = editMode.type === 'coupon' ? `/api/admin/coupon-codes/${editMode.item.id}` : '/api/admin/coupon-codes';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupon-codes"] });
      toast({ title: editMode.type === 'coupon' ? "Coupon code updated successfully!" : "Coupon code created successfully!" });
      couponForm.reset();
      setShowCouponDialog(false);
      setEditMode({ type: null, item: null });
    },
    onError: (error: any) => {
      toast({ 
        title: editMode.type === 'coupon' ? "Error updating coupon code" : "Error creating coupon code", 
        description: error.message || "An error occurred", 
        variant: "destructive" 
      });
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/coupon-codes/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupon-codes"] });
      toast({ title: "Coupon code deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting coupon code", description: error.message, variant: "destructive" });
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

  const deleteBlogPost = useMutation({
    mutationFn: async (blogId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/blog-posts/${blogId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Blog post deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting blog post", description: error.message, variant: "destructive" });
    },
  });

  const deleteWorkshop = useMutation({
    mutationFn: async (workshopId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/workshops/${workshopId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      toast({ title: "Workshop deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting workshop", description: error.message, variant: "destructive" });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/courses/${courseId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting course", description: error.message, variant: "destructive" });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/campaigns/${campaignId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaign deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting campaign", description: error.message, variant: "destructive" });
    },
  });

  const deleteWorkshopRegistration = useMutation({
    mutationFn: async (registrationId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/workshop-registrations/${registrationId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshop-registrations"] });
      toast({ title: "Workshop registration deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting workshop registration", description: error.message, variant: "destructive" });
    },
  });

  const updateCourseRegistrationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/course-registrations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/course-registrations"] });
      toast({ title: "Course registration status updated successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error updating course registration status", description: error.message, variant: "destructive" });
    },
  });

  const deleteCourseRegistration = useMutation({
    mutationFn: async (registrationId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/course-registrations/${registrationId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/course-registrations"] });
      toast({ title: "Course registration deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting course registration", description: error.message, variant: "destructive" });
    },
  });

  const deleteContactInquiry = useMutation({
    mutationFn: async (inquiryId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/inquiries/${inquiryId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      toast({ title: "Contact inquiry deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting contact inquiry", description: error.message, variant: "destructive" });
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

  // Show loading or authentication required message
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-space-900 text-space-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-space-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'not_authenticated') {
    return (
      <div className="min-h-screen bg-space-900 text-space-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cosmic-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-space-300 mb-6">Please sign in with Google to access the admin dashboard.</p>
          <Button 
            onClick={async () => {
              try {
                const { signInWithGoogle } = await import("@/lib/googleAuth");
                await signInWithGoogle();
                window.location.reload();
              } catch (error) {
                console.error('Sign in failed:', error);
              }
            }}
            className="bg-cosmic-blue hover:bg-cosmic-blue/90"
          >
            Sign In with Google
          </Button>
        </div>
      </div>
    );
  }

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
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 mb-8 bg-space-800 border-space-700 h-auto p-2">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Target className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                    <span className="sm:hidden">Ovr</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Users className="w-4 h-4 mr-1 sm:mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Content</span>
                    <span className="sm:hidden">Blog</span>
                  </TabsTrigger>
                  <TabsTrigger value="workshops" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Workshops</span>
                    <span className="sm:hidden">Work</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <GraduationCap className="w-4 h-4 mr-1 sm:mr-2" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Award className="w-4 h-4 mr-1 sm:mr-2" />
                    Quizzes
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Rocket className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Campaigns</span>
                    <span className="sm:hidden">Camp</span>
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Mail className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Inquiries</span>
                    <span className="sm:hidden">Inq</span>
                  </TabsTrigger>
                  <TabsTrigger value="special-communications" className="data-[state=active]:bg-purple-500 text-xs sm:text-sm">
                    <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden lg:inline">Special ({(loveMessages as any[]).filter((msg: any) => !msg.isRead).length})</span>
                    <span className="lg:hidden">Spcl ({(loveMessages as any[]).filter((msg: any) => !msg.isRead).length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="coupon-codes" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <Ticket className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Coupon Codes</span>
                    <span className="sm:hidden">Coupons</span>
                  </TabsTrigger>
                  <TabsTrigger value="refunds" className="data-[state=active]:bg-cosmic-blue text-xs sm:text-sm">
                    <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                    Refunds
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Database Reset Section */}

                  {isOverviewLoading ? (
                    <DashboardSkeleton />
                  ) : usersError ? (
                    <ErrorState 
                      title="Failed to Load Data"
                      message="We couldn't load the admin dashboard data. Please check your connection and try again."
                      onRetry={() => window.location.reload()}
                    />
                  ) : (
                    <AnalyticsDashboard
                      users={users}
                      courses={courses}
                      workshops={workshops}
                      campaigns={campaigns}
                      blogPosts={blogPosts}
                      inquiries={inquiries}
                    />
                  )}
                </TabsContent>


                {/* Special Communications Tab - Messages from Special User */}
                <TabsContent value="special-communications" className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Heart className="w-8 h-8 text-red-400 animate-pulse" />
                      <h3 className="text-2xl font-bold text-white">Love Messages from Your Queen</h3>
                      <Heart className="w-8 h-8 text-red-400 animate-pulse" />
                    </div>
                    <p className="text-space-300 mb-4">
                      Messages sent exclusively from <span className="text-pink-300 font-semibold">Munaf Sultan</span> via the Royal Command Center
                    </p>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => window.open('/?preview=royal', '_blank')}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Preview Royal Homepage
                      </Button>
                    </div>
                  </div>

                  <GlassMorphism className="p-6">
                    {(loveMessages as any[]).length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-400 mb-2">No love messages yet</h4>
                        <p className="text-gray-500">Messages from your queen will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(loveMessages as any[]).map((message: any) => (
                          <div 
                            key={message.id} 
                            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                              message.isRead 
                                ? 'bg-space-800/50 border-space-600' 
                                : 'bg-gradient-to-r from-pink-900/50 to-purple-900/50 border-pink-400/50 shadow-pink-400/20 shadow-lg'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">👑</span>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-pink-200">Munaf Sultan</h4>
                                  <p className="text-pink-300 text-sm">munafsultan111@gmail.com</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-space-400 text-sm">
                                  {new Date(message.createdAt).toLocaleDateString()} at{' '}
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </p>
                                {!message.isRead && (
                                  <Badge className="bg-red-500 text-white mt-2">New</Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                              <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                                {message.message}
                              </p>
                            </div>
                            
                            {!message.isRead && (
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await apiRequest('PATCH', `/api/admin/love-messages/${message.id}/read`);
                                      queryClient.invalidateQueries({ queryKey: ['/api/admin/love-messages'] });
                                      toast({
                                        title: "Message marked as read",
                                        description: "Love message has been marked as read",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to mark message as read",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="bg-pink-600 hover:bg-pink-700 text-white"
                                >
                                  Mark as Read
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassMorphism>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <GlassMorphism className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-400" />
                        User Management
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => exportUsers(users)}
                          variant="outline"
                          size="sm"
                          className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                          Total: {users.length}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Admins: {users.filter(u => u.isAdmin).length}
                        </Badge>
                      </div>
                    </div>

                    <AdvancedDataTable
                      data={users}
                      columns={[
                        {
                          key: 'displayName',
                          label: 'User',
                          sortable: true,
                          render: (_, user: User) => (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cosmic-blue/20 flex items-center justify-center">
                                <span className="text-cosmic-blue font-semibold text-sm">
                                  {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
                                </p>
                              </div>
                            </div>
                          )
                        },
                        {
                          key: 'email',
                          label: 'Email',
                          sortable: true,
                        },
                        {
                          key: 'isAdmin',
                          label: 'Role',
                          sortable: true,
                          filterable: true,
                          render: (isAdmin: boolean) => 
                            isAdmin ? (
                              <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-space-400 border-space-600">
                                User
                              </Badge>
                            )
                        },
                        {
                          key: 'createdAt',
                          label: 'Joined',
                          sortable: true,
                          render: (date: string) => 
                            date ? new Date(date).toLocaleDateString() : 'N/A'
                        },
                      ]}
                      searchKeys={['firstName', 'lastName', 'email']}
                      onRowClick={(user) => setSelectedUser(user)}
                      rowActions={(user: User) => (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                            className="text-cosmic-blue hover:bg-cosmic-blue/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserAction(user, user.isAdmin ? 'removeAdmin' : 'makeAdmin');
                            }}
                            className="text-yellow-400 hover:bg-yellow-400/10"
                            title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                          >
                            {user.isAdmin ? <XCircle className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserAction(user, 'delete');
                            }}
                            className="text-red-400 hover:bg-red-400/10"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      emptyMessage="No users found"
                    />
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
                      onClick={() => navigate('/admin/blog-editor')}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Blog Post
                    </Button>
                  </div>

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
                              <TableCell className="text-space-300">{post.authorName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-cosmic-blue border-cosmic-blue">
                                  General
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
                                    onClick={() => handleEditBlog(post)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleManageStatistics("Blog", post)}
                                    className="text-green-400 hover:bg-green-400/10"
                                  >
                                    <Target className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the blog post "${post.title}"?`)) {
                                        deleteBlogPost.mutate(post.id);
                                      }
                                    }}
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
                    <div className="text-space-300 text-sm">
                      <p>Note: All activities are part of one comprehensive workshop with variable pricing</p>
                    </div>
                  </div>



                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassMorphism className="p-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Comprehensive Workshop Experience</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-cosmic-blue rounded-full"></div>
                            <span className="text-space-300">Telescope Sessions</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-cosmic-purple rounded-full"></div>
                            <span className="text-space-300">VR Space Experiences</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-cosmic-green rounded-full"></div>
                            <span className="text-space-300">Space Simulation Games</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-space-300">Expert Sessions</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-space-300">Design Thinking</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-space-300">Hands-on Experiments</span>
                          </div>
                        </div>
                      </div>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Pricing Structure</h4>
                        <div className="p-4 bg-space-700/50 rounded-lg">
                          <p className="text-space-300 text-sm mb-3">
                            Workshop pricing varies based on:
                          </p>
                          <ul className="space-y-2 text-space-300 text-sm">
                            <li>• School location and accessibility</li>
                            <li>• Number of participating students</li>
                            <li>• Duration and customization needs</li>
                            <li>• Equipment and technology requirements</li>
                            <li>• Revenue sharing agreements (10-20%)</li>
                          </ul>
                        </div>
                        <div className="text-center">
                          <Button 
                            onClick={() => window.open('mailto:workshops@zoonigia.com?subject=Workshop Pricing Inquiry', '_blank')}
                            className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact for Pricing
                          </Button>
                        </div>
                      </div>
                    </GlassMorphism>
                  </div>

                  <GlassMorphism className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-white">Workshop Registrations</h4>
                      <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                        Total: {workshopRegistrations.length}
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Name</TableHead>
                            <TableHead className="text-space-300">Contact Info</TableHead>
                            <TableHead className="text-space-300">Organization</TableHead>
                            <TableHead className="text-space-300">Experience</TableHead>
                            <TableHead className="text-space-300">Contact Method</TableHead>
                            <TableHead className="text-space-300">Type</TableHead>
                            <TableHead className="text-space-300">Lower Classes</TableHead>
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Date</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workshopRegistrations.map((registration) => (
                            <TableRow key={registration.id} className="border-space-700">
                              <TableCell className="text-white font-medium">{registration.name}</TableCell>
                              <TableCell>
                                <div className="text-space-300 text-sm">
                                  <div>{registration.email}</div>
                                  {registration.phone && <div>{registration.phone}</div>}
                                </div>
                              </TableCell>
                              <TableCell className="text-space-300">{registration.organization || 'Individual'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-blue-400 border-blue-400">
                                  {registration.experience || 'Not specified'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-green-400 border-green-400">
                                  {registration.contactMethod || 'email'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-purple-400 border-purple-400">
                                  {registration.workshopType || 'community'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  registration.requestLowerClass 
                                    ? "text-yellow-400 border-yellow-400" 
                                    : "text-gray-400 border-gray-400"
                                }>
                                  {registration.requestLowerClass ? 'Yes' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  registration.status === 'confirmed' 
                                    ? "text-green-400 border-green-400" 
                                    : registration.status === 'contacted'
                                    ? "text-yellow-400 border-yellow-400"
                                    : "text-gray-400 border-gray-400"
                                }>
                                  {registration.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">
                                {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`mailto:${registration.email}?subject=Workshop Registration Follow-up`, '_blank')}
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                  {registration.phone && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(`tel:${registration.phone}`, '_blank')}
                                      className="text-green-400 hover:bg-green-400/10"
                                    >
                                      <Phone className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStatusUpdateDialog({ open: true, registration })}
                                    className="text-yellow-400 hover:bg-yellow-400/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleManageStatistics("Workshop Registration", registration)}
                                    className="text-green-400 hover:bg-green-400/10"
                                  >
                                    <Target className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the workshop registration from ${registration.name}?`)) {
                                        deleteWorkshopRegistration.mutate(registration.id);
                                      }
                                    }}
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

                  {/* Status Update Dialog */}
                  <Dialog open={statusUpdateDialog.open} onOpenChange={(open) => setStatusUpdateDialog({ open, registration: statusUpdateDialog.registration })}>
                    <DialogContent className="bg-space-800 border-space-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Update Registration Status</DialogTitle>
                        <DialogDescription className="text-space-300">
                          Update the status of {statusUpdateDialog.registration?.name}'s workshop registration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-space-300 text-sm">Current Status</label>
                          <Badge variant="outline" className="text-gray-400 border-gray-400">
                            {statusUpdateDialog.registration?.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <label className="text-space-300 text-sm">New Status</label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => statusUpdateDialog.registration && updateRegistrationStatus.mutate({ 
                                id: statusUpdateDialog.registration.id, 
                                status: 'pending' 
                              })}
                              className="border-gray-400 text-gray-400 hover:bg-gray-400/10"
                            >
                              Pending
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => statusUpdateDialog.registration && updateRegistrationStatus.mutate({ 
                                id: statusUpdateDialog.registration.id, 
                                status: 'contacted' 
                              })}
                              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                            >
                              Contacted
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => statusUpdateDialog.registration && updateRegistrationStatus.mutate({ 
                                id: statusUpdateDialog.registration.id, 
                                status: 'confirmed' 
                              })}
                              className="border-green-400 text-green-400 hover:bg-green-400/10"
                            >
                              Confirmed
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => statusUpdateDialog.registration && updateRegistrationStatus.mutate({ 
                                id: statusUpdateDialog.registration.id, 
                                status: 'cancelled' 
                              })}
                              className="border-red-400 text-red-400 hover:bg-red-400/10"
                            >
                              Cancelled
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            {editMode.type === 'course' ? 'Edit Course' : 'Create New Course'}
                          </DialogTitle>
                          <DialogDescription className="text-space-300">
                            {editMode.type === 'course' ? 'Update course information and settings' : 'Add a new educational course to the platform'}
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
                            <div className="grid grid-cols-3 gap-4">
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
                                        <SelectItem value="quantum_mechanics">Quantum Mechanics</SelectItem>
                                        <SelectItem value="tech_ai">Technology & AI</SelectItem>
                                        <SelectItem value="astrophysics">Astrophysics</SelectItem>
                                        <SelectItem value="space_technology">Space Technology</SelectItem>
                                        <SelectItem value="robotics">Robotics</SelectItem>
                                        <SelectItem value="biotechnology">Biotechnology</SelectItem>
                                        <SelectItem value="nanotechnology">Nanotechnology</SelectItem>
                                        <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
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
                              <FormField
                                control={courseForm.control}
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
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="accepting_registrations">Accepting Registrations</SelectItem>
                                        <SelectItem value="live">Live</SelectItem>
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
                            <FormField
                              control={courseForm.control}
                              name="about"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">About (Detailed Information)</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} className="bg-space-700 border-space-600 text-white min-h-[100px]" placeholder="Detailed information about the course for the course detail page..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {watchedCourseStatus === "upcoming" && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-400">
                                  <strong>Note:</strong> For upcoming courses, price, capacity, duration, and instructor details are optional. 
                                  These fields will be required when you change the status to "Accepting Registrations" or "Live".
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="instructorName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">
                                      Instructor
                                      {watchedCourseStatus === "upcoming" && (
                                        <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                      )}
                                      {(watchedCourseStatus === "accepting_registrations" || watchedCourseStatus === "live") && (
                                        <span className="text-xs text-red-400 ml-1">*Required</span>
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g., Dr. Jane Smith" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="duration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">
                                      Duration
                                      {watchedCourseStatus === "upcoming" && (
                                        <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                      )}
                                      {(watchedCourseStatus === "accepting_registrations" || watchedCourseStatus === "live") && (
                                        <span className="text-xs text-red-400 ml-1">*Required</span>
                                      )}
                                    </FormLabel>
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
                                    <FormLabel className="text-space-300">
                                      Price (₹)
                                      {watchedCourseStatus === "upcoming" && (
                                        <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                      )}
                                      {(watchedCourseStatus === "accepting_registrations" || watchedCourseStatus === "live") && (
                                        <span className="text-xs text-red-400 ml-1">*Required</span>
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="bg-space-700 border-space-600 text-white"
                                        disabled={courseForm.watch("isFree")}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="isFree"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-space-600 p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-space-300">Free Course</FormLabel>
                                      <FormDescription className="text-space-400">
                                        Mark this course as free (will display "Free" instead of price)
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
                              <FormField
                                control={courseForm.control}
                                name="capacity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">
                                      Capacity
                                      {watchedCourseStatus === "upcoming" && (
                                        <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                                      )}
                                      {(watchedCourseStatus === "accepting_registrations" || watchedCourseStatus === "live") && (
                                        <span className="text-xs text-red-400 ml-1">*Required</span>
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={courseForm.control}
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
                              <FormField
                                control={courseForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Category (Optional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g., Space Science" className="bg-space-700 border-space-600 text-white" />
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
                                {createCourse.isPending ? (editMode.type === 'course' ? "Updating..." : "Creating...") : (editMode.type === 'course' ? "Update Course" : "Create Course")}
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
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Duration</TableHead>
                            <TableHead className="text-space-300">Price</TableHead>
                            <TableHead className="text-space-300">Google Sheets</TableHead>
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
                              <TableCell>
                                <Badge variant="outline" className={
                                  course.status === 'upcoming' ? 'text-blue-400 border-blue-400' :
                                  course.status === 'accepting_registrations' ? 'text-orange-400 border-orange-400' :
                                  'text-green-400 border-green-400'
                                }>
                                  {course.status === 'upcoming' ? 'Upcoming' :
                                   course.status === 'accepting_registrations' ? 'Accepting Registrations' :
                                   'Live'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">{course.duration}</TableCell>
                              <TableCell className="text-space-300">
                                {course.status === 'upcoming' ? (
                                  <span className="text-gray-500">Coming Soon</span>
                                ) : (
                                  `₹${course.price}`
                                )}
                              </TableCell>
                              <TableCell className="text-space-300">
                                <div className="flex flex-col gap-2">
                                  {course.googleSheetUrl ? (
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={course.googleSheetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                                        title="View Google Sheet"
                                      >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <ExternalLinkIcon className="w-3 h-3" />
                                      </a>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-400 hover:bg-blue-400/10 p-1 h-6"
                                        onClick={async () => {
                                        try {
                                          const response = await apiRequest("POST", `/api/admin/export-course-sheets/${course.id}`);
                                            const data = await response.json();
                                            if (data.success) {
                                              toast({
                                                title: "Export Successful",
                                                description: "Course data exported to Google Sheets",
                                              });
                                              queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
                                            } else {
                                              toast({
                                                title: "Export Not Configured",
                                                description: data.message || "Google Sheets export is not configured. This is optional.",
                                                variant: "default",
                                              });
                                            }
                                          } catch (error: any) {
                                            toast({
                                              title: "Export Failed",
                                              description: error.message || "Failed to export to Google Sheets",
                                              variant: "destructive",
                                            });
                                          }
                                        }}
                                        title="Refresh Google Sheet"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-400 hover:bg-blue-400/10"
                                      onClick={async () => {
                                        try {
                                          const response = await apiRequest("POST", `/api/admin/export-course-sheets/${course.id}`);
                                          const data = await response.json();
                                          if (data.success) {
                                            toast({
                                              title: "Google Sheet Created",
                                              description: "Course data exported to Google Sheets",
                                            });
                                            queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
                                          } else {
                                            toast({
                                              title: "Export Not Configured",
                                              description: data.message || "Google Sheets export is not configured. This is optional.",
                                              variant: "default",
                                            });
                                          }
                                        } catch (error: any) {
                                          toast({
                                            title: "Export Failed",
                                            description: error.message || "Failed to create Google Sheet",
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                      title="Create Google Sheet"
                                    >
                                      <FileSpreadsheet className="w-4 h-4 mr-1" />
                                      Create Sheet
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
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
                                    onClick={() => handleEditCourse(course)}
                                    title="Edit Course"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-yellow-400 hover:bg-yellow-400/10"
                                    onClick={async () => {
                                      if (!confirm(`Reset all enrollments for "${course.title}"?`)) return;
                                      try {
                                        const response = await apiRequest("POST", '/api/admin/delete-course-enrollments', {
                                          courseId: course.id
                                        });
                                        const data = await response.json();
                                        toast({
                                          title: "Enrollments Reset",
                                          description: data.message,
                                        });
                                        queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
                                      } catch (error: any) {
                                        toast({
                                          title: "Reset Failed",
                                          description: error.message || "Failed to reset enrollments",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    title="Reset Enrollments"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleManageStatistics("Course", course)}
                                    className="text-green-400 hover:bg-green-400/10"
                                    title="View Statistics"
                                  >
                                    <Target className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
                                        deleteCourse.mutate(course.id);
                                      }
                                    }}
                                    className="text-red-400 hover:bg-red-400/10"
                                    title="Delete Course"
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

                  {/* Course Registrations */}
                  <GlassMorphism className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-white">Course Registrations</h4>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                          Total: {courseRegistrations.length}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => refetchCourseRegistrations()}
                          className="text-cosmic-blue hover:bg-cosmic-blue/10"
                          title="Refresh registrations"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Course</TableHead>
                            <TableHead className="text-space-300">Name</TableHead>
                            <TableHead className="text-space-300">Contact Info</TableHead>
                            <TableHead className="text-space-300">Institution</TableHead>
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Date</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courseRegistrations.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-space-400 py-8">
                                No course registrations yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            courseRegistrations.map((registration) => {
                              const course = courses.find(c => c.id === registration.courseId);
                              return (
                                <TableRow key={registration.id} className="border-space-700">
                                  <TableCell className="text-white font-medium">
                                    {course?.title || `Course #${registration.courseId}`}
                                  </TableCell>
                                  <TableCell className="text-white font-medium">{registration.name}</TableCell>
                                  <TableCell>
                                    <div className="text-space-300 text-sm">
                                      <div>{registration.email}</div>
                                      {registration.phone && <div>{registration.phone}</div>}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-space-300">{registration.institution || 'N/A'}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={
                                      registration.status === 'confirmed' 
                                        ? "text-green-400 border-green-400" 
                                        : registration.status === 'contacted'
                                        ? "text-yellow-400 border-yellow-400"
                                        : registration.status === 'enrolled'
                                        ? "text-blue-400 border-blue-400"
                                        : "text-gray-400 border-gray-400"
                                    }>
                                      {registration.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-space-300">
                                    {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(`mailto:${registration.email}?subject=Course Registration Follow-up`, '_blank')}
                                        className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                      >
                                        <Mail className="w-4 h-4" />
                                      </Button>
                                      {registration.phone && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(`tel:${registration.phone}`, '_blank')}
                                          className="text-green-400 hover:bg-green-400/10"
                                        >
                                          <Phone className="w-4 h-4" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newStatus = registration.status === 'pending' ? 'contacted' : 
                                                           registration.status === 'contacted' ? 'confirmed' :
                                                           registration.status === 'confirmed' ? 'enrolled' : 'pending';
                                          updateCourseRegistrationStatus.mutate({ id: registration.id, status: newStatus });
                                        }}
                                        className="text-yellow-400 hover:bg-yellow-400/10"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete the course registration from ${registration.name}?`)) {
                                            deleteCourseRegistration.mutate(registration.id);
                                          }
                                        }}
                                        className="text-red-400 hover:bg-red-400/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassMorphism>

                  {/* Lesson Management Dialog */}
                  <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Manage Lessons - {selectedCourse?.title}
                        </DialogTitle>
                        <DialogDescription className="text-space-300">
                          Add and manage lessons for this course
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
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

                <TabsContent value="quizzes" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Quiz Management</h3>
                    <Button 
                      onClick={() => setShowQuizDialog(true)}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>

                  {/* Quiz Creation Dialog */}
                  <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Create New Quiz
                        </DialogTitle>
                        <DialogDescription className="text-space-300">
                          Create a new quiz for courses or standalone assessment
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...quizForm}>
                        <form onSubmit={quizForm.handleSubmit((data) => createQuiz.mutate(data))} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={quizForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Quiz Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={quizForm.control}
                              name="courseId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Course (Optional)</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                        <SelectValue placeholder="Select course" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-space-700 border-space-600">
                                      <SelectItem value="standalone">Standalone Quiz</SelectItem>
                                      {courses.map((course: any) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                          {course.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={quizForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-space-300">Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="bg-space-700 border-space-600 text-white" rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={quizForm.control}
                              name="timeLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Time Limit (minutes)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={quizForm.control}
                              name="passingScore"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Passing Score (%)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 70)}
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={quizForm.control}
                              name="maxAttempts"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Max Attempts</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Quiz Questions</h4>
                            <div className="text-space-300 text-center py-8">
                              Question management interface will be implemented here
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowQuizDialog(false)}
                              className="border-space-600 text-space-300"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              disabled={createQuiz.isPending}
                            >
                              {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  {/* Quiz List */}
                  <div className="space-y-4">
                    <div className="text-space-300 text-center py-8">
                      Quiz list and management interface will be implemented here
                    </div>
                  </div>
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
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="flex-shrink-0">
                          <DialogTitle className="text-white">
                            {editMode.type === 'campaign' ? 'Edit Campaign' : 'Create New Campaign'}
                          </DialogTitle>
                          <DialogDescription className="text-space-300">
                            {editMode.type === 'campaign' ? 'Update campaign information' : 'Add a new research campaign to the platform'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto pr-2">
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
                                        <SelectItem value="innovation">Innovation/Entrepreneurship</SelectItem>
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
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="accepting_registrations">Accepting Registrations</SelectItem>
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
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={campaignForm.control}
                                name="field"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Field</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Astronomy, Physics, etc." className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={campaignForm.control}
                                name="duration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Duration</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="16 weeks" className="bg-space-700 border-space-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
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
                                        disabled={campaignForm.watch("isFree")}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={campaignForm.control}
                                name="isFree"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-space-600 p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-space-300">Free Campaign</FormLabel>
                                      <FormDescription className="text-space-400">
                                        Mark this campaign as free (will display "Free" instead of price)
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
                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={campaignForm.control}
                                name="targetParticipants"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Target Participants</FormLabel>
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
                            </div>
                            <FormField
                              control={campaignForm.control}
                              name="requirements"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Requirements</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Basic astronomy knowledge, computer access..." className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={campaignForm.control}
                              name="timeline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Timeline</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Week 1: Introduction, Week 2: Data collection..." className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={campaignForm.control}
                              name="outcomes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Expected Outcomes</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Asteroid discovery, research publication..." className="bg-space-700 border-space-600 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-space-800 border-t border-space-700 mt-6 -mx-2 px-2 py-4">
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
                                {createCampaign.isPending ? (editMode.type === 'campaign' ? "Updating..." : "Creating...") : (editMode.type === 'campaign' ? "Update Campaign" : "Create Campaign")}
                              </Button>
                            </div>
                          </form>
                        </Form>
                        </div>
                      </DialogContent>
                    </Dialog>

                  {/* Campaign Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <GlassMorphism className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                          <Rocket className="w-5 h-5 text-cosmic-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Campaigns</p>
                          <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                        </div>
                      </div>
                    </GlassMorphism>
                    
                    <GlassMorphism className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Upcoming Campaigns</p>
                          <p className="text-2xl font-bold text-white">
                            {campaigns.filter(c => c.status === 'upcoming').length}
                          </p>
                        </div>
                      </div>
                    </GlassMorphism>
                    
                    <GlassMorphism className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Accepting Registrations</p>
                          <p className="text-2xl font-bold text-white">
                            {campaigns.filter(c => c.status === 'accepting_registrations').length}
                          </p>
                        </div>
                      </div>
                    </GlassMorphism>
                    
                    <GlassMorphism className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cosmic-purple/20 rounded-lg">
                          <Users className="w-5 h-5 text-cosmic-purple" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Participants</p>
                          <p className="text-2xl font-bold text-white">
                            {campaigns.reduce((sum, c) => sum + (c.currentParticipants || 0), 0)}
                          </p>
                        </div>
                      </div>
                    </GlassMorphism>
                    
                    <GlassMorphism className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cosmic-orange/20 rounded-lg">
                          <IndianRupee className="w-5 h-5 text-cosmic-orange" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Revenue</p>
                          <p className="text-2xl font-bold text-white">
                            ₹{campaigns.reduce((sum, c) => sum + ((c.currentParticipants || 0) * parseFloat(c.price || '0')), 0).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </GlassMorphism>
                  </div>

                  <GlassMorphism className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Campaign</TableHead>
                            <TableHead className="text-space-300">Type</TableHead>
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Participants</TableHead>
                            <TableHead className="text-space-300">Revenue</TableHead>
                            <TableHead className="text-space-300">Duration</TableHead>
                            <TableHead className="text-space-300">Google Sheets</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaigns.map((campaign) => (
                            <TableRow key={campaign.id} className="border-space-700">
                              <TableCell className="text-white">
                                <div className="flex items-center gap-3">
                                  {campaign.imageUrl && (
                                    <img 
                                      src={campaign.imageUrl} 
                                      alt={campaign.title}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium">{campaign.title}</p>
                                    <p className="text-sm text-gray-400">{campaign.field}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-orange-400 border-orange-400">
                                  {campaign.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    campaign.status === 'upcoming' ? 'text-yellow-400 border-yellow-400' :
                                    campaign.status === 'active' ? 'text-green-400 border-green-400' :
                                    campaign.status === 'closed' ? 'text-blue-400 border-blue-400' :
                                    'text-gray-400 border-gray-400'
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-space-300">
                                <div className="flex flex-col">
                                  <span className="font-medium">{campaign.currentParticipants || 0}</span>
                                  <span className="text-xs text-gray-500">
                                    / {campaign.maxParticipants || campaign.targetParticipants || 'Unlimited'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-space-300">
                                <div className="flex flex-col">
                                  <span className="font-medium">₹{((campaign.currentParticipants || 0) * parseFloat(campaign.price || '0')).toFixed(0)}</span>
                                  <span className="text-xs text-gray-500">@₹{campaign.price || '0'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-space-300">{campaign.duration || 'N/A'}</TableCell>
                              <TableCell className="text-space-300">
                                <div className="flex flex-col gap-2">
                                  {campaign.googleSheetUrl ? (
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={campaign.googleSheetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                                        title="View Google Sheet"
                                      >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <ExternalLinkIcon className="w-3 h-3" />
                                      </a>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-400 hover:bg-blue-400/10 p-1 h-6"
                                        onClick={async () => {
                                          try {
                                            const response = await apiRequest("POST", `/api/admin/export-campaign-sheets/${campaign.id}`);
                                            const data = await response.json();
                                            toast({
                                              title: "Export Successful",
                                              description: "Campaign data exported to Google Sheets",
                                            });
                                            queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
                                          } catch (error: any) {
                                            toast({
                                              title: "Export Failed",
                                              description: error.message || "Failed to export to Google Sheets",
                                              variant: "destructive",
                                            });
                                          }
                                        }}
                                        title="Refresh Google Sheet"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-400 hover:bg-blue-400/10"
                                      onClick={async () => {
                                        try {
                                          const response = await apiRequest("POST", `/api/admin/export-campaign-sheets/${campaign.id}`);
                                          const data = await response.json();
                                          toast({
                                            title: "Google Sheet Created",
                                            description: "Campaign data exported to Google Sheets",
                                          });
                                          queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
                                        } catch (error: any) {
                                          toast({
                                            title: "Export Failed",
                                            description: error.message || "Failed to create Google Sheet",
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                      title="Create Google Sheet"
                                    >
                                      <FileSpreadsheet className="w-4 h-4 mr-1" />
                                      Create Sheet
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                    onClick={() => handleEditCampaign(campaign)}
                                    title="Edit Campaign"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-yellow-400 hover:bg-yellow-400/10"
                                    onClick={async () => {
                                      if (!confirm(`Reset all registrations for "${campaign.title}"?`)) return;
                                      try {
                                        const response = await apiRequest("POST", '/api/admin/delete-campaign-registration', {
                                          campaignTitle: campaign.title
                                        });
                                        const data = await response.json();
                                        toast({
                                          title: "Registrations Reset",
                                          description: data.message,
                                        });
                                        queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
                                      } catch (error: any) {
                                        toast({
                                          title: "Reset Failed",
                                          description: error.message || "Failed to reset registrations",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    title="Reset Registrations"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-400 hover:bg-green-400/10"
                                    onClick={() => handleManageStatistics("Campaign", campaign)}
                                    title="View Statistics"
                                  >
                                    <Target className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the campaign "${campaign.title}"?`)) {
                                        deleteCampaign.mutate(campaign.id);
                                      }
                                    }}
                                    className="text-red-400 hover:bg-red-400/10"
                                    title="Delete Campaign"
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

                  <GlassMorphism className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-white">Campaign Team Registrations</h4>
                      <Badge variant="secondary" className="bg-cosmic-blue/20 text-cosmic-blue">
                        Total: {campaignParticipants.length}
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-space-700">
                            <TableHead className="text-space-300">Campaign</TableHead>
                            <TableHead className="text-space-300">School</TableHead>
                            <TableHead className="text-space-300">Team Leader</TableHead>
                            <TableHead className="text-space-300">Team Members</TableHead>
                            <TableHead className="text-space-300">Mentor</TableHead>
                            <TableHead className="text-space-300">Status</TableHead>
                            <TableHead className="text-space-300">Date</TableHead>
                            <TableHead className="text-space-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaignParticipants.map((registration: any) => {
                            const campaign = campaigns.find(c => c.id === registration.campaignId);
                            return (
                              <TableRow key={registration.id} className="border-space-700">
                                <TableCell className="text-white font-medium">
                                  {campaign?.title || 'Unknown Campaign'}
                                </TableCell>
                                <TableCell className="text-space-300">{registration.schoolName}</TableCell>
                                <TableCell>
                                  <div className="text-space-300 text-sm">
                                    <div className="font-medium text-white">{registration.teamLeaderName}</div>
                                    <div>{registration.teamLeaderEmail}</div>
                                    {registration.teamLeaderPhone && <div>{registration.teamLeaderPhone}</div>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-space-300 text-sm space-y-1">
                                    {registration.teamMember2Name && (
                                      <div>• {registration.teamMember2Name}</div>
                                    )}
                                    {registration.teamMember3Name && (
                                      <div>• {registration.teamMember3Name}</div>
                                    )}
                                    {registration.teamMember4Name && (
                                      <div>• {registration.teamMember4Name}</div>
                                    )}
                                    {registration.teamMember5Name && (
                                      <div>• {registration.teamMember5Name}</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-space-300 text-sm">
                                    {registration.mentorName && (
                                      <>
                                        <div className="font-medium">{registration.mentorName}</div>
                                        <div>{registration.mentorEmail}</div>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    registration.status === 'confirmed' 
                                      ? "text-green-400 border-green-400" 
                                      : registration.status === 'pending'
                                      ? "text-yellow-400 border-yellow-400"
                                      : "text-gray-400 border-gray-400"
                                  }>
                                    {registration.status || 'pending'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-space-300">
                                  {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(`mailto:${registration.teamLeaderEmail}?subject=Campaign Registration Follow-up`, '_blank')}
                                      className="text-cosmic-blue hover:bg-cosmic-blue/10"
                                    >
                                      <Mail className="w-4 h-4" />
                                    </Button>
                                    {registration.teamLeaderPhone && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(`tel:${registration.teamLeaderPhone}`, '_blank')}
                                        className="text-green-400 hover:bg-green-400/10"
                                      >
                                        <Phone className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
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
                                </div>
                              </TableCell>
                              <TableCell>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              {inquiry.inquiryType || 'General'}
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleManageStatistics("Contact Inquiry", inquiry)}
                                    className="text-green-400 hover:bg-green-400/10"
                                  >
                                    <Target className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the inquiry from ${inquiry.name}?`)) {
                                        deleteContactInquiry.mutate(inquiry.id);
                                      }
                                    }}
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
                              <p className="text-white font-medium">Not provided</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Organization</p>
                              <p className="text-white font-medium">Not provided</p>
                            </div>
                            <div>
                              <p className="text-space-400 text-sm">Type</p>
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {selectedInquiry.inquiryType || 'General'}
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

                {/* Refunds Tab */}
                <TabsContent value="coupon-codes" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Coupon Code Management</h3>
                    <Button 
                      onClick={() => {
                        setEditMode({ type: null, item: null });
                        couponForm.reset();
                        setShowCouponDialog(true);
                      }}
                      className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Coupon Code
                    </Button>
                  </div>

                  {couponCodesLoading ? (
                    <DashboardSkeleton />
                  ) : couponCodes.length === 0 ? (
                    <EmptyState message="No coupon codes found. Create your first coupon code to get started!" />
                  ) : (
                    <Card className="bg-space-800 border-space-700">
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-space-700">
                              <TableHead className="text-space-300">Code</TableHead>
                              <TableHead className="text-space-300">Discount</TableHead>
                              <TableHead className="text-space-300">Applies To</TableHead>
                              <TableHead className="text-space-300">Usage</TableHead>
                              <TableHead className="text-space-300">Validity</TableHead>
                              <TableHead className="text-space-300">Status</TableHead>
                              <TableHead className="text-space-300">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {couponCodes.map((coupon: any) => {
                              const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                              const isUpcoming = coupon.validFrom && new Date(coupon.validFrom) > new Date();
                              const usagePercentage = coupon.usageLimit 
                                ? Math.round((coupon.usedCount / coupon.usageLimit) * 100) 
                                : null;
                              
                              let appliesTo = "All Items";
                              if (coupon.courseId) {
                                const course = courses.find((c: Course) => c.id === coupon.courseId);
                                appliesTo = course ? `Course: ${course.title}` : `Course #${coupon.courseId}`;
                              } else if (coupon.workshopId) {
                                const workshop = workshops.find((w: Workshop) => w.id === coupon.workshopId);
                                appliesTo = workshop ? `Workshop: ${workshop.title}` : `Workshop #${coupon.workshopId}`;
                              } else if (coupon.campaignId) {
                                const campaign = campaigns.find((c: Campaign) => c.id === coupon.campaignId);
                                appliesTo = campaign ? `Campaign: ${campaign.title}` : `Campaign #${coupon.campaignId}`;
                              }

                              return (
                                <TableRow key={coupon.id} className="border-space-700">
                                  <TableCell className="font-mono font-semibold text-white">
                                    {coupon.code}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      {coupon.discountType === 'percentage' ? (
                                        <>
                                          <Percent className="w-4 h-4 text-purple-400" />
                                          <span className="text-white">{coupon.discountValue}%</span>
                                        </>
                                      ) : (
                                        <>
                                          <IndianRupee className="w-4 h-4 text-green-400" />
                                          <span className="text-white">{coupon.discountValue}</span>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-space-400 text-sm max-w-xs truncate">
                                    {appliesTo}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white">{coupon.usedCount || 0}</span>
                                      {coupon.usageLimit && (
                                        <>
                                          <span className="text-space-400">/</span>
                                          <span className="text-space-400">{coupon.usageLimit}</span>
                                          {usagePercentage !== null && (
                                            <Badge variant="outline" className={`text-xs ${
                                              usagePercentage >= 90 ? 'border-red-400 text-red-400' :
                                              usagePercentage >= 70 ? 'border-yellow-400 text-yellow-400' :
                                              'border-green-400 text-green-400'
                                            }`}>
                                              {usagePercentage}%
                                            </Badge>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      {coupon.validFrom && (
                                        <div className="text-space-400">
                                          From: {new Date(coupon.validFrom).toLocaleDateString()}
                                        </div>
                                      )}
                                      {coupon.validUntil && (
                                        <div className={`${isExpired ? 'text-red-400' : 'text-space-400'}`}>
                                          Until: {new Date(coupon.validUntil).toLocaleDateString()}
                                        </div>
                                      )}
                                      {!coupon.validFrom && !coupon.validUntil && (
                                        <span className="text-space-400">No expiration</span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {isExpired ? (
                                      <Badge variant="outline" className="border-red-400 text-red-400">
                                        Expired
                                      </Badge>
                                    ) : isUpcoming ? (
                                      <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                                        Upcoming
                                      </Badge>
                                    ) : coupon.isActive ? (
                                      <Badge variant="outline" className="border-green-400 text-green-400">
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="border-space-500 text-space-400">
                                        Inactive
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditCoupon(coupon)}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete coupon code "${coupon.code}"?`)) {
                                            deleteCoupon.mutate(coupon.id);
                                          }
                                        }}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  {/* Coupon Code Creation/Edit Dialog */}
                  <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
                    <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {editMode.type === 'coupon' ? 'Edit Coupon Code' : 'Create New Coupon Code'}
                        </DialogTitle>
                        <DialogDescription className="text-space-300">
                          {editMode.type === 'coupon' ? 'Update coupon code settings' : 'Create a new discount coupon code'}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...couponForm}>
                        <form onSubmit={couponForm.handleSubmit((data) => createCoupon.mutate(data))} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={couponForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Coupon Code *</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-space-700 border-space-600 text-white font-mono uppercase" placeholder="SUMMER2024" />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Code will be automatically converted to uppercase</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="discountType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Discount Type *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={couponForm.control}
                              name="discountValue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">
                                    Discount Value * ({couponForm.watch("discountType") === "percentage" ? "%" : "₹"})
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01"
                                      {...field} 
                                      className="bg-space-700 border-space-600 text-white" 
                                      placeholder={couponForm.watch("discountType") === "percentage" ? "10" : "100"}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {couponForm.watch("discountType") === "percentage" && (
                              <FormField
                                control={couponForm.control}
                                name="maxDiscountAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-space-300">Max Discount Cap (₹)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        step="0.01"
                                        {...field} 
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                        className="bg-space-700 border-space-600 text-white" 
                                        placeholder="Optional"
                                      />
                                    </FormControl>
                                    <FormDescription className="text-space-400">Maximum discount amount (optional)</FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>

                          <FormField
                            control={couponForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-space-300">Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="bg-space-700 border-space-600 text-white" placeholder="Optional description for this coupon" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={couponForm.control}
                              name="courseId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Course (Optional)</FormLabel>
                                  <Select 
                                    onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))} 
                                    value={field.value ? field.value.toString() : "none"}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                        <SelectValue placeholder="All courses" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">All Courses</SelectItem>
                                      {courses.map((course: Course) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                          {course.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="workshopId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Workshop (Optional)</FormLabel>
                                  <Select 
                                    onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))} 
                                    value={field.value ? field.value.toString() : "none"}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                        <SelectValue placeholder="All workshops" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">All Workshops</SelectItem>
                                      {workshops.map((workshop: Workshop) => (
                                        <SelectItem key={workshop.id} value={workshop.id.toString()}>
                                          {workshop.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="campaignId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Campaign (Optional)</FormLabel>
                                  <Select 
                                    onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))} 
                                    value={field.value ? field.value.toString() : "none"}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-space-700 border-space-600 text-white">
                                        <SelectValue placeholder="All campaigns" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">All Campaigns</SelectItem>
                                      {campaigns.map((campaign: Campaign) => (
                                        <SelectItem key={campaign.id} value={campaign.id.toString()}>
                                          {campaign.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={couponForm.control}
                              name="minPurchaseAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Min Purchase (₹)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01"
                                      {...field} 
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                      className="bg-space-700 border-space-600 text-white" 
                                      placeholder="Optional"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Minimum purchase amount required</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="usageLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Total Usage Limit</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                      className="bg-space-700 border-space-600 text-white" 
                                      placeholder="Unlimited"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Leave empty for unlimited</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="userUsageLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Per User Limit *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1"
                                      {...field} 
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Times a user can use this</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={couponForm.control}
                              name="validFrom"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Valid From</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field} 
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Leave empty to start immediately</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={couponForm.control}
                              name="validUntil"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-space-300">Valid Until</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field} 
                                      className="bg-space-700 border-space-600 text-white" 
                                    />
                                  </FormControl>
                                  <FormDescription className="text-space-400">Leave empty for no expiration</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={couponForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-space-600 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-space-300">Active Status</FormLabel>
                                  <FormDescription className="text-space-400">
                                    Inactive coupons cannot be used
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

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowCouponDialog(false)}
                              className="border-space-600 text-space-300"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-cosmic-blue hover:bg-cosmic-blue/90"
                              disabled={createCoupon.isPending}
                            >
                              {createCoupon.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {editMode.type === 'coupon' ? 'Updating...' : 'Creating...'}
                                </>
                              ) : (
                                editMode.type === 'coupon' ? 'Update Coupon' : 'Create Coupon'
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="refunds">
                  <RefundManagement />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Statistics Management Dialog */}
        {statisticsDialog.open && (
          <Dialog open={statisticsDialog.open} onOpenChange={() => setStatisticsDialog({ open: false, type: '', item: null })}>
            <DialogContent className="bg-space-800 border-space-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {statisticsDialog.type} Statistics Management
                </DialogTitle>
                <DialogDescription className="text-space-300">
                  Detailed statistics and management options for {statisticsDialog.item?.title || statisticsDialog.item?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statisticsDialog.type === 'Blog Post' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.isPublished ? 'Published' : 'Draft'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Published</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.publishedAt ? new Date(statisticsDialog.item.publishedAt).toLocaleDateString() : 'Not Published'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Author</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.author || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                  
                  {statisticsDialog.type === 'Workshop' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                            <Users className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Current / Max</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.currentParticipants || 0} / {statisticsDialog.item?.maxParticipants || 0}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Start Date</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.startDate ? new Date(statisticsDialog.item.startDate).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                  
                  {statisticsDialog.type === 'Course' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Level</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.level || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.duration || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                  
                  {statisticsDialog.type === 'Campaign' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                            <Users className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Participants</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.currentParticipants || 0} / {statisticsDialog.item?.maxParticipants || 0}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.status || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">End Date</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.endDate ? new Date(statisticsDialog.item.endDate).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                  
                  {statisticsDialog.type === 'Workshop Registration' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                            <Users className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.status || 'Pending'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Registered</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.createdAt ? new Date(statisticsDialog.item.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Type</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.workshopType || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                  
                  {statisticsDialog.type === 'Contact Inquiry' && (
                    <>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                            <Mail className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Type</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.type || 'General'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Received</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.createdAt ? new Date(statisticsDialog.item.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                      <GlassMorphism className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Has Phone</p>
                            <p className="text-xl font-bold text-white">
                              {statisticsDialog.item?.phone ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      </GlassMorphism>
                    </>
                  )}
                </div>
                
                {/* Detailed Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Detailed Information</h3>
                    <Button
                      onClick={() => {
                        // Close statistics dialog and open edit dialog
                        setStatisticsDialog({ open: false, type: '', item: null });
                        
                        // Open appropriate edit dialog based on type
                        if (statisticsDialog.type === 'Blog Post') {
                          setEditMode({ type: 'blog', item: statisticsDialog.item });
                          setShowBlogDialog(true);
                        } else if (statisticsDialog.type === 'Workshop') {
                          setEditMode({ type: 'workshop', item: statisticsDialog.item });
                          setShowWorkshopDialog(true);
                        } else if (statisticsDialog.type === 'Course') {
                          setEditMode({ type: 'course', item: statisticsDialog.item });
                          setShowCourseDialog(true);
                        } else if (statisticsDialog.type === 'Campaign') {
                          setEditMode({ type: 'campaign', item: statisticsDialog.item });
                          setShowCampaignDialog(true);
                        } else if (statisticsDialog.type === 'Workshop Registration') {
                          setStatusUpdateDialog({ open: true, registration: statisticsDialog.item });
                        }
                      }}
                      size="sm"
                      className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/50 hover:bg-cosmic-blue/30"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Quick Edit
                    </Button>
                  </div>
                  <GlassMorphism className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-space-400 text-sm">Title/Name</p>
                        <p className="text-white font-medium">{statisticsDialog.item?.title || statisticsDialog.item?.name}</p>
                      </div>
                      <div>
                        <p className="text-space-400 text-sm">Created</p>
                        <p className="text-white font-medium">
                          {statisticsDialog.item?.createdAt ? new Date(statisticsDialog.item.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-space-400 text-sm">Last Updated</p>
                        <p className="text-white font-medium">
                          {statisticsDialog.item?.updatedAt ? new Date(statisticsDialog.item.updatedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-space-400 text-sm">ID</p>
                        <p className="text-white font-medium">{statisticsDialog.item?.id}</p>
                      </div>
                    </div>
                    {statisticsDialog.item?.description && (
                      <div className="mt-4">
                        <p className="text-space-400 text-sm mb-2">Description</p>
                        <div className="bg-space-700 p-3 rounded-lg">
                          <p className="text-white">{statisticsDialog.item.description}</p>
                        </div>
                      </div>
                    )}
                  </GlassMorphism>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Close statistics dialog and open edit dialog
                        setStatisticsDialog({ open: false, type: '', item: null });
                        
                        // Open appropriate edit dialog based on type
                        if (statisticsDialog.type === 'Blog Post') {
                          setEditMode({ type: 'blog', item: statisticsDialog.item });
                          setShowBlogDialog(true);
                        } else if (statisticsDialog.type === 'Workshop') {
                          setEditMode({ type: 'workshop', item: statisticsDialog.item });
                          setShowWorkshopDialog(true);
                        } else if (statisticsDialog.type === 'Course') {
                          setEditMode({ type: 'course', item: statisticsDialog.item });
                          setShowCourseDialog(true);
                        } else if (statisticsDialog.type === 'Campaign') {
                          setEditMode({ type: 'campaign', item: statisticsDialog.item });
                          setShowCampaignDialog(true);
                        } else if (statisticsDialog.type === 'Workshop Registration') {
                          setStatusUpdateDialog({ open: true, registration: statisticsDialog.item });
                        }
                      }}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit {statisticsDialog.type}
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Statistics Export",
                          description: "Statistics data exported successfully",
                          className: "bg-green-500/10 border-green-500 text-white",
                        });
                      }}
                      className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Statistics Refreshed",
                          description: "All statistics have been refreshed",
                          className: "bg-cosmic-blue/10 border-cosmic-blue text-white",
                        });
                      }}
                      className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/50 hover:bg-cosmic-blue/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Stats
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setStatisticsDialog({ open: false, type: '', item: null })}
                    className="border-space-600 text-space-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;