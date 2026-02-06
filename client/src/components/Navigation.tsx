import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User as UserIcon, Shield, LayoutDashboard, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle, signOutUser } from "@/lib/googleAuth";

const Navigation = () => {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isNavigatingRef = useRef(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    isNavigatingRef.current = false;
  }, [location]);

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
    { href: "/nova", label: "Nova AI", icon: "sparkles" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const handleMobileNav = (path: string) => {
    isNavigatingRef.current = true;
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity group">
            <img
              src="/zoonigia-logo.svg"
              alt="Zoonigia Logo"
              className="h-10 w-auto brightness-110 contrast-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation - Changed from md:flex to xl:flex to prevent cutting off on tablets */}
          <div className="hidden xl:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors flex items-center gap-1 ${isActive(item.href)
                    ? "text-cosmic-blue"
                    : "text-space-200 hover:text-cosmic-blue"
                  }`}
              >
                {item.icon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons - Changed from md:flex to xl:flex */}
          <div className="hidden xl:flex items-center space-x-4">
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
                    Logged in as {(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.email || "User"}
                  </div>
                  <DropdownMenuItem className="text-space-200 hover:text-space-50 hover:bg-space-700">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-space-200 hover:text-space-50 hover:bg-space-700"
                    onClick={() => navigate('/dashboard')}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>My Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-space-200 hover:text-space-50 hover:bg-space-700"
                    onClick={() => navigate('/leaderboard')}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Leaderboard</span>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem
                      className="text-space-200 hover:text-space-50 hover:bg-space-700"
                      onClick={() => navigate('/admin')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-space-200 hover:text-space-50 hover:bg-space-700"
                    onClick={() => signOutUser()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (error) {
                    // Handle error
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile/Tablet Menu - Visible up to xl screens */}
          <Sheet open={isOpen} onOpenChange={(open) => {
            if (!isNavigatingRef.current) setIsOpen(open);
          }}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                onClick={() => {
                  if (!isNavigatingRef.current) setIsOpen(true);
                }}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-space-900 border-space-700 overflow-y-auto">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center mb-4">
                  <img
                    src="/zoonigia-logo.svg"
                    alt="Zoonigia Logo"
                    className="h-8 w-auto brightness-110 contrast-110"
                  />
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg transition-colors flex items-center gap-2 ${isActive(item.href) ? "text-cosmic-blue" : "text-space-200"
                      }`}
                    onClick={() => {
                      isNavigatingRef.current = true;
                      setIsOpen(false);
                    }}
                  >
                    {item.icon === 'sparkles' && <Sparkles className="w-5 h-5" />}
                    {item.label}
                  </Link>
                ))}

                <div className="border-t border-space-700 pt-6 flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-space-800 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.profileImageUrl || ""} />
                          <AvatarFallback className="bg-cosmic-blue text-space-900">
                            {user?.firstName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-space-50 font-medium truncate">
                            {user?.firstName || "User"}
                          </div>
                          <div className="text-space-400 text-xs truncate">{user?.email}</div>
                        </div>
                      </div>

                      {/* Mobile User Menu Options */}
                      <Button variant="ghost" className="justify-start text-space-200" onClick={() => handleMobileNav('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                      </Button>

                      <Button variant="ghost" className="justify-start text-space-200" onClick={() => handleMobileNav('/leaderboard')}>
                        <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                      </Button>

                      {user?.isAdmin && (
                        <Button variant="ghost" className="justify-start text-space-200" onClick={() => handleMobileNav('/admin')}>
                          <Shield className="mr-2 h-4 w-4" /> Admin Dashboard
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 mt-2"
                        onClick={() => signOutUser()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-cosmic-blue text-cosmic-blue"
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                          setIsOpen(false);
                        } catch (error) { }
                      }}
                    >
                      Sign In
                    </Button>
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