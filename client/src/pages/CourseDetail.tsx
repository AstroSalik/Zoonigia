import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Star, 
  CheckCircle, 
  Download,
  User,
  Award,
  Users,
  Eye,
  HelpCircle,
  Trophy,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Lock,
  Loader2,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';
import SocialShare from '@/components/SocialShare';
import VideoPlayer from '@/components/VideoPlayer';
import DiscussionForum from '@/components/DiscussionForum';
import ResourceLibrary from '@/components/ResourceLibrary';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Type definitions
interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  instructorName: string;
  field: string;
  duration: string;
  status: 'upcoming' | 'accepting_registrations' | 'live' | 'completed';
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: number;
  about: string;
  learningObjectives: string[];
  prerequisites: string[];
  enrollmentCount: number;
  rating: number;
  instructorId: string;
}

interface CourseLesson {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz';
  duration: number;
  isPreview: boolean;
  videoUrl?: string;
  content?: string;
  resources?: any[];
  orderIndex: number;
}

interface StudentProgress {
  id: number;
  lessonId: number;
  completed: boolean;
  timeSpent: number;
}

interface CourseReview {
  id: number;
  rating: number;
  review: string;
  authorName: string;
  createdAt: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

// Payment Dialog Component
const PaymentDialog = ({ 
  course, 
  orderData, 
  onSuccess, 
  onCancel,
  isOpen,
  onOpenChange
}: { 
  course: Course, 
  orderData: any, 
  onSuccess: (paymentData: any) => void, 
  onCancel: () => void,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!orderData || isProcessing) return;

    setIsProcessing(true);

    try {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zoonigia",
        description: course.title,
        order_id: orderData.orderId,
        handler: function (response: any) {
          onSuccess({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentAmount: (orderData.amount / 100).toString(),
            userId: user?.id,
            courseId: course.id
          });
        },
        prefill: {
          name: user?.displayName || user?.email,
          email: user?.email,
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            onCancel();
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div>
              <p className="text-sm text-gray-600">Course</p>
              <p className="font-semibold text-gray-900">{course.title}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span className="font-medium text-gray-700">Amount</span>
            <span className="text-3xl font-bold text-purple-600">{course.isFree ? 'FREE' : `₹${course.price}`}</span>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-base font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Securely
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              disabled={isProcessing}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Professional Learning Interface for Enrolled Students
const LearningInterface = ({ 
  course, 
  lessons, 
  progress, 
  onLessonComplete,
  hasCertificate,
  onGenerateCertificate
}: { 
  course: Course,
  lessons: CourseLesson[],
  progress: StudentProgress[],
  onLessonComplete: (lessonId: number) => void,
  hasCertificate: boolean,
  onGenerateCertificate: () => void
}) => {
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [, navigate] = useLocation();

  // Initialize with first incomplete lesson
  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      const firstIncomplete = lessons.find(lesson => 
        !progress.some(p => p.lessonId === lesson.id && p.completed)
      );
      setSelectedLesson(firstIncomplete || lessons[0]);
    }
  }, [lessons, progress, selectedLesson]);

  const isLessonCompleted = (lessonId: number) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  };

  const completedLessons = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  const isCourseCompleted = completedLessons === lessons.length && lessons.length > 0;

  // Show completion modal when course is completed
  useEffect(() => {
    if (isCourseCompleted && !hasCertificate && !showCompletionModal) {
      setShowCompletionModal(true);
    }
  }, [isCourseCompleted, hasCertificate, showCompletionModal]);

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMarkComplete = () => {
    if (selectedLesson && !isLessonCompleted(selectedLesson.id)) {
      onLessonComplete(selectedLesson.id);
    }
  };

