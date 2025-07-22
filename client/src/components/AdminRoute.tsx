import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, user: currentUser, firebaseUser } = useAuth();
  const { toast } = useToast();

  // Check if current user is admin - use the user from useAuth which includes admin status
  const isAdmin = currentUser?.isAdmin || false;

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser !== null) {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    }
  }, [isAuthenticated, isLoading, currentUser, isAdmin, toast]);

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-space-300 mb-6">Please log in to access this page.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="cosmic-gradient px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // User data not loaded yet
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-space-300 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="cosmic-gradient px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;