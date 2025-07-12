import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Telescope, 
  Download, 
  Headphones, 
  Shirt, 
  Search, 
  Filter,
  ShoppingCart,
  Package,
  Clock,
  Star
} from "lucide-react";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // Mock product data - would come from API in real implementation
  const products = [
    {
      id: 1,
      title: "Astronomy Starter Kit",
      category: "physical",
      price: 2999,
      originalPrice: 3499,
      description: "Complete stargazing equipment for beginners including telescope, star charts, and guide",
      image: "🔭",
      isComingSoon: true,
      rating: 4.8,
      reviews: 245
    },
    {
      id: 2,
      title: "Digital Study Guides - Basic Astronomy",
      category: "digital",
      price: 499,
      description: "Comprehensive learning materials with interactive content and quizzes",
      image: "📚",
      isComingSoon: true,
      rating: 4.9,
      reviews: 189
    },
    {
      id: 3,
      title: "VR Space Experience Kit",
      category: "physical",
      price: 1999,
      originalPrice: 2299,
      description: "Virtual reality learning modules for immersive space exploration",
      image: "🥽",
      isComingSoon: true,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      title: "Zoonigia T-Shirt - To The Stars",
      category: "merchandise",
      price: 299,
      description: "Premium quality cotton t-shirt with inspiring space design",
      image: "👕",
      isComingSoon: true,
      rating: 4.6,
      reviews: 324
    },
    {
      id: 5,
      title: "Robotics Building Kit",
      category: "physical",
      price: 4999,
      description: "Complete kit for building and programming your own robot",
      image: "🤖",
      isComingSoon: true,
      rating: 4.8,
      reviews: 98
    },
    {
      id: 6,
      title: "Quantum Mechanics Course Materials",
      category: "digital",
      price: 799,
      description: "Advanced digital resources for quantum physics learning",
      image: "⚛️",
      isComingSoon: true,
      rating: 4.9,
      reviews: 67
    }
  ];

  const categories = [
    { value: "all", label: "All Products" },
    { value: "physical", label: "Physical Kits" },
    { value: "digital", label: "Digital Resources" },
    { value: "merchandise", label: "Merchandise" }
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "Under ₹500" },
    { value: "500-1000", label: "₹500 - ₹1,000" },
    { value: "1000-3000", label: "₹1,000 - ₹3,000" },
    { value: "3000+", label: "Above ₹3,000" }
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(p => p.replace("+", ""));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "physical":
        return <Package className="w-5 h-5" />;
      case "digital":
        return <Download className="w-5 h-5" />;
      case "merchandise":
        return <Shirt className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "text-cosmic-blue";
      case "digital":
        return "text-cosmic-green";
      case "merchandise":
        return "text-cosmic-purple";
      default:
        return "text-cosmic-blue";
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              Educational Resources <span className="text-cosmic-blue">Shop</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Discover our curated collection of educational kits, digital resources, and merchandise
            </p>
            
            {/* Coming Soon Badge */}
            <div className="mt-8">
              <GlassMorphism className="inline-block px-8 py-4">
                <div className="flex items-center text-lg">
                  <Clock className="w-6 h-6 text-cosmic-blue mr-3" />
                  <span className="font-semibold">Coming Soon - April 2025</span>
                </div>
              </GlassMorphism>
            </div>
          </div>

          {/* Filters */}
          <GlassMorphism className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-space-700 border-space-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger className="bg-space-700 border-space-600">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </GlassMorphism>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 opacity-60">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="bg-space-700 h-48 rounded-t-lg flex items-center justify-center">
                    <span className="text-6xl">{product.image}</span>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 bg-cosmic-orange px-3 py-1 rounded-full text-sm font-semibold">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(product.category)} bg-space-800/80`}>
                      <span className="flex items-center">
                        {getCategoryIcon(product.category)}
                        <span className="ml-1 text-xs">{product.category}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-cosmic-orange fill-current" : "text-space-400"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-space-400">({product.reviews} reviews)</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-space-300 mb-4 text-sm">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-cosmic-blue">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-space-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full cosmic-gradient opacity-60" disabled>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-space-300 mb-4">No products found</h3>
              <p className="text-space-400 mb-8">Try adjusting your filters or search terms</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedPriceRange("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-6 text-center">
                <Package className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-space-300">
                  Carefully curated educational materials and tools designed for optimal learning experiences
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Download className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Digital Resources</h3>
                <p className="text-space-300">
                  Instant access to comprehensive study guides, interactive content, and virtual lab experiences
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Star className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Expert Curated</h3>
                <p className="text-space-300">
                  All products are selected and reviewed by our team of education experts and scientists
                </p>
              </GlassMorphism>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="mb-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Product Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassMorphism className="p-6 text-center">
                <Telescope className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Astronomy Kits</h3>
                <p className="text-space-400 text-sm">Telescopes, star charts, observation tools</p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Download className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Digital Guides</h3>
                <p className="text-space-400 text-sm">Study materials, courses, e-books</p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Headphones className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">VR Experiences</h3>
                <p className="text-space-400 text-sm">Immersive learning modules</p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Shirt className="w-12 h-12 text-cosmic-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Merchandise</h3>
                <p className="text-space-400 text-sm">T-shirts, stickers, accessories</p>
              </GlassMorphism>
            </div>
          </div>

          {/* Notification Signup */}
          <div className="text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Be the First to Know!</h3>
              <p className="text-space-300 mb-6">
                Sign up to get notified when our shop launches in April 2025 and receive exclusive early-bird discounts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email"
                  className="bg-space-700 border-space-600"
                />
                <Button className="cosmic-gradient hover:opacity-90">
                  Notify Me
                </Button>
              </div>
              <p className="text-xs text-space-400 mt-4">
                We'll only send you updates about the shop launch. No spam, we promise!
              </p>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
