import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizPlayerProps {
  quiz: Quiz;
  onSubmit: (answers: any, score: number, timeSpent: number) => void;
  onCancel?: () => void;
}

export default function QuizPlayer({ quiz, onSubmit, onCancel }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Auto-submit if time limit reached
        if (quiz.timeLimit && newTime >= quiz.timeLimit * 60) {
          handleSubmitQuiz();
          return prev;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, quiz.timeLimit]);

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (!userAnswer) return;

      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      } else if (question.type === 'multiple-select') {
        const correctAnswers = question.correctAnswer as string[];
        const userAnswers = userAnswer as string[];
        
        if (correctAnswers && userAnswers) {
          const isCorrect = correctAnswers.length === userAnswers.length &&
            correctAnswers.every(ans => userAnswers.includes(ans));
          
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      } else if (question.type === 'short-answer') {
        // For short answer, we'll need manual grading or exact match
        if (question.correctAnswer && 
            userAnswer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()) {
          earnedPoints += question.points;
        }
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    setShowResults(true);
    
    onSubmit(answers, finalScore, Math.floor(timeElapsed / 60));

    if (finalScore >= quiz.passingScore) {
      toast({
        title: "Congratulations! 🎉",
        description: `You passed with ${finalScore}%!`,
      });
    } else {
      toast({
        title: "Keep Learning! 📚",
        description: `You scored ${finalScore}%. Passing score is ${quiz.passingScore}%.`,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    if (!quiz.timeLimit) return null;
    const remaining = (quiz.timeLimit * 60) - timeElapsed;
    return Math.max(0, remaining);
  };

  const timeRemaining = getTimeRemaining();

  // Render different question types
  const renderQuestion = () => {
    const userAnswer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <RadioGroup
            value={userAnswer || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            disabled={isSubmitted}
          >
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    isSubmitted
                      ? option === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500/10'
                        : option === userAnswer && option !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-space-700 bg-space-800/30'
                      : 'border-space-700 bg-space-800/30 hover:bg-space-700/50'
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white">
                    {option}
                  </Label>
                  {isSubmitted && option === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {isSubmitted && option === userAnswer && option !== currentQuestion.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'multiple-select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                  isSubmitted
                    ? (currentQuestion.correctAnswer as string[])?.includes(option)
                      ? 'border-green-500 bg-green-500/10'
                      : (userAnswer as string[])?.includes(option)
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-space-700 bg-space-800/30'
                    : 'border-space-700 bg-space-800/30 hover:bg-space-700/50'
                }`}
              >
                <Checkbox
                  id={`option-${index}`}
                  checked={(userAnswer as string[] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = (userAnswer as string[]) || [];
                    const newAnswers = checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswerChange(currentQuestion.id, newAnswers);
                  }}
                  disabled={isSubmitted}
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white">
                  {option}
                </Label>
                {isSubmitted && (currentQuestion.correctAnswer as string[])?.includes(option) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <Input
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Type your answer here..."
            disabled={isSubmitted}
            className="bg-space-800 border-space-700 text-white"
          />
        );

      case 'essay':
        return (
          <Textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Type your detailed answer here..."
            disabled={isSubmitted}
            rows={6}
            className="bg-space-800 border-space-700 text-white"
          />
        );

      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <Card className="bg-space-800/50 border-space-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {score >= quiz.passingScore ? (
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl text-white mb-2">Quiz Completed!</CardTitle>
          <CardDescription className="text-space-300">
            You scored <span className="text-2xl font-bold text-cosmic-blue">{score}%</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-space-700/50 rounded-lg">
              <p className="text-space-400 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold text-cosmic-blue">{score}%</p>
            </div>
            <div className="p-4 bg-space-700/50 rounded-lg">
              <p className="text-space-400 text-sm mb-1">Passing</p>
              <p className="text-2xl font-bold text-cosmic-purple">{quiz.passingScore}%</p>
            </div>
            <div className="p-4 bg-space-700/50 rounded-lg">
              <p className="text-space-400 text-sm mb-1">Time</p>
              <p className="text-2xl font-bold text-cosmic-orange">{formatTime(timeElapsed)}</p>
            </div>
          </div>

          {score >= quiz.passingScore ? (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-400 font-semibold text-center">
                ✅ Congratulations! You passed the quiz!
              </p>
            </div>
          ) : (
            <div className="p-4 bg-orange-500/10 border border-orange-500 rounded-lg">
              <p className="text-orange-400 font-semibold text-center">
                📚 Keep learning! You need {quiz.passingScore}% to pass.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setShowResults(false);
              }}
              className="flex-1 bg-cosmic-blue hover:bg-blue-600"
            >
              Review Answers
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-space-600 text-space-300 hover:bg-space-700"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-space-800/50 border-space-700">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-2xl text-white">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-space-300 mt-1">
                {quiz.description}
              </CardDescription>
            )}
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${timeRemaining && timeRemaining < 60 ? 'text-red-400' : 'text-cosmic-blue'}`} />
              <span className={`text-lg font-semibold ${timeRemaining && timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeRemaining || 0)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-space-400">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <Badge variant="outline" className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue">
              {currentQuestion.points} points
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {currentQuestion.question}
          </h3>
          {renderQuestion()}
        </div>

        {isSubmitted && currentQuestion.explanation && (
          <div className="p-4 bg-cosmic-blue/10 border border-cosmic-blue rounded-lg">
            <p className="text-sm font-semibold text-cosmic-blue mb-1">Explanation:</p>
            <p className="text-space-200">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="border-space-600 text-space-300 hover:bg-space-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 && !isSubmitted ? (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-cosmic-green hover:bg-green-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="bg-cosmic-blue hover:bg-blue-600"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-space-500 pt-2 border-t border-space-700">
          <span>Answered: {Object.keys(answers).length}/{totalQuestions}</span>
          <span>Time: {formatTime(timeElapsed)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

