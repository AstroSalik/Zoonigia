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
  Rocket, Target, Award, Phone, Clock, IndianRupee,
  Download, RefreshCw
} from "lucide-react";
import { 
  User, BlogPost, Workshop, Course, Campaign, ContactInquiry, WorkshopRegistration
} from "@shared/types";

// Form schemas
const blogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  authorName: z.string().min(1, "Author is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean().default(false),
});

const workshopFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be 0 or higher"),
  maxParticipants: z.number().min(1, "Max participants must be at least 1"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().optional(),
});

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructorName: z.string().min(1, "Instructor name is required"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be 0 or higher"),
  field: z.enum(["quantum_mechanics", "tech_ai", "astrophysics", "space_technology", "robotics", "biotechnology", "nanotechnology", "renewable_energy"]),
  imageUrl: z.string().optional(),
  status: z.enum(["upcoming", "accepting_registrations", "live"]).default("upcoming"),
});

const campaignFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  field: z.string().min(1, "Field is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be 0 or higher"),
  targetParticipants: z.number().min(1, "Target participants must be at least 1"),
  requirements: z.string().min(1, "Requirements are required"),
  timeline: z.string().min(1, "Timeline is required"),
  outcomes: z.string().min(1, "Outcomes are required"),
  imageUrl: z.string().optional(),
  status: z.enum(["upcoming", "active", "closed", "completed"]).default("upcoming"),
});

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black">
        <Navigation />
        
        <main className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your platform content and users
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-900/50 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-500">Platform users</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-500">Live courses</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Campaigns</CardTitle>
                    <Rocket className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-500">Research campaigns</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Revenue</CardTitle>
                    <IndianRupee className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">₹0</div>
                    <p className="text-xs text-gray-500">Total revenue</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage platform users and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No users found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Content Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage blog posts and educational content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No content found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workshops" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Workshop Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage workshop registrations and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No workshops found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Course Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage courses and curriculum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No courses found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage research campaigns and projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No campaigns found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inquiries" className="mt-6">
              <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Inquiry Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage contact inquiries and support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No inquiries found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </AdminRoute>
  );
}