import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Bot, 
  Satellite, 
  Atom, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Course } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [, setLocation] = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Check enrollment status for all courses
  useEffect(() => {
    const checkEnrollments = async () => {
      if (!user || !courses) return;

      const enrolled = new Set<number>();
      for (const course of courses) {
        try {
          const response = await fetch(`/api/courses/${course.id}/enrollment/${user.id}`);
          const enrollment = await response.json();
          if (enrollment) {
            enrolled.add(course.id);
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
      setEnrolledCourses(enrolled);
    };

    checkEnrollments();
  }, [user, courses]);

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "all" || course.field === selectedField;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesField && matchesLevel;
  });

  const getCourseIcon = (field: string) => {
    switch (field) {
      case "astronomy":
        return <Star className="w-6 h-6" />;
      case "robotics":
        return <Bot className="w-6 h-6" />;
      case "quantum":
        return <Atom className="w-6 h-6" />;
      case "aerospace":
        return <Satellite className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const getCourseColor = (field: string) => {
    switch (field) {
      case "astronomy":
        return "text-cosmic-blue";
      case "robotics":
        return "text-cosmic-purple";
      case "quantum":
        return "text-cosmic-orange";
      case "aerospace":
        return "text-cosmic-green";
      default:
        return "text-cosmic-blue";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-cosmic-green";
      case "intermediate":
        return "bg-cosmic-blue";
      case "advanced":
        return "bg-cosmic-orange";
      default:
        return "bg-cosmic-blue";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              Our <span className="text-cosmic-blue">Courses</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Comprehensive learning paths in frontier sciences designed to expand your understanding of the universe
            </p>
          </div>

          {/* Filters */}
          <GlassMorphism className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 bg-space-700 border-space-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="astronomy">Astronomy</SelectItem>
                  <SelectItem value="robotics">Robotics & AI</SelectItem>
                  <SelectItem value="quantum">Quantum Mechanics</SelectItem>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </GlassMorphism>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses?.map((course) => (
              <Card key={course.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${getCourseColor(course.field)}`}>
                      {getCourseIcon(course.field)}
                      <CardTitle className="text-2xl font-semibold ml-3">{course.title}</CardTitle>
                    </div>
                    <Badge className={`${getLevelColor(course.level)} text-space-900`}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-space-300 mb-6">{course.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-space-400">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {course.duration}
                    </div>
                    
                    <div className="flex items-center text-sm text-space-400">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Field: {course.field}
                    </div>
                    
                    <div className="flex items-center text-sm text-space-400">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Level: {course.level}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {course.status === 'upcoming' ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 w-fit">
                          Coming Soon
                        </Badge>
                      ) : (
                        <span className="text-3xl font-bold text-cosmic-blue">
                          ₹{course.price}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      {enrolledCourses.has(course.id) ? (
                        <div className="bg-cosmic-green/20 border border-cosmic-green rounded-lg px-6 py-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-cosmic-green" />
                          <span className="text-cosmic-green font-semibold">Enrolled</span>
                        </div>
                      ) : course.status === 'upcoming' ? (
                        <Button 
                          disabled
                          className="bg-gray-600 text-gray-400 cursor-not-allowed px-6"
                        >
                          Coming Soon
                        </Button>
                      ) : course.status === 'accepting_registrations' ? (
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600 px-6"
                          onClick={() => setLocation(`/courses/${course.id}`)}
                        >
                          Register Now
                        </Button>
                      ) : (
                        <Button 
                          className="cosmic-gradient hover:opacity-90 px-6"
                          onClick={() => setLocation(`/courses/${course.id}`)}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses?.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-space-300 mb-4">No courses found</h3>
              <p className="text-space-400 mb-8">Try adjusting your filters or search terms</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedField("all");
                setSelectedLevel("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Course Learning Benefits */}
          <div className="mt-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Learning Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full cosmic-gradient flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-space-900" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Structured Curriculum</h3>
                  <p className="text-space-300 leading-relaxed">
                    Comprehensive modules designed by experts, progressing from fundamentals to advanced applications in frontier sciences
                  </p>
                </div>
              </GlassMorphism>
              
              <GlassMorphism className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full cosmic-gradient flex items-center justify-center mb-6">
                    <Satellite className="w-10 h-10 text-space-900" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Hands-On Projects</h3>
                  <p className="text-space-300 leading-relaxed">
                    Apply concepts through real-world projects and simulations, working with actual data from NASA and global research partners
                  </p>
                </div>
              </GlassMorphism>
              
              <GlassMorphism className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full cosmic-gradient flex items-center justify-center mb-6">
                    <TrendingUp className="w-10 h-10 text-space-900" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Certification & Recognition</h3>
                  <p className="text-space-300 leading-relaxed">
                    Earn certificates recognized by leading institutions, showcasing your expertise in cutting-edge scientific domains
                  </p>
                </div>
              </GlassMorphism>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Start Learning?</h3>
              <p className="text-space-300 mb-6">
                Join thousands of students who are already advancing their careers with our comprehensive courses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="cosmic-gradient hover:opacity-90 px-8"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  View All Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8"
                  onClick={() => setLocation('/contact')}
                >
                  Contact for Custom Training
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

export default Courses;
