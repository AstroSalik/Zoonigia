import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Rocket, Menu, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@shared/types";

const Navigation = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/workshops", label: "Workshops" },
    { href: "/courses", label: "Courses" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/schools", label: "Schools" },
    { href: "/collaborators", label: "Collaborators" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Rocket className="w-8 h-8 text-cosmic-blue" />
            <h1 className="text-2xl font-space font-bold text-space-50">Zoonigia</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-cosmic-blue"
                    : "text-space-200 hover:text-cosmic-blue"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-cosmic-blue text-space-900">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-space-800 border-space-700" align="end" forceMount>
                  <div className="px-2 py-1.5 text-sm text-space-400 border-b border-space-700">
                    Logged in as {user?.firstName || user?.email || "User"}
                  </div>
                  <DropdownMenuItem className="text-space-200 hover:text-space-50 hover:bg-space-700">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem 
                      className="text-space-200 hover:text-space-50 hover:bg-space-700"
                      onClick={() => window.location.href = '/admin'}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-space-200 hover:text-space-50 hover:bg-space-700"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Sign In
                </Button>
                <Link href="/register">
                  <Button className="cosmic-gradient hover:opacity-90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-space-900 border-space-700">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-2 mb-8">
                  <Rocket className="w-6 h-6 text-cosmic-blue" />
                  <h2 className="text-xl font-space font-bold text-space-50">Zoonigia</h2>
                </div>
                
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg transition-colors ${
                      isActive(item.href)
                        ? "text-cosmic-blue"
                        : "text-space-200 hover:text-cosmic-blue"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-space-800 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                          <AvatarFallback className="bg-cosmic-blue text-space-900">
                            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-space-50 font-medium">
                            {user?.firstName && user?.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user?.email || "User"}
                          </div>
                          <div className="text-space-400 text-sm">{user?.email || ""}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900"
                        onClick={() => window.location.href = '/api/logout'}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900"
                        onClick={() => window.location.href = '/api/login'}
                      >
                        Sign In
                      </Button>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="cosmic-gradient hover:opacity-90">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
