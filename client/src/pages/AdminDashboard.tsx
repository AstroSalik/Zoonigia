import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import AdminRoute from "@/components/AdminRoute";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Mail, 
  Trophy, 
  Settings, 
  BarChart3,
  Shield,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { User, BlogPost, Workshop, Course, Campaign, ContactInquiry } from "@shared/schema";

const AdminDashboard = () => {
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

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Blog Posts",
      value: blogPosts.length,
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Workshops",
      value: workshops.length,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Inquiries",
      value: inquiries.length,
      icon: Mail,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-cosmic-blue" />
                  <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                </div>
                <p className="text-space-300">
                  Manage and monitor all aspects of the Zoonigia platform
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <GlassMorphism key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-space-400 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </GlassMorphism>
                ))}
              </div>

              {/* Main Content */}
              <GlassMorphism className="p-6">
                <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="workshops">Workshops</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">User Management</h2>
                    <Button className="cosmic-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-space-700">
                          <th className="text-left p-3 text-space-300">Name</th>
                          <th className="text-left p-3 text-space-300">Email</th>
                          <th className="text-left p-3 text-space-300">Type</th>
                          <th className="text-left p-3 text-space-300">Admin</th>
                          <th className="text-left p-3 text-space-300">Joined</th>
                          <th className="text-left p-3 text-space-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-space-800">
                            <td className="p-3 text-white">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="p-3 text-white">{user.email}</td>
                            <td className="p-3">
                              <Badge variant="secondary">{user.userType}</Badge>
                            </td>
                            <td className="p-3">
                              {user.isAdmin ? (
                                <Badge className="bg-green-500">Admin</Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </td>
                            <td className="p-3 text-white">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-3 space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">Content Management</h2>
                    <Button className="cosmic-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      New Blog Post
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {blogPosts.map((post) => (
                      <Card key={post.id} className="bg-space-800 border-space-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{post.title}</CardTitle>
                              <CardDescription className="text-space-400">
                                By {post.authorName} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-space-300 text-sm line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Workshops Tab */}
                <TabsContent value="workshops" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">Workshop Management</h2>
                    <Button className="cosmic-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workshop
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {workshops.map((workshop) => (
                      <Card key={workshop.id} className="bg-space-800 border-space-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{workshop.title}</CardTitle>
                              <CardDescription className="text-space-400">
                                {workshop.type} • {workshop.startDate} - {workshop.endDate}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant={workshop.isActive ? "default" : "secondary"}>
                                {workshop.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-space-300">
                              {workshop.currentParticipants}/{workshop.maxParticipants} participants
                            </span>
                            <span className="text-cosmic-blue font-semibold">
                              ₹{workshop.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">Course Management</h2>
                    <Button className="cosmic-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {courses.map((course) => (
                      <Card key={course.id} className="bg-space-800 border-space-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{course.title}</CardTitle>
                              <CardDescription className="text-space-400">
                                {course.level} • {course.duration} weeks
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant={course.isActive ? "default" : "secondary"}>
                                {course.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-space-300">
                              {course.currentEnrollments}/{course.maxEnrollments} enrolled
                            </span>
                            <span className="text-cosmic-blue font-semibold">
                              ₹{course.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">Campaign Management</h2>
                    <Button className="cosmic-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="bg-space-800 border-space-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{campaign.title}</CardTitle>
                              <CardDescription className="text-space-400">
                                {campaign.startDate} - {campaign.endDate}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant={campaign.isActive ? "default" : "secondary"}>
                                {campaign.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-space-300">
                              {campaign.currentParticipants}/{campaign.maxParticipants} participants
                            </span>
                            <span className="text-cosmic-blue font-semibold">
                              ₹{campaign.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Inquiries Tab */}
                <TabsContent value="inquiries" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">Inquiry Management</h2>
                    <Button className="cosmic-gradient">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {inquiries.map((inquiry) => (
                      <Card key={inquiry.id} className="bg-space-800 border-space-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{inquiry.name}</CardTitle>
                              <CardDescription className="text-space-400">
                                {inquiry.email} • {inquiry.subject}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant="outline">
                                {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'Recent'}
                              </Badge>
                              <Button size="sm" variant="outline">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-space-300 text-sm line-clamp-2">
                            {inquiry.message}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassMorphism>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;