import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Register from "@/pages/Register";
import Workshops from "@/pages/Workshops";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import Schools from "@/pages/Schools";

import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";
import Landing from "@/pages/Landing";

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Root route - show Landing for non-authenticated, Home for authenticated */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      
      {/* Public pages accessible to all users */}
      <Route path="/about" component={About} />
      <Route path="/register" component={Register} />
      <Route path="/workshops" component={Workshops} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/campaigns/:id" component={CampaignDetail} />
      <Route path="/schools" component={Schools} />

      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin route - only accessible to authenticated users */}
      {isAuthenticated && (
        <Route path="/admin" component={AdminDashboard} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
