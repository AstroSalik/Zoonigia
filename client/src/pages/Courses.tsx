import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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
  ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { Course } from "@shared/schema";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

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
                    <span className="text-3xl font-bold text-cosmic-blue">
                      ₹{course.price}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button className="cosmic-gradient hover:opacity-90 px-6">
                        Enroll Now
                      </Button>
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

          {/* Featured Courses */}
          <div className="mt-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassMorphism className="p-6 text-center">
                <Star className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Basic Astronomy</h3>
                <p className="text-space-300 text-sm mb-4">Perfect for beginners</p>
                <Badge className="bg-cosmic-green text-space-900">8 weeks</Badge>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Bot className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Robotics & AI</h3>
                <p className="text-space-300 text-sm mb-4">Hands-on programming</p>
                <Badge className="bg-cosmic-blue text-space-900">10 weeks</Badge>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Satellite className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Astronomy & AI</h3>
                <p className="text-space-300 text-sm mb-4">Advanced applications</p>
                <Badge className="bg-cosmic-orange text-space-900">12 weeks</Badge>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Atom className="w-12 h-12 text-cosmic-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quantum Mechanics</h3>
                <p className="text-space-300 text-sm mb-4">Mind-bending physics</p>
                <Badge className="bg-cosmic-purple text-space-900">10 weeks</Badge>
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
                <Button className="cosmic-gradient hover:opacity-90 px-8">
                  View All Courses
                </Button>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8">
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
