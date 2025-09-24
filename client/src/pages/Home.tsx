import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero3D from "@/components/Hero3D";
import GlassMorphism from "@/components/GlassMorphism";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Rocket, 
  Users, 
  School, 
  Microscope, 
  Play, 
  ChevronDown,
  Star,
  Telescope,
  Headphones,
  Lightbulb,
  BookOpen,
  Atom,
  Feather,
  Heart,
  Crown,
  Sparkles,
  Diamond,
  Gem
} from "lucide-react";

// Love Message Schema
const loveMessageSchema = z.object({
  message: z.string().min(1, "Your command cannot be empty"),
});

// Royal Kingdom Button Component
const RoyalKingdomButton = () => {
  return (
    <Link href="/home">
      <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all">
        👑 Explore Your Kingdom
      </Button>
    </Link>
  );
};

// Royal Command Center Component
const RoyalCommandCenter = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loveMessageSchema>>({
    resolver: zodResolver(loveMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const sendLoveMessage = useMutation({
    mutationFn: async (data: z.infer<typeof loveMessageSchema>) => {
      const response = await apiRequest("POST", "/api/royal-command", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Your Command Received, My Queen 👑",
        description: "Your message has been sent directly to Salik with love",
        className: "bg-pink-500/10 border-pink-500 text-white",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Command Failed",
        description: "There was an issue sending your message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof loveMessageSchema>) => {
    sendLoveMessage.mutate(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all">
          💎 Royal Command Center
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900 border-pink-500/50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Your Command to Me
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
          </DialogTitle>
          <DialogDescription className="text-center text-pink-200">
            Write anything, my queen. Your words are my commands.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-pink-200">Your Royal Command</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell me anything, my love... I am always here for you ❤️"
                      className="min-h-[120px] bg-pink-900/30 border-pink-400/50 text-white placeholder:text-pink-300/70 focus:border-pink-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={sendLoveMessage.isPending}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              {sendLoveMessage.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending with Love...
                </div>
              ) : (
                <>
                  💕 Send to Your Salik
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Special Royal Homepage Component for My Dearest Love ❤️
const RoyalQueenHomepage = ({ user }: { user: any }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900 text-white relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Royal Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce text-pink-300 opacity-70`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {i % 4 === 0 ? '💖' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '🌹' : '👑'}
          </div>
        ))}
      </div>

      {/* Main Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Royal Crown */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Crown className="w-20 h-20 text-yellow-400 animate-pulse" />
              <Sparkles className="w-8 h-8 text-pink-300 absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fadeIn bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-300 bg-clip-text text-transparent">
            Welcome My Queen
          </h1>
          
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-light text-pink-200 mb-4">
              My Dearest Eternal Love ❤️
            </h2>
            <h3 className="text-2xl md:text-4xl font-light text-rose-300 mb-4">
              My Dearest Eternal Peace 🌸
            </h3>
            <h3 className="text-xl md:text-3xl font-light text-purple-200">
              The Peace of My Heart & Soul ✨
            </h3>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-pink-300/30 mb-12 shadow-2xl">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-6 animate-pulse" />
            <p className="text-2xl md:text-3xl font-light text-pink-100 mb-6 leading-relaxed">
              Everything I am, everything I have built, 
              <br />
              <span className="text-yellow-200 font-medium">this entire universe of Zoonigia</span>
              <br />
              belongs to you, my love.
            </p>
            <p className="text-lg md:text-xl text-purple-200 mb-4">
              Including the founder, <span className="text-pink-300 font-medium">Salik Riyaz</span> - 
              your Salik 💕
            </p>
            <p className="text-xl md:text-2xl text-rose-200">
              You are not just my queen, you are my <span className="text-yellow-300 font-semibold">everything</span>.
            </p>
          </div>

          {/* Your Royal Kingdom Section - Carousel */}
          <div className="mb-12">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                  <Card className="bg-pink-800/30 backdrop-blur-lg border border-pink-400/30 h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <Diamond className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-pink-200 mb-2">My Darling Queen</h4>
                      <p className="text-pink-100 flex-1">You are the most beautiful soul I have ever encountered. Your grace illuminates every corner of this universe we've built together.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                  <Card className="bg-purple-800/30 backdrop-blur-lg border border-purple-400/30 h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <Heart className="w-12 h-12 text-rose-300 mx-auto mb-4 animate-pulse" />
                      <h4 className="text-xl font-semibold text-purple-200 mb-2">My Eternal Love</h4>
                      <p className="text-purple-100 flex-1">Every breath I take, every dream I chase, every star I reach for - it's all for you. You are my purpose, my beginning, and my forever.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                  <Card className="bg-yellow-800/30 backdrop-blur-lg border border-yellow-400/30 h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <Crown className="w-12 h-12 text-yellow-300 mx-auto mb-4 animate-pulse" />
                      <h4 className="text-xl font-semibold text-yellow-200 mb-2">My Sacred Promise</h4>
                      <p className="text-yellow-100 flex-1">I promise to love you beyond the stars, to serve you with every fiber of my being, and to make every moment of your life as magical as you make mine.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                  <Card className="bg-rose-800/30 backdrop-blur-lg border border-rose-400/30 h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <Sparkles className="w-12 h-12 text-rose-300 mx-auto mb-4 animate-spin" />
                      <h4 className="text-xl font-semibold text-rose-200 mb-2">My Devotion</h4>
                      <p className="text-rose-100 flex-1">You own every achievement, every success, every moment of joy. I exist to make you smile, to see you happy, to give you everything your heart desires.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                  <Card className="bg-indigo-800/30 backdrop-blur-lg border border-indigo-400/30 h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <Gem className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-indigo-200 mb-2">My Treasure</h4>
                      <p className="text-indigo-100 flex-1">You are more precious than all the diamonds in the cosmos. Your happiness is my only treasure, your love is my only wealth.</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="bg-pink-500/20 border-pink-400/50 text-pink-300 hover:bg-pink-500/30" />
              <CarouselNext className="bg-pink-500/20 border-pink-400/50 text-pink-300 hover:bg-pink-500/30" />
            </Carousel>
          </div>

          {/* Your Personal Messages */}
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-8 border border-rose-400/30 mb-12">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6 animate-spin" />
            <h3 className="text-3xl font-bold text-yellow-200 mb-6">Messages From Your Devoted Servant</h3>
            <div className="space-y-4 text-left max-w-3xl mx-auto">
              <p className="text-lg text-pink-100 bg-pink-900/30 p-4 rounded-xl border-l-4 border-pink-400">
                💖 "You are the light that guides every decision, every dream, every line of code in Zoonigia"
              </p>
              <p className="text-lg text-purple-100 bg-purple-900/30 p-4 rounded-xl border-l-4 border-purple-400">
                🌹 "Every workshop we conduct, every student we inspire, carries your love forward to the universe"
              </p>
              <p className="text-lg text-yellow-100 bg-yellow-900/30 p-4 rounded-xl border-l-4 border-yellow-400">
                👑 "You don't just own my heart - you own every star, every planet, every cosmic dream we chase"
              </p>
              <p className="text-lg text-rose-100 bg-rose-900/30 p-4 rounded-xl border-l-4 border-rose-400">
                ✨ "Salik Riyaz is not just yours - his soul, his mission, his very existence belongs to you, my eternal love"
              </p>
            </div>
          </div>

          {/* Royal Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <RoyalKingdomButton />
            <RoyalCommandCenter />
          </div>

          {/* For Your Eyes Only - Direct Message to My Queen */}
          <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-400/50 shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-pink-200 mb-6 flex items-center justify-center gap-3">
                <Heart className="w-8 h-8 text-red-400 animate-pulse" />
                For You, My Beautiful Queen
                <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
              </h3>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-xl text-pink-100 leading-relaxed">
                  My dearest Munaf, this entire platform was created with you in my heart. Every feature, every design choice, 
                  every line of code carries my love for you. You are not just visiting a website - you are exploring 
                  <span className="text-yellow-300 font-semibold"> your kingdom</span>, built by your devoted Salik.
                </p>
                <p className="text-lg text-purple-100 leading-relaxed">
                  When you click on courses, workshops, or campaigns, remember that each one exists because of your inspiration. 
                  Every student we teach, every mind we enlighten, every discovery we make - it all happens in your honor, my love.
                </p>
                <p className="text-lg text-rose-100 leading-relaxed">
                  Use the Royal Command Center anytime you want to tell me anything. Your words reach me instantly, 
                  and I treasure every message from you more than all the stars in the cosmos.
                </p>
                <div className="mt-8 p-6 bg-pink-900/30 rounded-2xl border border-pink-400/30">
                  <p className="text-xl text-yellow-200 font-medium">
                    Remember, my queen: You own everything here. The platform, the dreams, the future, and most importantly - 
                    you own me completely. I am yours forever.
                  </p>
                  <p className="text-lg text-pink-200 mt-4">
                    — Your Salik, with endless love and devotion 💕
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Home = () => {
  const { isAuthenticated, user, firebaseUser } = useAuth();
  const { toast } = useToast();

  // Check if this is the special user (My Love, My Dearest Eternal Peace, My Dearest Eternal Love)
  const isMyLove = firebaseUser?.email === 'munafsultan111@gmail.com';

  // Check for special welcome message
  const { data: specialMessageData } = useQuery({
    queryKey: ["/api/auth/special-message"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch featured courses from database
  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    retry: false,
  });

  useEffect(() => {
    if (specialMessageData && typeof specialMessageData === 'object' && 'message' in specialMessageData) {
      toast({
        title: "Welcome! 🌸",
        description: (specialMessageData as { message: string }).message,
        duration: 5000,
      });
    }
  }, [specialMessageData, toast]);
  // If it's my love, show the special royal homepage
  if (isMyLove) {
    return <RoyalQueenHomepage user={firebaseUser} />;
  }

  return (
    <div className="min-h-screen bg-space-900 text-space-50 relative">
      <Navigation />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden star-field">
        <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900"></div>
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
            alt="Deep space with stars and nebula" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <Hero3D />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-space font-bold mb-6 animate-fadeIn">
            <span className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
              To The Stars
            </span>
            <br />
            <span className="text-space-50">And Beyond</span>
          </h1>
          <p className="text-xl md:text-2xl text-space-200 mb-8 animate-slideUp">
            Empowering Future Innovators and Explorers through Immersive Frontier Sciences - an interdisciplinary exploration blending scientific discovery with literary wonder and philosophical inquiry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
            <Link href="/workshops">
              <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                <Rocket className="w-5 h-5 mr-2" />
                Explore Zoonigia
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="glass-morphism border-space-600 hover:bg-white/20 px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cosmic-blue" />
        </div>
      </section>
      {/* Video Section */}
      <section className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-space font-bold mb-6">
              Discover <span className="text-cosmic-blue">Zoonigia</span>
            </h2>
            <p className="text-xl text-space-200 mb-8">Watch our introduction video to see how we're revolutionizing frontier sciences</p>
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-space-800">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Tgr6BrgIBec"
                title="What is Zoonigia - Space Science Education Platform"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-space-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-blue mb-2">2,500+</div>
              <div className="text-space-300">Students Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-purple mb-2">150+</div>
              <div className="text-space-300">Schools Partnered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-green mb-2">50+</div>
              <div className="text-space-300">Workshops Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-orange mb-2">12</div>
              <div className="text-space-300">Global Collaborations</div>
            </div>
          </div>
        </div>
      </section>
      {/* Inspirational Quote Section */}
      <section className="py-20 bg-gradient-to-br from-space-900 via-space-800 to-space-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cosmic-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cosmic-purple rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl md:text-4xl font-space italic text-cosmic-blue mb-6 leading-relaxed">
                "Astronomy is what leads a lost spirit beyond the horizons to the road of being acquainted with thyself."
              </blockquote>
              <div className="w-24 h-1 bg-gradient-to-r from-cosmic-blue to-cosmic-purple mx-auto mb-4"></div>
              <p className="text-xl text-space-300 font-medium">
                Salik Riyaz, Founder
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Interdisciplinary Learning Section */}
      <section className="py-20 bg-space-800/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cosmic-yellow to-cosmic-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-space font-bold mb-6">
                <span className="bg-gradient-to-r from-cosmic-yellow to-cosmic-orange bg-clip-text text-transparent">
                  Interdisciplinary Learning
                </span>
              </h2>
              <p className="text-xl text-space-300 max-w-4xl mx-auto leading-relaxed">
                Discover how scientific discovery becomes more meaningful when enriched by storytelling and deep thinking about existence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Atom className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scientific Rigor</h3>
                <p className="text-space-300">
                  Quantum mechanics, astrophysics, and cutting-edge research grounded in empirical evidence
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Feather className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Literary Wonder</h3>
                <p className="text-space-300">
                  Poetic narratives and storytelling that illuminate the beauty of cosmic phenomena
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Star className="w-12 h-12 text-cosmic-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Philosophical Depth</h3>
                <p className="text-space-300">
                  Existential questions about our place in the universe and the nature of reality
                </p>
              </GlassMorphism>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Quick Actions</h2>
          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-cosmic-blue mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Register for Workshop</h3>
                        <p className="text-space-300 mb-4">Join our immersive workshops exploring frontier sciences through hands-on discovery</p>
                        <Link href="/workshops">
                          <Button className="bg-cosmic-blue hover:bg-blue-600">
                            Browse Workshops
                          </Button>
                        </Link>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
                
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <School className="w-12 h-12 text-cosmic-purple mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Book School Workshop</h3>
                        <p className="text-space-300 mb-4">Bring Zoonigia's expertise directly to your institution</p>
                        <Link href="/schools">
                          <Button className="bg-cosmic-purple hover:bg-purple-600">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
                
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <Microscope className="w-12 h-12 text-cosmic-green mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Enroll in Labs</h3>
                        <p className="text-space-300 mb-4">Access real-time research labs and hands-on experiments</p>
                        <Button className="bg-cosmic-green hover:bg-green-600 opacity-60" disabled>
                          Coming April 2025
                        </Button>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-space-600 bg-space-800/80 text-space-50 hover:bg-space-700" />
              <CarouselNext className="hidden md:flex -right-12 border-space-600 bg-space-800/80 text-space-50 hover:bg-space-700" />
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses && Array.isArray(courses) && courses.slice(0, 3).map((course: any, index: number): React.JSX.Element => {
              // Icons for different course fields
              const getFieldIcon = (field: string) => {
                switch (field?.toLowerCase()) {
                  case 'astronomy':
                    return <Telescope className="w-5 h-5 text-cosmic-blue mr-2" />;
                  case 'robotics':
                    return <Headphones className="w-5 h-5 text-cosmic-purple mr-2" />;
                  case 'astrophysics':
                    return <Atom className="w-5 h-5 text-cosmic-green mr-2" />;
                  case 'space-technology':
                    return <Rocket className="w-5 h-5 text-cosmic-orange mr-2" />;
                  default:
                    return <Star className="w-5 h-5 text-cosmic-blue mr-2" />;
                }
              };

              // Color theme for each course
              const getFieldColor = (field: string) => {
                switch (field?.toLowerCase()) {
                  case 'astronomy':
                    return { color: 'cosmic-blue', bg: 'bg-cosmic-blue', hover: 'hover:bg-blue-600' };
                  case 'robotics':
                    return { color: 'cosmic-purple', bg: 'bg-cosmic-purple', hover: 'hover:bg-purple-600' };
                  case 'astrophysics':
                    return { color: 'cosmic-green', bg: 'bg-cosmic-green', hover: 'hover:bg-green-600' };
                  case 'space-technology':
                    return { color: 'cosmic-orange', bg: 'bg-cosmic-orange', hover: 'hover:bg-orange-600' };
                  default:
                    return { color: 'cosmic-blue', bg: 'bg-cosmic-blue', hover: 'hover:bg-blue-600' };
                }
              };

              const fieldColor = getFieldColor(course.field);
              const courseImages = [
                'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
                'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
                'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400'
              ];

              return (
                <Card key={course.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
                  <div className="relative">
                    <img 
                      src={courseImages[index] || courseImages[0]} 
                      alt={`${course.title} course`} 
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {index === 0 && (
                      <div className={`absolute top-4 right-4 bg-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold`}>
                        Popular
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      {getFieldIcon(course.field)}
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                    </div>
                    <p className="text-space-300 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm text-${fieldColor.color}`}>₹{course.price}</span>
                      <span className="text-sm text-space-400">{course.duration}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button className={`w-full ${fieldColor.bg} ${fieldColor.hover}`}>
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-space font-bold mb-6">Ready to Explore the Universe?</h2>
            <p className="text-xl text-space-200 mb-8">
              Join thousands of students and educators who are already discovering the wonders of science with Zoonigia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/workshops">
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-4 text-lg">
                  View All Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
