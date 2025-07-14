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
import Campaigns from "@/pages/Campaigns";
import Schools from "@/pages/Schools";
import Collaborators from "@/pages/Collaborators";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Landing from "@/pages/Landing";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/register" component={Register} />
          <Route path="/workshops" component={Workshops} />
          <Route path="/courses" component={Courses} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/schools" component={Schools} />
          <Route path="/collaborators" component={Collaborators} />
          <Route path="/shop" component={Shop} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
        </>
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
