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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Star, 
  CheckCircle, 
  CheckCircle2,
  Download,
  User,
  Award,
  Users,
  Eye,
  Target,
  Wrench,
  Package,
  Lightbulb,
  Trophy,
  Sparkles,
  HelpCircle,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Lock,
  Loader2,
  GraduationCap,
  Zap,
  Phone,
  Building,
  Mail
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
            <div className="text-right">
              {orderData?.originalAmount && orderData?.discountAmount > 0 ? (
                <>
                  <span className="text-lg line-through text-gray-400">₹{orderData.originalAmount}</span>
                  <span className="text-3xl font-bold text-purple-600 ml-2">₹{orderData.finalAmount}</span>
                  <div className="text-xs text-green-600 mt-1">Saved ₹{orderData.discountAmount}</div>
                </>
              ) : (
                <span className="text-3xl font-bold text-purple-600">{course.isFree ? 'FREE' : `₹${course.price}`}</span>
              )}
            </div>
          </div>
          {orderData?.couponCode && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Coupon Applied:</span> {orderData.couponCode}
              </p>
            </div>
          )}
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

// Beautiful Curriculum Renderer Component
const BeautifulCurriculumRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const modules: any[] = [];
  let learningPath: string[] = [];
  let currentModule: any = null;
  let currentSection: string | null = null;
  let currentList: string[] = [];
  let inLearningPath = false;

  const flushList = () => {
    if (currentList.length > 0 && currentSection && currentModule) {
      if (!currentModule.sections) currentModule.sections = {};
      if (!currentModule.sections[currentSection]) {
        currentModule.sections[currentSection] = { content: '', items: [], paragraphs: [] };
      }
      currentModule.sections[currentSection].items = [...currentList];
      currentList = [];
    }
  };

  const flushParagraph = (para: string) => {
    if (para && currentSection && currentModule) {
      if (!currentModule.sections) currentModule.sections = {};
      if (!currentModule.sections[currentSection]) {
        currentModule.sections[currentSection] = { content: '', items: [], paragraphs: [] };
      }
      if (!currentModule.sections[currentSection].paragraphs) {
        currentModule.sections[currentSection].paragraphs = [];
      }
      currentModule.sections[currentSection].paragraphs.push(para);
    } else if (para && currentModule && !currentSection) {
      // Paragraph outside any section
      if (!currentModule.paragraphs) currentModule.paragraphs = [];
      currentModule.paragraphs.push(para);
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Learning Path
    if (trimmed.includes('🧭') && trimmed.toLowerCase().includes('learning path')) {
      inLearningPath = true;
      return;
    }

    if (inLearningPath && !trimmed.match(/^[🪐🎨🧠🧩✨🌍🎓]/)) {
      if (trimmed && !trimmed.includes('Module')) {
        learningPath.push(trimmed);
      }
      if (trimmed.match(/^[🪐🎨🧠🧩✨🌍🎓]/)) {
        inLearningPath = false;
      }
    }

    // Module detection - always use icon map based on module number for consistency
    const moduleMatch = trimmed.match(/([🪐🎨🧠🧩✨🌍🎓]?)\s*Module\s*(\d+|Ongoing|—)\s*[—–-]\s*(.+?)(?:\s*\(Week\s*(\d+)\))?/i);
    if (moduleMatch && moduleMatch[2]) {
      flushList(); // Flush any pending list items
      if (currentModule) modules.push(currentModule);
      
      // Always use icon map based on module number for consistency
      const iconMap: { [key: string]: string } = {
        '1': '🪐',
        '2': '🎨',
        '3': '🧠',
        '4': '🧩',
        '5': '✨',
        '6': '🌍',
        'Ongoing': '🎓',
        '—': '🎓' // For "Ongoing Module —"
      };
      
      const moduleNum = moduleMatch[2].trim();
      // Always use the icon from the map based on module number
      const icon = iconMap[moduleNum] || iconMap[moduleNum.replace(/[—–-]/g, '').trim()] || '📚';
      
      currentModule = {
        icon: icon,
        number: moduleNum,
        title: moduleMatch[3],
        week: moduleMatch[4] || null,
        sections: {},
        paragraphs: []
      };
      currentSection = null;
      return;
    }

    // Section headers - must check this before other content
    const sectionMatch = trimmed.match(/^(Goal|What You'll Learn|Hands-On Projects|Deliverable|Why It Matters|Project Options|What You'll Deliver|Evaluation|Outcome|Includes):\s*(.*)/i);
    if (sectionMatch && currentModule) {
      flushList(); // Flush any pending list items from previous section
      currentSection = sectionMatch[1];
      const sectionContent = sectionMatch[2].trim();
      
      if (!currentModule.sections) currentModule.sections = {};
      currentModule.sections[currentSection] = {
        content: sectionContent,
        items: [],
        paragraphs: []
      };
      return;
    }

    // Empty lines - flush list but don't reset section
    if (!trimmed) {
      flushList();
      return;
    }

    // List items - only if we're in a section
    if (trimmed.match(/^[-•*]\s+/) && currentSection && currentModule) {
      const item = trimmed.replace(/^[-•*]\s+/, '').trim();
      if (item) currentList.push(item);
      return;
    }

    // Regular paragraphs - check if we're in a section or not
    if (trimmed && !trimmed.startsWith('#') && !trimmed.match(/^(Goal|What You'll Learn|Hands-On Projects|Deliverable|Why It Matters|Project Options|What You'll Deliver|Evaluation|Outcome|Includes):/i)) {
      // If we have a current section, add to that section's paragraphs
      if (currentSection && currentModule) {
        flushParagraph(trimmed);
      } else if (currentModule) {
        // No current section, add to module's general paragraphs
        if (!currentModule.paragraphs) currentModule.paragraphs = [];
        currentModule.paragraphs.push(trimmed);
      }
    }
  });

  flushList();
  if (currentModule) modules.push(currentModule);

  const getSectionIcon = (section: string) => {
    const lower = section.toLowerCase();
    if (lower.includes('goal')) return <Target className="w-5 h-5" />;
    if (lower.includes('learn')) return <BookOpen className="w-5 h-5" />;
    if (lower.includes('project') || lower.includes('hands-on')) return <Wrench className="w-5 h-5" />;
    if (lower.includes('deliverable')) return <Package className="w-5 h-5" />;
    if (lower.includes('matters') || lower.includes('why')) return <Lightbulb className="w-5 h-5" />;
    if (lower.includes('evaluation') || lower.includes('outcome')) return <Trophy className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getSectionColor = (section: string) => {
    const lower = section.toLowerCase();
    if (lower.includes('goal')) return 'from-blue-500 to-cyan-500';
    if (lower.includes('learn')) return 'from-green-500 to-emerald-500';
    if (lower.includes('project') || lower.includes('hands-on')) return 'from-orange-500 to-red-500';
    if (lower.includes('deliverable')) return 'from-purple-500 to-indigo-500';
    if (lower.includes('matters') || lower.includes('why')) return 'from-yellow-500 to-orange-500';
    if (lower.includes('evaluation') || lower.includes('outcome')) return 'from-yellow-400 to-amber-500';
    return 'from-purple-500 to-pink-500';
  };

  const moduleGradients = [
    'from-purple-600/20 via-pink-600/20 to-blue-600/20',
    'from-pink-600/20 via-rose-600/20 to-orange-600/20',
    'from-blue-600/20 via-cyan-600/20 to-teal-600/20',
    'from-indigo-600/20 via-purple-600/20 to-pink-600/20',
    'from-yellow-600/20 via-orange-600/20 to-red-600/20',
    'from-green-600/20 via-emerald-600/20 to-teal-600/20',
  ];

  return (
    <div className="space-y-12">
      {/* Modules */}
      <div className="space-y-8">
        {modules.map((module, idx) => (
          <Card 
            key={idx}
            className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/5 border-white/20 hover:border-white/30 transition-all duration-300 group"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${moduleGradients[idx % moduleGradients.length]} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`} />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-start gap-4">
                <div className="text-6xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3 flex-wrap">
                    Module {module.number} — {module.title}
                    {module.week && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                        Week {module.week}
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Sections */}
              {Object.entries(module.sections || {}).map(([sectionName, sectionData]: [string, any]) => (
                <div key={sectionName} className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getSectionColor(sectionName)} flex items-center justify-center shadow-lg`}>
                      {getSectionIcon(sectionName)}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{sectionName}</h4>
                  </div>
                  
                  {sectionData.content && (
                    <p className="text-white/80 leading-relaxed ml-14 mb-3">{sectionData.content}</p>
                  )}
                  
                  {sectionData.paragraphs && sectionData.paragraphs.length > 0 && (
                    <div className="space-y-2 ml-14 mb-3">
                      {sectionData.paragraphs.map((para: string, paraIdx: number) => (
                        <p key={paraIdx} className="text-white/80 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  )}
                  
                  {sectionData.items && sectionData.items.length > 0 && (
                    <ul className="space-y-2 ml-14">
                      {sectionData.items.map((item: string, itemIdx: number) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-white/90">
                          <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Paragraphs outside sections */}
              {module.paragraphs && module.paragraphs.length > 0 && (
                <div className="space-y-3">
                  {module.paragraphs.map((para: string, paraIdx: number) => (
                    <p key={paraIdx} className="text-white/80 leading-relaxed">{para}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Registration form schema
  const registrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    institution: z.string().optional(),
    additionalInfo: z.string().optional(),
  });

  type RegistrationFormData = z.infer<typeof registrationSchema>;

  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      institution: '',
      additionalInfo: ''
    },
  });

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

  // Validate coupon code
  const validateCoupon = async (code: string) => {
    if (!code.trim() || !user?.id) return;
    
    setIsValidatingCoupon(true);
    try {
      const response = await apiRequest("POST", "/api/coupon-codes/validate", {
        code: code.toUpperCase(),
        itemType: 'course',
        itemId: course.id,
        amount: parseFloat(course.price || "0"),
      });
      const result = await response.json();
      
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setDiscountAmount(result.discountAmount || 0);
        setOriginalAmount(parseFloat(course.price || "0"));
        toast({
          title: "🎉 Coupon Applied!",
          description: `You saved ₹${result.discountAmount.toFixed(2)}!`,
        });
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setOriginalAmount(null);
        toast({
          title: "Invalid Coupon Code",
          description: result.error || "This coupon code cannot be used.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Coupon Validation Failed",
        description: "Unable to validate coupon code. Please try again.",
        variant: "destructive",
      });
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setOriginalAmount(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Create payment order mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (data: { courseId: number, paymentAmount: number, couponCode?: string }) => {
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
      const enrollmentData = {
        ...paymentData,
        originalAmount: originalAmount || parseFloat(course.price || "0"),
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.code || null,
      };
      const response = await apiRequest('POST', '/api/courses/enroll', enrollmentData);
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "🎉 Enrollment Successful!",
        description: "Welcome to the course! Loading your learning interface...",
      });
      setShowPayment(false);
      setOrderData(null);
      // Reset coupon state
      setCouponCode("");
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setOriginalAmount(null);
      
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
    
    // For free courses or accepting_registrations status, show registration form
    if (course.isFree || course.status === 'accepting_registrations') {
      setShowRegistrationForm(true);
      return;
    }
    
    // For paid courses, proceed with payment
    const finalAmount = appliedCoupon && discountAmount > 0 
      ? (originalAmount || parseFloat(course.price || "0")) - discountAmount
      : parseFloat(course.price || "0");
    
    createPaymentMutation.mutate({
      courseId: course.id,
      paymentAmount: finalAmount,
      couponCode: appliedCoupon?.code || undefined,
    });
  };

  // Registration form submission
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // Make request directly to handle HTML error responses
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add Firebase ID token
      try {
        const { auth } = await import('@/lib/firebase');
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          headers["Authorization"] = `Bearer ${idToken}`;
        }
      } catch (error) {
        console.error('Failed to get Firebase ID token:', error);
      }

      const response = await fetch("/api/courses/register", {
        method: "POST",
        headers,
        body: JSON.stringify({
          courseId: course?.id,
          ...data,
          userId: user?.id
        }),
        credentials: "include",
      });
      
      // Check content type first
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error("Server error occurred. Please try again later.");
        }
        throw new Error("Invalid response format from server.");
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error("Registration failed. Please check your connection and try again.");
        }
        throw new Error(errorData.message || "Registration failed");
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the course. We'll contact you soon!",
      });
      registrationForm.reset();
      setShowRegistrationForm(false);
      refetchEnrollment();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleRegistrationSubmit = (data: RegistrationFormData) => {
    registrationMutation.mutate(data);
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

  // Extract sections from markdown content
  const extractSections = (content: string) => {
    if (!content) return { 
      overview: '', 
      whatMakesSpecial: '', 
      whatYoullMaster: '', 
      courseStructure: '', 
      certification: '', 
      careerOpportunities: '',
      filteredContent: '' 
    };
    
    const lines = content.split('\n');
    let whatYoullMaster: string[] = [];
    let courseStructure: string[] = [];
    let certification: string[] = [];
    let whatMakesSpecial: string[] = [];
    let careerOpportunities: string[] = [];
    let overviewLines: string[] = [];
    let filteredLines: string[] = [];
    let currentSection: string | null = null;
    let inSection = false;
    let foundFirstSection = false;
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Detect section headers
      if (trimmed.includes('🎯') && trimmed.toLowerCase().includes('what you\'ll master')) {
        currentSection = 'master';
        inSection = true;
        foundFirstSection = true;
        return;
      }
      if (trimmed.includes('📋') && trimmed.toLowerCase().includes('course structure')) {
        currentSection = 'structure';
        inSection = true;
        foundFirstSection = true;
        return;
      }
      if (trimmed.includes('🏆') && trimmed.toLowerCase().includes('certification')) {
        currentSection = 'certification';
        inSection = true;
        foundFirstSection = true;
        return;
      }
      if ((trimmed.includes('✨') || trimmed.includes('🎁')) && trimmed.toLowerCase().includes('what makes this course special')) {
        currentSection = 'special';
        inSection = true;
        foundFirstSection = true;
        return;
      }
      if (trimmed.includes('💼') && trimmed.toLowerCase().includes('career opportunities')) {
        currentSection = 'career';
        inSection = true;
        foundFirstSection = true;
        return;
      }
      
      // Stop section if we hit another major header
      if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        if (inSection && !trimmed.includes('🎯') && !trimmed.includes('📋') && !trimmed.includes('🏆') && 
            !trimmed.includes('✨') && !trimmed.includes('🎁') && !trimmed.includes('💼')) {
          inSection = false;
          currentSection = null;
        }
      }
      
      // Collect section content
      if (inSection && currentSection === 'master') {
        if (trimmed && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
          whatYoullMaster.push(line);
        }
      } else if (inSection && currentSection === 'structure') {
        if (trimmed && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
          courseStructure.push(line);
        }
      } else if (inSection && currentSection === 'certification') {
        if (trimmed && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
          certification.push(line);
        }
      } else if (inSection && currentSection === 'special') {
        if (trimmed && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
          whatMakesSpecial.push(line);
        }
      } else if (inSection && currentSection === 'career') {
        if (trimmed && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
          careerOpportunities.push(line);
        }
      } else {
        // Overview is everything before the first special section
        // Filter out "No prior experience needed" section, requirements, and markdown artifacts
        const lowerTrimmed = trimmed.toLowerCase();
        
        // Skip markdown artifacts and "Requirements:" lines
        const isRequirementsLine = lowerTrimmed === 'requirements:' || 
          lowerTrimmed.trim() === 'requirements' ||
          lowerTrimmed.startsWith('requirements:') ||
          (trimmed.match(/^requirements:?\s*$/i)); // Match "Requirements:" or "Requirements" at start of line
        
        if (trimmed === '---' || trimmed.match(/^---+$/) || isRequirementsLine) {
          return; // Skip horizontal rules and standalone "Requirements:" headers
        }
        
        const isNoPriorExperienceSection = lowerTrimmed.includes('no prior experience needed') ||
          lowerTrimmed.includes('this course is designed for') ||
          lowerTrimmed.includes('complete beginners') ||
          lowerTrimmed.includes('career switchers') ||
          lowerTrimmed.includes('developers wanting') ||
          lowerTrimmed.includes('marketers wanting') ||
          lowerTrimmed.includes('anyone passionate') ||
          isRequirementsLine ||
          lowerTrimmed.includes('tablet or laptop') ||
          lowerTrimmed.includes('internet connection') ||
          lowerTrimmed.includes('figma account') ||
          lowerTrimmed.includes('enthusiasm to learn') ||
          (lowerTrimmed.startsWith('- ') && (lowerTrimmed.includes('complete beginners') || lowerTrimmed.includes('career switchers') || lowerTrimmed.includes('developers') || lowerTrimmed.includes('marketers') || lowerTrimmed.includes('anyone passionate'))) ||
          (lowerTrimmed.startsWith('* ') && (lowerTrimmed.includes('complete beginners') || lowerTrimmed.includes('career switchers') || lowerTrimmed.includes('developers') || lowerTrimmed.includes('marketers') || lowerTrimmed.includes('anyone passionate')));
        
        if (!foundFirstSection && !isNoPriorExperienceSection) {
          if (!lowerTrimmed.includes('what you\'ll learn') && 
              !lowerTrimmed.includes('prerequisites') &&
              !trimmed.includes('### Module') && // Keep module headers
              !(trimmed.startsWith('- ') && lowerTrimmed.includes('master figma')) &&
              !(trimmed.startsWith('- ') && lowerTrimmed.includes('understand ui/ux'))) {
            overviewLines.push(line);
            filteredLines.push(line);
          }
        } else if (foundFirstSection && !isNoPriorExperienceSection) {
          if (!lowerTrimmed.includes('what you\'ll learn') && 
              !lowerTrimmed.includes('prerequisites') &&
              !trimmed.includes('### Module')) {
            overviewLines.push(line);
            filteredLines.push(line);
          }
        }
      }
    });
    
    // Clean up the overview by removing "Requirements:" lines and extra spaces
    const cleanOverview = overviewLines
      .filter(line => {
        const trimmed = line.trim().toLowerCase();
        return !(trimmed === 'requirements:' || trimmed === 'requirements' || trimmed.match(/^requirements:?\s*$/));
      })
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    const cleanFilteredContent = filteredLines
      .filter(line => {
        const trimmed = line.trim().toLowerCase();
        return !(trimmed === 'requirements:' || trimmed === 'requirements' || trimmed.match(/^requirements:?\s*$/));
      })
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    return {
      overview: cleanOverview,
      whatMakesSpecial: whatMakesSpecial.join('\n'),
      whatYoullMaster: whatYoullMaster.join('\n'),
      courseStructure: courseStructure.join('\n'),
      certification: certification.join('\n'),
      careerOpportunities: careerOpportunities.join('\n'),
      filteredContent: cleanFilteredContent
    };
  };

  // Markdown renderer for about section (cleaned version)
  const renderMarkdown = (content: string, removeSections: string[] = []) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let key = 0;
    let skipSection = false;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType === 'ul' ? 'ul' : 'ol';
        elements.push(
          <ListTag key={key++} className={`${listType === 'ul' ? 'list-disc' : 'list-decimal'} ml-6 mb-4 space-y-2`}>
            {currentList.map((item, idx) => (
              <li key={idx} className="text-white/90 leading-relaxed">{item}</li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip markdown artifacts and horizontal rules
      const isRequirementsLine = trimmed.toLowerCase() === 'requirements:' || 
        trimmed.toLowerCase().trim() === 'requirements' ||
        trimmed.toLowerCase().startsWith('requirements:') ||
        trimmed.match(/^requirements:?\s*$/i); // Match "Requirements:" or "Requirements" at start of line
      
      if (trimmed === '---' || trimmed.startsWith('---') || 
          isRequirementsLine ||
          trimmed.match(/^---+$/)) {
        return; // Skip horizontal rules and standalone "Requirements:" headers
      }
      
      // Skip removed sections
      if (removeSections.some(section => trimmed.toLowerCase().includes(section.toLowerCase()))) {
        skipSection = true;
        return;
      }
      
      if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        skipSection = false;
      }
      
      if (skipSection && !trimmed.startsWith('##') && !trimmed.startsWith('#')) {
        return;
      }
      
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={key++} className="text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {trimmed.substring(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={key++} className="text-3xl font-semibold mb-4 mt-8 text-white border-b border-white/20 pb-2">
            {trimmed.substring(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        const heading = trimmed.substring(4);
        // Style special headings with colored badges
        if (heading.includes('Hands-On Learning') || heading.includes('Real-World Projects') || 
            heading.includes('Portfolio Building') || heading.includes('Industry Tools')) {
          elements.push(
            <h3 key={key++} className="text-xl font-semibold mb-3 mt-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300">
                {heading.replace(/^\*\*|\*\*$/g, '')}
              </span>
            </h3>
          );
        } else {
          elements.push(
            <h3 key={key++} className="text-2xl font-semibold mb-3 mt-6 text-purple-300">
              {heading.replace(/^\*\*|\*\*$/g, '')}
            </h3>
          );
        }
      } else if (trimmed.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={key++} className="text-xl font-semibold mb-2 mt-4 text-purple-200">
            {trimmed.substring(5).replace(/^\*\*|\*\*$/g, '')}
          </h4>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        const item = trimmed.substring(2).replace(/^\*\*|\*\*$/g, '').replace(/\*\*/g, '');
        currentList.push(item);
      } else if (trimmed.match(/^\d+\. /)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        const item = trimmed.replace(/^\d+\. /, '').replace(/^\*\*|\*\*$/g, '').replace(/\*\*/g, '');
        currentList.push(item);
      } else if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={key++} className="border-l-4 border-purple-400 pl-4 my-4 italic text-white/80 bg-purple-500/10 p-4 rounded-r-lg">
            {trimmed.substring(2).replace(/^\*\*|\*\*$/g, '')}
          </blockquote>
        );
      } else if (trimmed === '') {
        flushList();
        elements.push(<br key={key++} />);
      } else {
        flushList();
        // Skip if it's just "Requirements:" or "Requirements"
        const lowerTrimmed = trimmed.toLowerCase();
        if (lowerTrimmed === 'requirements:' || lowerTrimmed.trim() === 'requirements' || 
            lowerTrimmed.match(/^requirements:?\s*$/)) {
          return; // Skip this line completely
        }
        
        // Remove all asterisks and format properly, also clean up extra spaces
        const processed = trimmed
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers but keep text
          .replace(/\*(.*?)\*/g, '$1') // Remove italic markers but keep text
          .replace(/`(.*?)`/g, '<code class="bg-purple-900/50 px-2 py-1 rounded text-purple-200 font-mono text-sm">$1</code>')
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim(); // Remove leading/trailing spaces
        
        // Also filter out any remaining "Requirements:" in the processed text
        if (processed.toLowerCase().includes('requirements:') && processed.trim().toLowerCase().match(/^requirements:?\s*$/)) {
          return; // Skip if processed text is just "Requirements:"
        }
        
        if (processed) {
          elements.push(
            <p key={key++} className="mb-4 text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />
          );
        }
      }
    });
    
    flushList();
    return elements;
  };

  // Extract sections from course.about
  const sections = course?.about ? extractSections(course.about) : { 
    overview: '', 
    whatMakesSpecial: '', 
    whatYoullMaster: '', 
    courseStructure: '', 
    certification: '', 
    careerOpportunities: '',
    filteredContent: '' 
  };

  // Show Course Preview for non-enrolled students
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-purple-900 to-indigo-900">
      {/* Hero Section with Enhanced Visuals */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => navigate('/courses')} 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Courses
            </Button>
            
            <div className="flex items-center gap-3">
              {hasCertificate && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg">
                  <Award className="w-4 h-4 mr-1" />
                  Certified
                </Badge>
              )}
              {course.isFree && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  FREE
                </Badge>
              )}
              {course.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </Badge>
              )}
              <SocialShare 
                url={`/courses/${id}`}
                title={course.title}
                description={course.description}
                hashtags={['Zoonigia', 'SpaceEducation', course.field]}
              />
            </div>
          </div>

          {/* Enhanced Hero Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Course Info - Enhanced */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                      <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CardTitle className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                            {course.title}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-4">
                          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <User className="w-4 h-4" />
                            {course.instructorName || 'ZOONIGIA Team'}
                          </span>
                          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <BookOpen className="w-4 h-4" />
                            {course.field}
                          </span>
                          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Target className="w-4 h-4" />
                            {course.level}
                          </span>
                        </div>
                        <CardDescription className="text-white/90 text-lg leading-relaxed">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
              </Card>
            </div>

            {/* Enhanced Enrollment Panel */}
            <div>
              <Card className="bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-xl border-purple-400/30 shadow-2xl text-white sticky top-24">
                <CardHeader className="border-b border-white/20 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Get Started</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    {course.status !== 'upcoming' && (
                      <>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/70">Price</span>
                            {course.isFree && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                FREE
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            {appliedCoupon && discountAmount > 0 && originalAmount ? (
                              <div className="space-y-1">
                                <div className="text-lg line-through text-white/40">₹{originalAmount}</div>
                                <div className="text-3xl font-bold text-green-400">₹{(originalAmount - discountAmount).toFixed(2)}</div>
                                <div className="text-xs text-green-300">You saved ₹{discountAmount.toFixed(2)}!</div>
                              </div>
                            ) : course.isFree ? (
                              <div className="text-3xl font-bold text-green-400">FREE</div>
                            ) : (
                              <div className="text-3xl font-bold text-white">₹{course.price}</div>
                            )}
                          </div>
                        </div>
                        {appliedCoupon && discountAmount > 0 && (
                          <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-green-300 font-semibold">🎉 Discount Applied!</span>
                              <span className="font-bold text-green-300 text-lg">-₹{discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-green-200">Coupon:</span>
                              <Badge className="bg-green-500/50 text-white font-mono">{appliedCoupon.code}</Badge>
                            </div>
                          </div>
                        )}
                        {!course.isFree && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Have a coupon code?</label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="Enter code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    validateCoupon(couponCode);
                                  }
                                }}
                                className="flex-1 bg-white/15 border-white/30 text-white placeholder:text-white/40 font-mono text-sm"
                                disabled={isValidatingCoupon || !!appliedCoupon}
                              />
                              <Button
                                onClick={() => validateCoupon(couponCode)}
                                disabled={!couponCode.trim() || isValidatingCoupon || !!appliedCoupon}
                                variant="outline"
                                size="icon"
                                className="border-white/30 text-white hover:bg-white/20"
                              >
                                {isValidatingCoupon ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : appliedCoupon ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Zap className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            {appliedCoupon && (
                              <Button
                                onClick={() => {
                                  setCouponCode("");
                                  setAppliedCoupon(null);
                                  setDiscountAmount(0);
                                  setOriginalAmount(null);
                                }}
                                variant="ghost"
                                size="sm"
                                className="w-full text-red-300 hover:text-red-200 hover:bg-red-500/10 text-xs"
                              >
                                Remove Coupon
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">Level</div>
                        <Badge className="bg-purple-500/50 text-white capitalize">{course.level}</Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">Status</div>
                        <Badge className={
                          course.status === 'live' ? 'bg-green-500/50 text-white' :
                          course.status === 'accepting_registrations' ? 'bg-blue-500/50 text-white' :
                          'bg-gray-500/50 text-white'
                        }>
                          {course.status === 'upcoming' ? 'Coming Soon' : 
                           course.status === 'accepting_registrations' ? 'Open' : 
                           'Live'}
                        </Badge>
                      </div>
                    </div>

                    {/* Enrollment Button */}
                    {course.status === 'upcoming' ? (
                      <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-blue-300 font-semibold text-lg mb-2">Coming Soon</p>
                        <p className="text-sm text-white/70">
                          This course is not yet available for enrollment.
                        </p>
                      </div>
                    ) : course.status === 'accepting_registrations' ? (
                      isAuthenticated ? (
                        isEnrolled ? (
                          <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                              </div>
                              <p className="text-green-300 font-semibold text-lg mb-2">Registered!</p>
                              <p className="text-sm text-white/80">
                                You'll receive access to full course content once it goes live.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleEnrollment} 
                            disabled={createPaymentMutation.isPending}
                            className="w-full h-14 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                          >
                            {createPaymentMutation.isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-5 h-5 mr-2" />
                                Register Now - FREE
                              </>
                            )}
                          </Button>
                        )
                      ) : (
                        <Button 
                          onClick={() => navigate('/api/login')}
                          className="w-full h-14 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-xl"
                        >
                          <User className="w-5 h-5 mr-2" />
                          Login to Register
                        </Button>
                      )
                    ) : (
                      isAuthenticated ? (
                        isEnrolled ? (
                          <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30">
                            <div className="text-center mb-4">
                              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                              </div>
                              <p className="text-green-300 font-semibold text-lg mb-2">Enrolled!</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-white/80">Progress</span>
                                <span className="font-bold text-white">{Math.round(progressPercentage)}%</span>
                              </div>
                              <Progress value={progressPercentage} className="h-3 bg-white/10" />
                              <p className="text-xs text-white/70 text-center mt-2">
                                {completedLessons} of {totalLessons} lessons completed
                              </p>
                            </div>
                            <Button 
                              onClick={() => window.location.reload()}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
                            >
                              <PlayCircle className="w-5 h-5 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleEnrollment} 
                            disabled={createPaymentMutation.isPending}
                            className="w-full h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                          >
                            {createPaymentMutation.isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-5 h-5 mr-2" />
                                {course.isFree ? 'Enroll Now - FREE' : `Enroll Now - ₹${course.price}`}
                              </>
                            )}
                          </Button>
                        )
                      ) : (
                        <Button 
                          onClick={() => navigate('/api/login')}
                          className="w-full h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold text-lg shadow-xl"
                        >
                          <User className="w-5 h-5 mr-2" />
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

        {/* Enhanced Course Content Tabs */}
        <Card className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl mt-8">
          <Tabs defaultValue="about" className="p-6 md:p-8">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              <TabsTrigger value="about" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                About
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <GraduationCap className="w-4 h-4 mr-2" />
                Curriculum
              </TabsTrigger>
              <TabsTrigger value="certification" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Award className="w-4 h-4 mr-2" />
                Certification
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-8 space-y-8">
              {/* Course Overview - Moved to Top */}
              {course.about && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-white">Course Overview</h3>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 prose prose-invert max-w-none">
                    <div className="text-white/90 leading-relaxed">
                      {renderMarkdown(sections.overview, ['what you\'ll learn', 'prerequisites', 'what makes this course special', 'career opportunities'])}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* What Makes This Course Special */}
              {sections.whatMakesSpecial && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-white">✨ What Makes This Course Special</h3>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-white/90 leading-relaxed">
                      {renderMarkdown(sections.whatMakesSpecial)}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* What You'll Learn */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-white">What You'll Learn</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learningObjectives.map((objective: string, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/90 leading-relaxed">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-white">Prerequisites</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.prerequisites.map((prerequisite: string, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/90 leading-relaxed">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Summary sections - Most tempting first */}
              <div className="space-y-4">
                {sections.certification && (
                  <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-400/20">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">🏆 Certification</h4>
                    <p className="text-white/80 text-sm">Earn an official certificate upon completion. See Certification tab for details.</p>
                  </div>
                )}
                
                {sections.whatYoullMaster && (
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">🎯 What You'll Master</h4>
                    <p className="text-white/80 text-sm">Comprehensive coverage of design fundamentals, prototyping, collaboration, and advanced techniques. See Curriculum tab for details.</p>
                  </div>
                )}
                
                {sections.courseStructure && (
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">📋 Course Structure</h4>
                    <p className="text-white/80 text-sm">8-10 weeks of structured learning with hands-on projects. See Curriculum tab for detailed breakdown.</p>
                  </div>
                )}
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Career Opportunities */}
              {sections.careerOpportunities && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-red-400 rounded-full" />
                    <h3 className="text-2xl font-bold text-white">💼 Career Opportunities</h3>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-white/90 leading-relaxed">
                      {renderMarkdown(sections.careerOpportunities)}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Enhanced Course Statistics */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                  <h3 className="text-2xl font-bold text-white">Course Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 hover:scale-105 transition-transform">
                    <Clock className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{course.totalDuration || 0}</div>
                    <div className="text-sm text-white/70">Minutes</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 hover:scale-105 transition-transform">
                    <FileText className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{course.totalLessons || 0}</div>
                    <div className="text-sm text-white/70">Lessons</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-8 space-y-8">
              {/* Course Structure Section - Enhanced - Moved to Top */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-10 bg-gradient-to-b from-blue-400 via-cyan-400 to-teal-400 rounded-full" />
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    📋 Course Structure
                  </h3>
                </div>
                <Card className="bg-gradient-to-br from-white/10 via-white/5 to-white/5 border-white/20 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                  </div>
                          <div>
                            <p className="text-white/60 text-sm">Duration</p>
                            <p className="text-white font-semibold text-lg">6 Weeks</p>
                    </div>
                  </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                </div>
                          <div>
                            <p className="text-white/60 text-sm">Format</p>
                            <p className="text-white font-semibold text-lg">Hands-on Projects + Live Sessions</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Projects</p>
                            <p className="text-white font-semibold text-lg">Portfolio-Ready Capstone</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Support</p>
                            <p className="text-white font-semibold text-lg">Mentors + Peer Community</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                      <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-cyan-400" />
                        Weekly Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🪐</span>
                            <span className="text-white font-semibold">Week 1</span>
                          </div>
                          <p className="text-white/80 text-sm">Design Foundations & Figma Fundamentals</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🎨</span>
                            <span className="text-white font-semibold">Week 2</span>
                          </div>
                          <p className="text-white/80 text-sm">UI Design: Visual Systems & Layout Mastery</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🧠</span>
                            <span className="text-white font-semibold">Week 3</span>
                          </div>
                          <p className="text-white/80 text-sm">UX Design: Research, Flows & Prototyping</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🧩</span>
                            <span className="text-white font-semibold">Week 4</span>
                          </div>
                          <p className="text-white/80 text-sm">Design Systems & Professional Collaboration</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">✨</span>
                            <span className="text-white font-semibold">Week 5</span>
                          </div>
                          <p className="text-white/80 text-sm">Motion, Handoff & Production (Pro Track)</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🌍</span>
                            <span className="text-white font-semibold">Week 6</span>
                          </div>
                          <p className="text-white/80 text-sm">Capstone Project: Build, Polish & Present</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 mt-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                        <Trophy className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="text-white font-semibold mb-2">What You'll Get</h5>
                          <ul className="space-y-2 text-white/80 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Zoonigia Certificate of Mastery
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Portfolio-Ready Capstone Project
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Internship Eligibility & Career Support
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Lifetime Access to Designverse Community
                            </li>
                          </ul>
                  </div>
                    </div>
                  </div>
                  </CardContent>
                </Card>
                </div>

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Beautiful Curriculum UI */}
              {sections.whatYoullMaster && (
                <BeautifulCurriculumRenderer content={sections.whatYoullMaster} />
              )}

              <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Lessons List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
                  <h3 className="text-2xl font-bold text-white">Lessons</h3>
                </div>
                {lessons.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No lessons available yet</p>
                    <p className="text-white/40 text-sm mt-2">Check back soon for course content!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons
                      .filter((lesson: any) => {
                        if (course.status === 'live') return true;
                        if (course.status === 'accepting_registrations') return lesson.isPreview;
                        return false;
                      })
                      .map((lesson: any, index: number) => {
                      const isLocked = !isEnrolled && !lesson.isPreview;
                      const isCompleted = progress.some((p: any) => p.lessonId === lesson.id && p.completed);
                      
                      return (
                        <div 
                          key={lesson.id} 
                          className={`flex items-center gap-4 p-5 rounded-xl border transition-all ${
                            isLocked 
                              ? 'bg-white/5 border-white/10 opacity-60' 
                              : isCompleted
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 hover:border-green-400/50'
                              : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-lg'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isLocked ? (
                              <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white/40" />
                              </div>
                            ) : isCompleted ? (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-2">
                              <h4 className={`font-semibold ${isLocked ? 'text-white/60' : 'text-white'}`}>
                                {lesson.title}
                              </h4>
                              {isCompleted && (
                                <Badge className="bg-green-500/50 text-white text-xs">
                                  Completed
                                </Badge>
                              )}
                              {lesson.isPreview && !isLocked && (
                                <Badge className="bg-blue-500/50 text-white text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Badge>
                              )}
                            </div>
                            {lesson.description && (
                              <p className="text-white/70 text-sm mb-3">{lesson.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-white/60">
                              <span className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                                <Clock className="w-3.5 h-3.5" />
                                {lesson.duration || 0} min
                              </span>
                              <span className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                                {lesson.type === 'video' && <PlayCircle className="w-3.5 h-3.5" />}
                                {lesson.type === 'text' && <FileText className="w-3.5 h-3.5" />}
                                {lesson.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5" />}
                                {lesson.type}
                              </span>
                            </div>
                          </div>

                          {isLocked && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-white/40 border-white/20 cursor-not-allowed"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Locked
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Certification Tab */}
            <TabsContent value="certification" className="mt-8 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-10 bg-gradient-to-b from-yellow-400 via-orange-400 to-amber-400 rounded-full" />
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    🏆 Certification
                  </h3>
                  </div>
                <Card className="bg-gradient-to-br from-white/10 via-white/5 to-white/5 border-white/20 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                      <Trophy className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-4 text-xl">What You'll Get</h5>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="leading-relaxed">Zoonigia Certificate of Mastery</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="leading-relaxed">Portfolio-Ready Capstone Project</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="leading-relaxed">Internship Eligibility & Career Support</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="leading-relaxed">Lifetime Access to Designverse Community</span>
                          </li>
                        </ul>
                    </div>
                  </div>
                  </CardContent>
                </Card>
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

      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="bg-space-800 border-space-700 text-space-50 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-space">Register for {course?.title}</DialogTitle>
          </DialogHeader>
          
          <Form {...registrationForm}>
            <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
              <FormField
                control={registrationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution/School (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your school/institution" {...field} className="bg-space-700 border-space-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information you'd like to share"
                        {...field} 
                        className="bg-space-700 border-space-600 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-space-700/50 p-4 rounded-lg border border-space-600">
                <h4 className="font-semibold text-space-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cosmic-blue" />
                  Next Steps
                </h4>
                <p className="text-xs text-space-300">After registration, our team will contact you within 48 hours to discuss course details and any specific requirements you may have.</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                disabled={registrationMutation.isPending}
              >
                {registrationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
