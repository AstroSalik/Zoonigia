import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import NovaSirius from "@/components/NovaSirius";

// Lazy load pages for better performance and code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Register = lazy(() => import("@/pages/Register"));
const Workshops = lazy(() => import("@/pages/Workshops"));
const Courses = lazy(() => import("@/pages/Courses"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Campaigns = lazy(() => import("@/pages/Campaigns"));
const CampaignDetail = lazy(() => import("@/pages/CampaignDetail"));
const Schools = lazy(() => import("@/pages/Schools"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const BlogEditorUser = lazy(() => import("@/pages/BlogEditorUser"));
const UserBlogDashboard = lazy(() => import("@/pages/UserBlogDashboard"));
const AdminBlogReview = lazy(() => import("@/pages/AdminBlogReview"));
const Contact = lazy(() => import("@/pages/Contact"));
const Collaborators = lazy(() => import("@/pages/Collaborators"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const BlogEditor = lazy(() => import("@/pages/BlogEditor"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const OurPledge = lazy(() => import("@/pages/OurPledge"));
const Landing = lazy(() => import("@/pages/Landing"));
const NovaChat = lazy(() => import("@/pages/NovaChat"));
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("@/pages/ShippingPolicy"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    }>
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
        {/* Specific blog routes MUST come before the generic :id route */}
        <Route path="/blog/new" component={BlogEditorUser} />
        <Route path="/blog/my-posts" component={UserBlogDashboard} />
        <Route path="/blog/edit/:id" component={BlogEditorUser} />
        {/* Generic :id route comes LAST to avoid matching "new" and "my-posts" */}
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/collaborators" component={Collaborators} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/our-pledge" component={OurPledge} />
        <Route path="/nova" component={NovaChat} />

        {/* Legal and Policy pages */}
        <Route path="/terms-and-conditions" component={TermsAndConditions} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/shipping-policy" component={ShippingPolicy} />
        <Route path="/refund-policy" component={RefundPolicy} />

        {/* User dashboard - accessible to all, handles auth internally */}
        <Route path="/dashboard" component={UserDashboard} />

        {/* Admin route - accessible to all, handles auth internally */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/blog-editor" component={BlogEditor} />
        <Route path="/admin/blog-editor/:id" component={BlogEditor} />
        <Route path="/admin/blog-review" component={AdminBlogReview} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
          {/* <NovaSirius /> - Disabled by user request */}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
