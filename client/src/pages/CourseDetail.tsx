import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Star, 
  CheckCircle, 
  Download,
  User,
  Calendar,
  Award,
  Users,
  Eye,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Course, CourseLesson, CourseModule, StudentProgress, CourseReview } from '@shared/schema';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: [`/api/courses/${id}/lessons`],
    enabled: !!id,
  });

  const { data: modules = [] } = useQuery({
    queryKey: [`/api/courses/${id}/modules`],
    enabled: !!id,
  });

  const { data: progress = [] } = useQuery({
    queryKey: [`/api/courses/${id}/progress`],
    enabled: !!id && isAuthenticated,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/courses/${id}/reviews`],
    enabled: !!id,
  });

  const { data: userCertificates = [] } = useQuery({
    queryKey: ['/api/user/certificates'],
    enabled: isAuthenticated,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/courses/enroll', {
        courseId: parseInt(id!),
        userId: user?.id
      });
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful",
        description: "You have successfully enrolled in the course!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/progress`] });
    },
    onError: (error) => {
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in the course. Please try again.",
        variant: "destructive",
      });
    }
  });

  const progressMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      return apiRequest('POST', `/api/lessons/${lessonId}/progress`, {
        courseId: parseInt(id!),
        lessonId,
        completed: true,
        timeSpent: 15 // Mock time spent
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/progress`] });
      toast({
        title: "Progress Updated",
        description: "Lesson marked as completed!",
      });
    }
  });

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

  const isEnrolled = progress.length > 0;
  const completedLessons = progress.filter((p: StudentProgress) => p.completed).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const hasCertificate = userCertificates.some((cert: any) => cert.courseId === parseInt(id!));

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/courses')} variant="outline">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => navigate('/courses')} 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-purple-900"
            >
              ← Back to Courses
            </Button>
            
            {hasCertificate && (
              <Badge variant="secondary" className="bg-yellow-500 text-black">
                <Award className="w-4 h-4 mr-1" />
                Certified
              </Badge>
            )}
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
                            onClick={() => enrollMutation.mutate()} 
                            disabled={enrollMutation.isPending}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                            {enrollMutation.isPending ? 'Registering...' : 'Register Now'}
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
                          </div>
                        ) : (
                          <Button 
                            onClick={() => enrollMutation.mutate()} 
                            disabled={enrollMutation.isPending}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
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

        {/* Course Content */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Course Curriculum</CardTitle>
                <CardDescription className="text-white/70">
                  {course.status === 'upcoming' ? 'Coming Soon' : 
                   course.status === 'accepting_registrations' ? 'Preview Content Only' :
                   `${totalLessons} lessons • ${course.totalDuration || 0} minutes total`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons
                    .filter((lesson: CourseLesson) => {
                      // Show all lessons for live courses
                      if (course.status === 'live') return true;
                      // Show only preview lessons for accepting registrations courses
                      if (course.status === 'accepting_registrations') return lesson.isPreview;
                      // Show no lessons for upcoming courses
                      return false;
                    })
                    .map((lesson: CourseLesson) => {
                    const isCompleted = progress.some((p: StudentProgress) => 
                      p.lessonId === lesson.id && p.completed
                    );
                    
                    return (
                      <div key={lesson.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <PlayCircle className="w-6 h-6 text-white/60" />
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

                        <div className="flex items-center gap-2">
                          {(course.status === 'live' && isEnrolled) || lesson.isPreview ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setShowVideoPlayer(true);
                              }}
                              className="text-white border-white hover:bg-white hover:text-purple-900"
                            >
                              {lesson.type === 'video' ? 'Watch' : 'View'}
                            </Button>
                          ) : course.status === 'accepting_registrations' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-gray-500 border-gray-500 cursor-not-allowed"
                            >
                              {lesson.isPreview ? 'Preview' : 'Locked'}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-gray-500 border-gray-500 cursor-not-allowed"
                            >
                              Coming Soon
                            </Button>
                          )}
                          
                          {course.status === 'live' && isEnrolled && !isCompleted && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => progressMutation.mutate(lesson.id)}
                              disabled={progressMutation.isPending}
                              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {course.status === 'upcoming' && (
                    <div className="text-center py-8">
                      <p className="text-white/70">Course curriculum will be available soon.</p>
                    </div>
                  )}
                  
                  {course.status === 'accepting_registrations' && lessons.filter(l => l.isPreview).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white/70">No preview lessons available yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Course Reviews</CardTitle>
                <CardDescription className="text-white/70">
                  {reviews.length} reviews • {course.rating}/5 average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isEnrolled && course.status === 'live' && (
                    <div className="border-b border-white/20 pb-6">
                      <h4 className="text-white font-medium mb-4">Write a Review</h4>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Rating</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                      <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
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
                                <FormLabel className="text-white">Review</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Share your experience with this course..."
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {reviews.map((review: CourseReview) => (
                      <div key={review.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-white/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/70 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/80">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">About This Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Certificates</CardTitle>
                <CardDescription className="text-white/70">
                  Complete the course to earn your certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasCertificate ? (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Congratulations!</h3>
                    <p className="text-white/70 mb-4">You have successfully completed this course</p>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Certificate Available</h3>
                    <p className="text-white/70 mb-4">
                      Complete all lessons to earn your certificate of completion
                    </p>
                    <div className="max-w-md mx-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">Progress</span>
                        <span className="text-white/70">{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Player Modal */}
      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLesson?.videoUrl ? (
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                  <p>Video Player</p>
                  <p className="text-sm text-white/70">URL: {selectedLesson.videoUrl}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">{selectedLesson?.title}</h3>
                <p className="text-gray-600 mb-4">{selectedLesson?.description}</p>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedLesson?.content || '' }} />
                </div>
              </div>
            )}
            
            {selectedLesson?.resources && selectedLesson.resources.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <div className="space-y-2">
                  {selectedLesson.resources.map((resource: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}