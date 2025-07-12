import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Rocket, Menu, X } from "lucide-react";

const Navigation = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
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
            <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
              Sign In
            </Button>
            <Button className="cosmic-gradient hover:opacity-90">
              <Link href="/register">Register</Link>
            </Button>
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
                  <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                    Sign In
                  </Button>
                  <Button className="cosmic-gradient hover:opacity-90">
                    <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
                  </Button>
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
