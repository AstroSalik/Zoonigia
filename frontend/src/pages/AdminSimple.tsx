import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import AdminRoute from "@/components/AdminRoute";
import { Shield, Users, BookOpen, Calendar, Mail } from "lucide-react";
import { User, BlogPost, Workshop, Course, Campaign, ContactInquiry } from "@shared/schema";

const AdminSimple = () => {
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
                  Manage and monitor all aspects of the Zoonigia platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

              <GlassMorphism className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
                <p className="text-space-300">
                  Welcome to the Zoonigia Admin Dashboard! Here you can manage all aspects of the platform.
                </p>
              </GlassMorphism>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminSimple;