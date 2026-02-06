import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeft,
  Menu,
  Bot,
  User,
  ChevronRight
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

// --- Helper Component: Markdown Renderer (Lite Version) ---
// Renders basic markdown (bold, italic, code) without heavy libraries
const MarkdownText = ({ content }: { content: string }) => {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Render Code Block
          const codeContent = part.slice(3, -3).replace(/^.*\n/, ''); // Remove language tag if present
          return (
            <div key={index} className="bg-slate-950 rounded-lg p-3 my-2 overflow-x-auto border border-purple-500/20">
              <pre className="text-xs md:text-sm font-mono text-purple-200 font-normal">{codeContent}</pre>
            </div>
          );
        }

        // Render Regular Text with Bold/Italic support
        return (
          <p key={index} className="leading-relaxed whitespace-pre-wrap">
            {part.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((subPart, i) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return <strong key={i} className="font-bold text-purple-200">{subPart.slice(2, -2)}</strong>;
              }
              if (subPart.startsWith('*') && subPart.endsWith('*')) {
                return <em key={i} className="italic text-purple-300">{subPart.slice(1, -1)}</em>;
              }
              return subPart;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default function NovaChat() {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Restore icon components for actions
  const restoreMessageIcons = (message: any): Message => {
    const restoredMessage: Message = {
      ...message,
      timestamp: new Date(message.timestamp),
      actions: message.actions?.map((action: any) => {
        let icon: React.ReactNode;
        if (action.action.includes('courses')) icon = <BookOpen className="w-4 h-4" />;
        else if (action.action.includes('dashboard')) icon = <LayoutDashboard className="w-4 h-4" />;
        else if (action.action.includes('leaderboard')) icon = <Trophy className="w-4 h-4" />;
        else if (action.action.includes('workshops')) icon = <GraduationCap className="w-4 h-4" />;
        else icon = <BookOpen className="w-4 h-4" />;
        return { ...action, icon };
      })
    };
    return restoredMessage;
  };

  // Load chat history
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

  // Clean data for storage
  const cleanMessageForStorage = (message: Message): any => {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      suggestions: message.suggestions,
      actions: message.actions?.map(action => ({
        label: action.label,
        action: action.action,
        icon: typeof action.icon === 'string' ? action.icon : undefined
      }))
    };
  };

  const saveHistory = (sessionsToSave: ChatSession[]) => {
    try {
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
    const messagesArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (messagesArea) {
      setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }, 50);
    }
  };

  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  useEffect(() => {
    if (shouldAutoScroll && messages.length > 0) {
      scrollToBottom();
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleTaskAction = async (action: string) => {
    if (action.startsWith('navigate:')) {
      const path = action.replace('navigate:', '');
      navigate(path);
      toast({ title: 'Navigating...', description: `Taking you to ${path}` });
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Reset height of textarea
    if (inputRef.current) inputRef.current.style.height = 'auto';

    // Session Management Logic
    let newSessionId = currentSession;
    let newSessions = [...sessions];

    if (!currentSession) {
      const titleWords = text.split(' ').slice(0, 5).join(' ');
      const title = titleWords.length > 30 ? titleWords.slice(0, 30) + '...' : titleWords;

      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: title || 'New Chat',
        messages: updatedMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      newSessions = [newSession, ...sessions];
      newSessionId = newSession.id;
      setCurrentSession(newSessionId);
    } else {
      newSessions = sessions.map(s =>
        s.id === currentSession
          ? { ...s, messages: updatedMessages, updatedAt: new Date() }
          : s
      );
    }
    setSessions(newSessions);
    saveHistory(newSessions);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.id) headers['x-user-id'] = user.id;

      const conversationHistory = messages.slice(-10).map(m => ({
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

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      if (data.action) await handleTaskAction(data.action);

      const novaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: data.response || data.message || 'I apologize, but I couldn\'t process that request.',
        timestamp: new Date(),
        suggestions: data.suggestions,
        actions: data.actions?.map((a: any) => ({
          label: a.label,
          action: a.action,
          icon: a.icon === 'courses' ? <BookOpen className="w-4 h-4" /> :
            a.icon === 'dashboard' ? <LayoutDashboard className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />
        })),
      };

      const finalMessages = [...updatedMessages, novaMessage];
      setMessages(finalMessages);
      setShouldAutoScroll(true);

      // Update session with AI response
      const finalSessions = newSessions.map(s =>
        s.id === newSessionId
          ? { ...s, messages: finalMessages, updatedAt: new Date() }
          : s
      );
      setSessions(finalSessions);
      saveHistory(finalSessions);

    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Connection Error', description: 'Failed to reach Nova.', variant: 'destructive' });
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
    setMobileMenuOpen(false);
    setCurrentSession(null);
    setMessages([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleLoadSession = (sessionId: string) => {
    setMobileMenuOpen(false);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(sessionId);
      setMessages(session.messages);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveHistory(updatedSessions);
    if (currentSession === sessionId) {
      handleNewChat();
    }
  };

  // --- UI Components ---

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center justify-between mb-4 px-2 pt-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <h2 className="font-semibold text-white text-sm">History</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNewChat} className="h-8 w-8 text-purple-300 hover:text-white hover:bg-purple-500/20">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-2">
          {sessions.length === 0 ? (
            <div className="text-center text-xs text-purple-300/40 py-8">No history yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm',
                  currentSession === session.id ? 'bg-purple-500/20 border border-purple-400/50' : 'hover:bg-purple-500/10'
                )}
                onClick={() => handleLoadSession(session.id)}
              >
                <MessageCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 truncate">{session.title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 text-red-400 hover:bg-red-500/20"
                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-space-950 pb-0 flex flex-col">
      <Navigation />

      <div className="flex-1 container mx-auto px-0 md:px-4 py-4 md:py-6 max-w-7xl pt-20 md:pt-24 flex gap-4 h-[100dvh]">

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-72 flex-shrink-0 flex-col mb-4">
          <Card className="flex flex-col h-full bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
            <SidebarContent />
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0 h-full pb-2 md:pb-4">
          <Card className="flex flex-col h-full bg-slate-900/80 border-purple-500/20 backdrop-blur-xl shadow-2xl rounded-none md:rounded-xl border-x-0 md:border-x">

            {/* Chat Header */}
            <CardHeader className="border-b border-purple-500/20 py-3 px-4 flex-shrink-0 bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="md:hidden">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-2 text-purple-300">
                          <Menu className="w-5 h-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-72 bg-slate-900 border-purple-500/20 p-0">
                        <SidebarContent />
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900" />
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                      Nova Sirius <Badge variant="outline" className="text-[10px] h-4 px-1 border-purple-500/50 text-purple-300">AI</Badge>
                    </h3>
                    <p className="text-xs text-slate-400">Online • Ready to help</p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleNewChat} className="hidden md:flex text-purple-300 hover:bg-purple-500/10">
                  <Plus className="w-4 h-4 mr-2" /> New Chat
                </Button>
              </div>
            </CardHeader>

            {/* Chat Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6 pb-4 max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  // Empty State / Welcome Screen
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4 mx-auto rotate-3">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 -z-10" />
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Hi, I'm Nova Sirius
                      </h2>
                      <p className="text-slate-400">
                        I'm your personal cosmic guide. I can help you find courses, answer science questions, or navigate Zoonigia.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                      {[
                        { icon: <BookOpen className="w-4 h-4 text-blue-400" />, label: "Find robotics courses" },
                        { icon: <Rocket className="w-4 h-4 text-orange-400" />, label: "Explain black holes" },
                        { icon: <GraduationCap className="w-4 h-4 text-green-400" />, label: "How do I get certified?" },
                        { icon: <Trophy className="w-4 h-4 text-yellow-400" />, label: "Show the leaderboard" },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(item.label)}
                          className="flex items-center gap-3 p-3 text-left bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-purple-500/30 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                          <span className="text-sm text-slate-300 group-hover:text-white">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Chat Messages
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'nova' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className={cn(
                        'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                        message.role === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                      )}>
                        {/* Use Markdown Renderer for Nova */}
                        {message.role === 'nova' ? (
                          <div className="text-sm md:text-base">
                            <MarkdownText content={message.content} />
                          </div>
                        ) : (
                          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        )}

                        {/* Interactive Elements (Suggestions/Actions) */}
                        {(message.suggestions || message.actions) && (
                          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                            {message.suggestions?.map((suggestion, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="cursor-pointer hover:bg-white/10 border-white/20 text-xs py-1 transition-colors"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                            {message.actions?.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                                onClick={() => handleTaskAction(action.action)}
                              >
                                {action.icon}
                                <span className="ml-1.5">{action.label}</span>
                                <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 md:p-4 bg-slate-900/80 border-t border-purple-500/20 backdrop-blur-md">
              <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-slate-800/50 border border-purple-500/30 rounded-xl p-2 focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/30 transition-all">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question about space, physics, or courses..."
                  className="min-h-[44px] max-h-[120px] w-full resize-none border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-slate-400 py-3"
                  rows={1}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className={cn(
                    "h-10 w-10 mb-0.5 transition-all duration-300",
                    input.trim()
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-slate-700 text-slate-400"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-2">
                Nova AI can make mistakes. Consider checking important information.
              </p>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}