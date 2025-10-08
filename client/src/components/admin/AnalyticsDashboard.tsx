import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, BookOpen, Calendar, 
  Rocket, Award, Mail, DollarSign, Activity
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsProps {
  users: any[];
  courses: any[];
  workshops: any[];
  campaigns: any[];
  blogPosts: any[];
  inquiries: any[];
  enrollments?: any[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsDashboard({
  users,
  courses,
  workshops,
  campaigns,
  blogPosts,
  inquiries,
  enrollments = []
}: AnalyticsProps) {
  
  // Calculate growth metrics
  const calculateGrowth = (data: any[], dateField = 'createdAt') => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    const previousWeek = subDays(now, 14);
    
    const currentWeek = data.filter(item => 
      new Date(item[dateField]) >= lastWeek
    ).length;
    
    const prevWeek = data.filter(item => {
      const date = new Date(item[dateField]);
      return date >= previousWeek && date < lastWeek;
    }).length;
    
    const growth = prevWeek > 0 ? ((currentWeek - prevWeek) / prevWeek) * 100 : 100;
    return { current: currentWeek, growth: Math.round(growth) };
  };

  const userGrowth = calculateGrowth(users);
  const inquiryGrowth = calculateGrowth(inquiries);

  // Generate time series data for user registrations
  const generateTimeSeriesData = () => {
    const days = 30;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayUsers = users.filter(user => {
        const userDate = startOfDay(new Date(user.createdAt));
        return userDate.getTime() === startOfDay(date).getTime();
      }).length;
      
      const dayInquiries = inquiries.filter(inq => {
        const inqDate = startOfDay(new Date(inq.createdAt));
        return inqDate.getTime() === startOfDay(date).getTime();
      }).length;
      
      data.push({
        date: format(date, 'MMM dd'),
        users: dayUsers,
        inquiries: dayInquiries
      });
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Content distribution
  const contentData = [
    { name: 'Courses', value: courses.length, icon: BookOpen },
    { name: 'Workshops', value: workshops.length, icon: Calendar },
    { name: 'Campaigns', value: campaigns.length, icon: Rocket },
    { name: 'Blog Posts', value: blogPosts.length, icon: BookOpen },
  ];

  // Course enrollment data
  const courseEnrollmentData = courses
    .filter(c => c.enrollmentCount > 0)
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5)
    .map(course => ({
      name: course.title.substring(0, 20) + (course.title.length > 20 ? '...' : ''),
      enrollments: course.enrollmentCount || 0
    }));

  // Revenue estimation (if prices are available)
  const estimatedRevenue = courses.reduce((total, course) => {
    const price = parseFloat(course.price || '0');
    const enrollments = course.enrollmentCount || 0;
    return total + (price * enrollments);
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }: any) => (
    <motion.div variants={itemVariants}>
      <Card className="bg-space-800/50 border-space-700 hover:bg-space-800/70 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-space-300">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-${color}-500/10 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-4 h-4 text-${color}-400`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{value}</div>
          {growth !== undefined && (
            <div className="flex items-center gap-1 text-xs mt-1">
              {growth >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">+{growth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-red-400">{growth}%</span>
                </>
              )}
              <span className="text-space-400 ml-1">from last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          growth={userGrowth.growth}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Courses"
          value={courses.filter(c => c.status === 'live').length}
          growth={undefined}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Total Enrollments"
          value={courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)}
          growth={undefined}
          icon={Award}
          color="green"
        />
        <StatCard
          title="Inquiries"
          value={inquiries.length}
          growth={inquiryGrowth.growth}
          icon={Mail}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-space-800/50 border-space-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Platform Activity (Last 30 Days)
              </CardTitle>
              <CardDescription className="text-space-400">
                User registrations, inquiries, and enrollments over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="inquiries" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorInquiries)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Courses by Enrollment */}
        <motion.div variants={itemVariants}>
          <Card className="bg-space-800/50 border-space-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Top Courses by Enrollment
              </CardTitle>
              <CardDescription className="text-space-400">
                Most popular courses on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseEnrollmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="enrollments" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="bg-space-800/50 border-space-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                Content Distribution
              </CardTitle>
              <CardDescription className="text-space-400">
                Breakdown of platform content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-space-800/50 border-space-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                Revenue & Engagement
              </CardTitle>
              <CardDescription className="text-space-400">
                Platform monetization and user engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-space-700/50">
                <div>
                  <p className="text-sm text-space-400">Estimated Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{estimatedRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-space-700/50">
                <div>
                  <p className="text-sm text-space-400">Avg. Enrollment Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {courses.length > 0 ? Math.round((courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0) / courses.length) * 10) / 10 : 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-space-700/50">
                <div>
                  <p className="text-sm text-space-400">Active Workshops</p>
                  <p className="text-2xl font-bold text-white">
                    {workshops.filter(w => new Date(w.startDate) > new Date()).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

