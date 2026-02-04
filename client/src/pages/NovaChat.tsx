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
  Send, 
  Loader2,
  BookOpen,
  LayoutDashboard,
  Trophy,
  GraduationCap,
  Rocket,
  MessageCircle,
  Plus,
  Trash2,
  History,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  role: 'user' | 'nova';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: { label: string; action: string; icon?: React.ReactNode }[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'nova_chat_history';

export default function NovaChat() {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([
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
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Restore icon components for actions
  const restoreMessageIcons = (message: any): Message => {
    const restoredMessage: Message = {
      ...message,
      timestamp: new Date(message.timestamp),
      actions: message.actions?.map((action: any) => {
        // Restore icon based on action type or label
        let icon: React.ReactNode;
        if (action.action.includes('courses')) {
          icon = <BookOpen className="w-4 h-4" />;
        } else if (action.action.includes('dashboard')) {
          icon = <LayoutDashboard className="w-4 h-4" />;
        } else if (action.action.includes('leaderboard')) {
          icon = <Trophy className="w-4 h-4" />;
        } else if (action.action.includes('workshops')) {
          icon = <GraduationCap className="w-4 h-4" />;
        } else {
          icon = <BookOpen className="w-4 h-4" />; // Default icon
        }
        return {
          ...action,
          icon
        };
      })
    };
    return restoredMessage;
  };

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSessions = JSON.parse(stored).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map(restoreMessageIcons)
        }));
        setSessions(parsedSessions);
        
        // Restore the most recent session if available
        if (parsedSessions.length > 0) {
          const mostRecent = parsedSessions.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentSession(mostRecent.id);
          setMessages(mostRecent.messages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Clean message data before saving (remove React components)
  const cleanMessageForStorage = (message: Message): any => {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      suggestions: message.suggestions,
      // Actions should only store serializable data, not React components
      actions: message.actions?.map(action => ({
        label: action.label,
        action: action.action,
        icon: typeof action.icon === 'string' ? action.icon : undefined // Only save string icons
      }))
    };
  };

  // Save chat history to localStorage
  const saveHistory = (sessionsToSave: ChatSession[]) => {
    try {
      // Clean all messages before saving to avoid circular references
      const cleanedSessions = sessionsToSave.map(session => ({
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        messages: session.messages.map(cleanMessageForStorage)
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedSessions));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const scrollToBottom = () => {
    // Only scroll within the chat area, not the whole page
    // Find the ScrollArea viewport in the messages area
    const messagesArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (messagesArea) {
      setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }, 50);
    }
  };

  // Track if we should auto-scroll (only after user sends a message)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  useEffect(() => {
    // Only auto-scroll if user just sent a message (not on initial load)
    if (shouldAutoScroll && messages.length > 0) {
      scrollToBottom();
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTaskAction = async (action: string) => {
    if (action.startsWith('navigate:')) {
      const path = action.replace('navigate:', '');
      navigate(path);
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

    // Check if this is a navigation-only command (don't create chat for these)
    const isNavigationOnly = /^(take me to|go to|show me|open|navigate to)\s+(courses?|workshops?|campaigns?|dashboard|leaderboard|blog)/i.test(text);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Auto-create chat session if this is the first user message (not navigation-only)
    if (!currentSession && !isNavigationOnly && messages.length === 1) {
      // First message is welcome, so this is the first user message
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.length > 30 ? text.slice(0, 30) + '...' : text,
        messages: updatedMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setCurrentSession(newSession.id);
      saveHistory(updatedSessions);
    } else if (currentSession) {
      // Update existing session
      const updatedSessions = sessions.map(s => 
        s.id === currentSession 
          ? { ...s, messages: updatedMessages, updatedAt: new Date() }
          : s
      );
      setSessions(updatedSessions);
      saveHistory(updatedSessions);
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      // Filter history to only include user-assistant pairs (exclude welcome message)
      // Gemini requires history to start with a user message
      const conversationHistory = messages
        .filter(m => m.id !== 'welcome') // Remove welcome message
        .slice(-10) // Last 10 messages
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch('/api/nova', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          history: conversationHistory,
          userId: user?.id,
          isAuthenticated,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Nova');
      }

      const data = await response.json();

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

      const finalMessages = [...updatedMessages, novaMessage];
      setMessages(finalMessages);
      setShouldAutoScroll(true); // Enable auto-scroll after user sends message

      // Update session if it exists, or create one if this is not navigation-only
      const isNavigationOnly = /^(take me to|go to|show me|open|navigate to)\s+(courses?|workshops?|campaigns?|dashboard|leaderboard|blog)/i.test(text);
      
      if (!currentSession && !isNavigationOnly) {
        // Auto-create chat session for first real conversation
        // Use the first few words of the user's question as title
        const titleWords = text.split(' ').slice(0, 5).join(' ');
        const title = titleWords.length > 30 ? titleWords.slice(0, 30) + '...' : titleWords + (text.split(' ').length > 5 ? '...' : '');
        
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: title || 'New Chat',
          messages: finalMessages,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedSessions = [newSession, ...sessions];
        setSessions(updatedSessions);
        setCurrentSession(newSession.id);
        saveHistory(updatedSessions);
      } else if (currentSession) {
        const updatedSessions = sessions.map(s => 
          s.id === currentSession 
            ? { ...s, messages: finalMessages, updatedAt: new Date() }
            : s
        );
        setSessions(updatedSessions);
        saveHistory(updatedSessions);
      }
    } catch (error) {
      console.error('Error communicating with Nova:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: 'I apologize, but I\'m experiencing some cosmic interference. Please try again in a moment.',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Update session if it exists
      if (currentSession) {
        const updatedSessions = sessions.map(s => 
          s.id === currentSession 
            ? { ...s, messages: finalMessages, updatedAt: new Date() }
            : s
        );
        setSessions(updatedSessions);
        saveHistory(updatedSessions);
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

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
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
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSession(newSession.id);
    setMessages(newSession.messages);
    saveHistory(updatedSessions);
    toast({
      title: 'New Chat Started',
      description: 'A fresh conversation with Nova',
    });
  };

  const handleLoadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(sessionId);
      setMessages(session.messages);
      // Update session title if it's "New Chat" and has user messages
      if (session.title === 'New Chat' && session.messages.length > 1) {
        const firstUserMessage = session.messages.find(m => m.role === 'user');
        if (firstUserMessage) {
          const newTitle = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
          const updatedSessions = sessions.map(s =>
            s.id === sessionId ? { ...s, title: newTitle } : s
          );
          setSessions(updatedSessions);
          saveHistory(updatedSessions);
        }
      }
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveHistory(updatedSessions);
    
    if (currentSession === sessionId) {
      if (updatedSessions.length > 0) {
        handleLoadSession(updatedSessions[0].id);
      } else {
        handleNewChat();
      }
    }
    
    toast({
      title: 'Chat Deleted',
      description: 'The chat session has been removed',
    });
  };

  const handleClearHistory = () => {
    setSessions([]);
    setCurrentSession(null);
    setMessages([
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
    ]);
    saveHistory([]);
    toast({
      title: 'History Cleared',
      description: 'All chat history has been cleared',
    });
  };

  const quickActions = [
    { label: 'Courses', action: 'navigate:/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Workshops', action: 'navigate:/workshops', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Campaigns', action: 'navigate:/campaigns', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Dashboard', action: 'navigate:/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 pb-20">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-7xl pt-24">
        <div className="flex gap-4">
          {/* Sidebar - Chat History */}
          <div className="w-64 flex-shrink-0">
            <Card className="sticky top-24 flex flex-col bg-slate-900/60 border-purple-500/30 backdrop-blur-xl" style={{ height: 'calc(100vh - 200px)' }}>
              <CardHeader className="border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="font-semibold text-white">Chat History</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                    title="New Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 flex flex-col flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="space-y-1 pr-2">
                    {sessions.length === 0 ? (
                      <div className="text-center text-sm text-purple-300/50 py-8">
                        No chat history yet
                      </div>
                    ) : (
                      sessions.map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                            currentSession === session.id
                              ? 'bg-purple-500/20 border border-purple-400/50'
                              : 'hover:bg-purple-500/10'
                          )}
                          onClick={() => handleLoadSession(session.id)}
                        >
                          <MessageCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{session.title}</p>
                            <p className="text-xs text-purple-300/50">
                              {new Date(session.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20 flex-shrink-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                {sessions.length > 0 && (
                  <div className="pt-2 border-t border-purple-500/20 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All History
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Card className="sticky top-24 flex flex-col bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-indigo-900/95 backdrop-blur-xl border-purple-500/30 shadow-2xl" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Header */}
              <CardHeader className="border-b border-purple-500/20 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Nova Sirius</h3>
                      <p className="text-sm text-purple-300">Cosmic Guide of Zoonigia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNewChat}
                      className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/')}
                      className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 min-h-0 p-6 overflow-auto">
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
              <div className="border-t border-purple-500/20 p-3">
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
                    id="nova-chat-input"
                    name="nova-chat-input"
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

