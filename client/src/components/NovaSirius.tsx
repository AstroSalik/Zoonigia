import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  BookOpen,
  LayoutDashboard,
  Trophy,
  GraduationCap,
  Rocket,
  Lightbulb,
  MessageCircle,
  Trash2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'nova';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: { label: string; action: string; icon?: React.ReactNode }[];
}

interface NovaSiriusProps {
  className?: string;
}

export default function NovaSirius({ className }: NovaSiriusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load from localStorage for corner version
    try {
      const stored = localStorage.getItem('nova_corner_chat');
      if (stored) {
        const parsed = JSON.parse(stored).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        if (parsed.length > 0) return parsed;
      }
    } catch (error) {
      console.error('Error loading corner chat:', error);
    }
    return [
      {
        id: 'welcome',
        role: 'nova',
        content: 'Greetings, explorer 🌠 — I\'m Nova Sirius, your celestial guide through Zoonigia. Ask me anything, or let me help you navigate your journey among the stars!',
        timestamp: new Date(),
        suggestions: [
          'Show me courses',
          'Take me to workshops',
          'What\'s on my dashboard?',
          'Explain dark matter'
        ],
        actions: [
          { label: 'Explore Courses', action: 'navigate:/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'My Dashboard', action: 'navigate:/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Leaderboard', action: 'navigate:/leaderboard', icon: <Trophy className="w-4 h-4" /> }
        ]
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    // Small timeout to ensure DOM has updated with new content/loading spinner
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleTaskAction = async (action: string) => {
    if (action.startsWith('navigate:')) {
      const path = action.replace('navigate:', '');
      navigate(path);
      setIsOpen(false);
      toast({
        title: 'Navigating...',
        description: `Taking you to ${path}`,
      });
    } else if (action.startsWith('suggest:')) {
      const query = action.replace('suggest:', '');
      setInput(query);
      await handleSendMessage(query);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add user ID header if authenticated
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const response = await fetch('/api/nova', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
          userId: user?.id,
          isAuthenticated,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Nova');
      }

      const data = await response.json();

      // Handle task actions if present
      if (data.action) {
        await handleTaskAction(data.action);
      }

      const novaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: data.response || data.message || 'I apologize, but I couldn\'t process that request.',
        timestamp: new Date(),
        suggestions: data.suggestions,
        actions: data.actions?.map((a: any) => ({
          label: a.label,
          action: a.action,
          icon: a.icon ? (
            a.icon === 'courses' ? <BookOpen className="w-4 h-4" /> :
              a.icon === 'dashboard' ? <LayoutDashboard className="w-4 h-4" /> :
                a.icon === 'leaderboard' ? <Trophy className="w-4 h-4" /> :
                  a.icon === 'workshops' ? <GraduationCap className="w-4 h-4" /> :
                    a.icon === 'campaigns' ? <Rocket className="w-4 h-4" /> :
                      <MessageCircle className="w-4 h-4" />
          ) : undefined,
        })),
      };

      const updatedMessages = [...messages, novaMessage];
      setMessages(updatedMessages);

      // Save to localStorage for corner version
      try {
        localStorage.setItem('nova_corner_chat', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('Error saving corner chat:', error);
      }
    } catch (error) {
      console.error('Error communicating with Nova:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: 'I apologize, but I\'m experiencing some cosmic interference. Please try again in a moment.',
        timestamp: new Date(),
      };
      const updatedMessages = [...messages, errorMessage];
      setMessages(updatedMessages);

      // Save to localStorage for corner version
      try {
        localStorage.setItem('nova_corner_chat', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('Error saving corner chat:', error);
      }
      toast({
        title: 'Connection Error',
        description: 'Failed to communicate with Nova Sirius',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'nova',
      content: 'Greetings, explorer 🌠 — I\'m Nova Sirius, your celestial guide through Zoonigia. Ask me anything, or let me help you navigate your journey among the stars!',
      timestamp: new Date(),
      suggestions: [
        'Show me courses',
        'Take me to workshops',
        'What\'s on my dashboard?',
        'Explain dark matter'
      ],
      actions: [
        { label: 'Explore Courses', action: 'navigate:/courses', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'My Dashboard', action: 'navigate:/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Leaderboard', action: 'navigate:/leaderboard', icon: <Trophy className="w-4 h-4" /> }
      ]
    };
    setMessages([welcomeMessage]);
    try {
      localStorage.setItem('nova_corner_chat', JSON.stringify([welcomeMessage]));
    } catch (error) {
      console.error('Error clearing corner chat:', error);
    }
    toast({
      title: 'Chat Cleared',
      description: 'Conversation history has been cleared',
    });
  };

  const quickActions = [
    { label: 'Courses', action: 'navigate:/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Workshops', action: 'navigate:/workshops', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Campaigns', action: 'navigate:/campaigns', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Dashboard', action: 'navigate:/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Floating Orb Button */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50',
          className
        )}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-16 w-16 rounded-full shadow-lg transition-all duration-300',
            'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600',
            'hover:scale-110 hover:shadow-2xl',
            'relative overflow-hidden',
            isOpen && 'rotate-180'
          )}
          size="icon"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          <Sparkles className="w-8 h-8 text-white relative z-10 animate-pulse" />

          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] flex flex-col">
          <Card className="h-full flex flex-col bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-indigo-900/95 backdrop-blur-xl border-purple-500/30 shadow-2xl">
            {/* Header */}
            <CardHeader className="border-b border-purple-500/20 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Nova Sirius</h3>
                    <p className="text-xs text-purple-300">Cosmic Guide</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/nova')}
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                    title="Open Full Chat"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearHistory}
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                    title="Clear Chat History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5',
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                          : 'bg-slate-800/60 text-slate-100 border border-purple-500/30'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="cursor-pointer hover:bg-purple-500/20 border-purple-400/50 text-purple-200 text-xs"
                              onClick={() => handleSendMessage(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Quick Actions */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30"
                              onClick={() => handleTaskAction(action.action)}
                            >
                              {action.icon}
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/60 rounded-2xl px-4 py-2.5 border border-purple-500/30">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions Bar */}
            <div className="border-t border-purple-500/20 p-2">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-400/20 flex-shrink-0"
                    onClick={() => handleTaskAction(action.action)}
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-purple-500/20 p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Nova anything..."
                  className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