  const currentLessonIndex = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Professional Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/courses')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Courses
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h1 className="font-semibold text-gray-900 truncate max-w-md">{course.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {completedLessons}/{lessons.length} Complete
                </span>
              </div>
              {isCourseCompleted && (
                <Badge className="bg-green-600 hover:bg-green-700">
                  <Trophy className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Curriculum */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 shadow-lg overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 text-lg">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Your Progress</span>
                <span className="font-semibold text-purple-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {completedLessons} of {lessons.length} lessons completed
              </p>
            </div>

            {/* Certificate Button */}
            {isCourseCompleted && hasCertificate && (
              <Button
                onClick={onGenerateCertificate}
                size="sm"
                className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
              >
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isActive = selectedLesson?.id === lesson.id;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 shadow-md' 
                        : isCompleted
                        ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                            isActive ? 'border-purple-600 text-purple-600 bg-white' : 'border-gray-300 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          isActive ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {lesson.type === 'video' && <PlayCircle className="w-3 h-3 text-gray-400" />}
                            {lesson.type === 'text' && <FileText className="w-3 h-3 text-gray-400" />}
                            {lesson.type === 'quiz' && <HelpCircle className="w-3 h-3 text-gray-400" />}
                            <span className="text-xs text-gray-500">{lesson.duration} min</span>
                          </div>
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Lesson Header */}
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {!sidebarOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="flex-shrink-0"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      Lesson {currentLessonIndex + 1}
                    </Badge>
                    {selectedLesson?.type === 'video' && <PlayCircle className="w-4 h-4 text-purple-600" />}
                    {selectedLesson?.type === 'text' && <FileText className="w-4 h-4 text-blue-600" />}
                    {selectedLesson?.type === 'quiz' && <HelpCircle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <h2 className="font-bold text-gray-900 text-xl truncate">{selectedLesson?.title}</h2>
                  <p className="text-sm text-gray-500 truncate">{selectedLesson?.description}</p>
                </div>
              </div>
              
              {selectedLesson && !isLessonCompleted(selectedLesson.id) && (
                <Button
                  onClick={handleMarkComplete}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

          {/* Lesson Content */}
          <ScrollArea className="flex-1 bg-gray-50">
            <div className="container mx-auto p-6 max-w-5xl">
              {selectedLesson ? (
                <div className="space-y-6">
                  {/* Video Content */}
                  {selectedLesson.type === 'video' && selectedLesson.videoUrl && (
                    <Card className="overflow-hidden border-2 border-purple-200 shadow-lg">
                      <div className="bg-black aspect-video">
                        <VideoPlayer
                          videoUrl={selectedLesson.videoUrl}
                          title={selectedLesson.title}
                          onProgress={(progress) => {
                            // Track video progress
                          }}
                          onComplete={() => {
                            if (!isLessonCompleted(selectedLesson.id)) {
                              handleMarkComplete();
                            }
                          }}
                        />
                      </div>
                    </Card>
                  )}

                  {/* Text Content */}
                  {selectedLesson.type === 'text' && selectedLesson.content && (
                    <Card className="border-2 border-blue-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                          <FileText className="w-5 h-5" />
                          Lesson Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div 
                          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900"
                          dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Quiz Content */}
                  {selectedLesson.type === 'quiz' && (
                    <Card className="border-2 border-orange-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <CardTitle className="flex items-center gap-2 text-orange-900">
                          <HelpCircle className="w-5 h-5" />
                          Knowledge Check
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                          <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Coming Soon</h3>
                          <p className="text-gray-600 mb-6">
                            Interactive quizzes will be available soon to test your understanding.
                          </p>
                          <Button
                            onClick={handleMarkComplete}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Lesson Resources */}
                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <Card className="border-2 border-purple-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                          <Download className="w-5 h-5" />
                          Downloadable Resources
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-3">
                          {selectedLesson.resources.map((resource: string, index: number) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-purple-600" />
                              </div>
                              <span className="flex-1 font-medium text-gray-900">{resource}</span>
                              <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Select a lesson to begin learning</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <Button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round((currentLessonIndex + 1) / lessons.length * 100)}% of course
                </p>
              </div>
              
              <Button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === lessons.length - 1}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Completion Celebration Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-lg">
          <div className="text-center py-6">
            <div className="mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full animate-pulse" />
              </div>
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto relative z-10 drop-shadow-lg" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              You've successfully completed
            </p>
            <p className="text-xl font-bold text-purple-600 mb-4">
              {course.title}
            </p>
            <p className="text-gray-600 mb-8">
              You've mastered all {lessons.length} lessons. Time to celebrate your achievement!
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  onGenerateCertificate();
                  setShowCompletionModal(false);
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white h-12 text-base font-semibold"
              >
                <Award className="w-5 h-5 mr-2" />
                Generate Certificate
              </Button>
              <Button
                onClick={() => setShowCompletionModal(false)}
                variant="outline"
                className="w-full"
              >
                Continue Reviewing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id,
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<CourseLesson[]>({
    queryKey: [`/api/courses/${id}/lessons`],
    enabled: !!id,
  });

  // Fetch enrollment status
  const { 
    data: enrollmentStatus, 
    isLoading: enrollmentLoading,
    error: enrollmentError,
    refetch: refetchEnrollment 
  } = useQuery<{ isEnrolled: boolean, enrollment: any }>({
    queryKey: [`/api/courses/${id}/enrollment-status`],
    enabled: !!id && isAuthenticated && !authLoading,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    retry: 2,
    retryDelay: 500,
  });


  // Fetch progress
  const { 
    data: progress = [], 
    isLoading: progressLoading,
    refetch: refetchProgress 
  } = useQuery<StudentProgress[]>({
    queryKey: [`/api/courses/${id}/progress`],
    enabled: !!id && isAuthenticated && enrollmentStatus?.isEnrolled === true,
    staleTime: 0,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery<CourseReview[]>({
    queryKey: [`/api/courses/${id}/reviews`],
    enabled: !!id,
  });

  // Fetch certificates
  const { data: userCertificates = [] } = useQuery<any[]>({
    queryKey: ['/api/user/certificates'],
    enabled: isAuthenticated,
  });

  // Create payment order mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (data: { courseId: number, paymentAmount: number }) => {
      const response = await apiRequest("POST", "/api/courses/create-payment-order", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setOrderData(data);
      setShowPayment(true);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Setup Failed",
        description: "Unable to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Complete enrollment after payment mutation
  const enrollMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('POST', '/api/courses/enroll', paymentData);
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "🎉 Enrollment Successful!",
        description: "Welcome to the course! Loading your learning interface...",
      });
      setShowPayment(false);
      setOrderData(null);
      
      // Force refetch enrollment status
      await refetchEnrollment();
      await refetchProgress();
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in the course. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Progress mutation
  const progressMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      return apiRequest('POST', `/api/lessons/${lessonId}/progress`, {
        courseId: parseInt(id!),
        lessonId,
        completed: true,
        timeSpent: 15
      });
    },
    onSuccess: async () => {
      await refetchProgress();
      
      const updatedProgress = await queryClient.fetchQuery({
        queryKey: [`/api/courses/${id}/progress`],
      });
      
      const completedCount = (updatedProgress as StudentProgress[]).filter(p => p.completed).length;
      
      if (completedCount === lessons.length && lessons.length > 0) {
        try {
          await apiRequest('POST', `/api/courses/${id}/generate-certificate`, {});
          queryClient.invalidateQueries({ queryKey: ['/api/user/certificates'] });
          
          toast({
            title: "🎉 Course Completed!",
            description: "Your certificate is being generated...",
          });
        } catch (error) {
          console.error('Error generating certificate:', error);
        }
      } else {
        toast({
          title: "✓ Lesson Completed",
          description: "Great job! Keep going!",
        });
      }
    }
  });

  // Certificate mutation
  const certificateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/courses/${id}/generate-certificate`, {});
      return await response.json();
    },
    onSuccess: (certificate) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/certificates'] });
      toast({
        title: "Certificate Ready!",
        description: "Your course completion certificate is ready.",
      });
    },
    onError: () => {
      toast({
        title: "Certificate Not Available",
        description: "Please complete all lessons first.",
        variant: "destructive",
      });
    }
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return apiRequest('POST', `/api/courses/${id}/reviews`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/reviews`] });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    }
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      review: ''
    }
  });

  const onSubmitReview = (data: ReviewFormData) => {
    reviewMutation.mutate(data);
  };

  const handleEnrollment = () => {
    if (!course) return;
    
    createPaymentMutation.mutate({
      courseId: course.id,
      paymentAmount: course.price
    });
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast({
      title: "Payment Successful!",
      description: "Processing your enrollment...",
    });
    
    enrollMutation.mutate(paymentData);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderData(null);
    toast({
      title: "Payment Cancelled",
      description: "You can complete the payment later.",
    });
  };

  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const completedLessons = progress.filter((p: StudentProgress) => p.completed).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const hasCertificate = userCertificates.some((cert: any) => cert.courseId === parseInt(id!));


  // Loading state
  const isLoading = courseLoading || authLoading || lessonsLoading || (isAuthenticated && enrollmentLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/courses')} variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900">
            ← Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  // Show Learning Interface for enrolled students in live or accepting_registrations courses
  if (isAuthenticated && isEnrolled && (course.status === 'live' || course.status === 'accepting_registrations') && !progressLoading) {
    return (
      <LearningInterface
        course={course}
        lessons={lessons}
        progress={progress}
        onLessonComplete={(lessonId) => progressMutation.mutate(lessonId)}
        hasCertificate={hasCertificate}
        onGenerateCertificate={() => certificateMutation.mutate()}
      />
    );
  }

  // Show Course Preview for non-enrolled students
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/courses')} 
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                ← Back to Courses
              </Button>
              
              {hasCertificate && (
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  <Award className="w-4 h-4 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
            
            <SocialShare 
              url={`/courses/${id}`}
              title={course.title}
              description={course.description}
              hashtags={['Zoonigia', 'SpaceEducation', course.field]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={course.imageUrl || '/api/placeholder/150/100'} 
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {course.instructorName || 'Space Science Institute'}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.field}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-white/80 text-base leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Enrollment Panel */}
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Course Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.status !== 'upcoming' && (
                      <div className="flex items-center justify-between">
                        <span>Price:</span>
                        <span className="text-2xl font-bold">₹{course.price}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span>Level:</span>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant={course.status === 'live' ? 'default' : 'secondary'}>
                        {course.status === 'upcoming' ? 'Coming Soon' : 
                         course.status === 'accepting_registrations' ? 'Accepting Registrations' : 
                         'Live'}
                      </Badge>
                    </div>

                    {course.status === 'upcoming' ? (
                      <div className="text-center">
                        <p className="text-blue-400 font-medium">Coming Soon</p>
                        <p className="text-sm text-white/70 mt-2">
                          This course is not yet available for enrollment.
                        </p>
                      </div>
                    ) : course.status === 'accepting_registrations' ? (
                      isAuthenticated ? (
                        isEnrolled ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                              <p className="text-green-400 font-medium">Registered</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-white/70">
                                You'll receive access to full course content once it goes live.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleEnrollment} 
                            disabled={createPaymentMutation.isPending}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                            {createPaymentMutation.isPending ? 'Processing...' : 'Register Now'}
                          </Button>
                        )
                      ) : (
                        <Button 
                          onClick={() => navigate('/api/login')}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                        >
                          Login to Register
                        </Button>
                      )
                    ) : (
                      isAuthenticated ? (
                        isEnrolled ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                              <p className="text-green-400 font-medium">Enrolled</p>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>{Math.round(progressPercentage)}%</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                              <p className="text-xs text-white/70 mt-1">
                                {completedLessons} of {totalLessons} lessons completed
                              </p>
                            </div>
                            <Button 
                              onClick={() => window.location.reload()}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              Continue Learning
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleEnrollment} 
                            disabled={createPaymentMutation.isPending}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            {createPaymentMutation.isPending ? 'Processing...' : 'Enroll Now'}
                          </Button>
                        )
                      ) : (
                        <Button 
                          onClick={() => navigate('/api/login')}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Login to Enroll
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <Tabs defaultValue="about" className="p-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              {course.about && (
                <div>
                  <h4 className="text-white font-medium mb-2">Course Description</h4>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{course.about}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-white font-medium mb-2">Learning Objectives</h4>
                <div className="space-y-2">
                  {course.learningObjectives?.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{objective}</span>
                    </div>
                  )) || (
                    <p className="text-white/60">No specific learning objectives defined.</p>
                  )}
                </div>
              </div>

              <Separator className="bg-white/20" />

              <div>
                <h4 className="text-white font-medium mb-2">Prerequisites</h4>
                <div className="space-y-2">
                  {course.prerequisites?.map((prerequisite: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{prerequisite}</span>
                    </div>
                  )) || (
                    <p className="text-white/60">No specific prerequisites required.</p>
                  )}
                </div>
              </div>

              <Separator className="bg-white/20" />

              <div>
                <h4 className="text-white font-medium mb-2">Course Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{course.enrollmentCount || 0}</div>
                    <div className="text-sm text-white/70">Enrolled Students</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{course.rating || '0.0'}</div>
                    <div className="text-sm text-white/70">Average Rating</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <div className="space-y-4">
                {lessons
                  .filter((lesson: any) => {
                    if (course.status === 'live') return true;
                    if (course.status === 'accepting_registrations') return lesson.isPreview;
                    return false;
                  })
                  .map((lesson: any, index: number) => {
                  const isLocked = !isEnrolled && !lesson.isPreview;
                  
                  return (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <div className="flex-shrink-0">
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-white/30" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center text-xs text-white/70">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{lesson.title}</h4>
                        <p className="text-white/70 text-sm">{lesson.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            {lesson.type === 'video' && <PlayCircle className="w-3 h-3" />}
                            {lesson.type === 'text' && <FileText className="w-3 h-3" />}
                            {lesson.type === 'quiz' && <HelpCircle className="w-3 h-3" />}
                            {lesson.type}
                          </span>
                          {lesson.isPreview && (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Badge>
                          )}
                        </div>
                      </div>

                      {isLocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="text-gray-500 border-gray-500 cursor-not-allowed"
                        >
                          Enroll to Access
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {isEnrolled && course.status === 'live' && (
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Rating</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <FormControl>
                                  <SelectTrigger className="bg-white border-gray-300">
                                    <SelectValue placeholder="Select rating" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                                  <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                                  <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                                  <SelectItem value="2">⭐⭐ Poor</SelectItem>
                                  <SelectItem value="1">⭐ Very Poor</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="review"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Your Review</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Share your experience with this course..."
                                  className="bg-white border-gray-300 min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={reviewMutation.isPending}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review: CourseReview) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                        <p className="text-sm text-gray-500 mt-2">- {review.authorName}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this course!
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <ResourceLibrary
                referenceType="course"
                referenceId={parseInt(id!)}
                title="Course Materials & Resources"
                allowUpload={user?.isAdmin || user?.id === course.instructorId}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Payment Dialog */}
      {course && orderData && (
        <PaymentDialog
          course={course}
          orderData={orderData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          isOpen={showPayment}
          onOpenChange={setShowPayment}
        />
      )}
    </div>
  );
}
