import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Calendar, 
  ArrowLeft, 
  User,
  Clock,
  Tag
} from "lucide-react";
import { BlogPost } from "@shared/types";

const BlogPostView = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", id],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-space-700 rounded mb-4"></div>
                <div className="h-4 bg-space-700 rounded mb-2"></div>
                <div className="h-4 bg-space-700 rounded mb-8"></div>
                <div className="h-64 bg-space-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4 text-white">Blog Post Not Found</h1>
              <p className="text-white mb-8">The blog post you're looking for doesn't exist.</p>
              <Button 
                onClick={() => window.history.back()}
                className="cosmic-gradient hover:opacity-90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to render markdown-like content with images
  const renderContent = (content: string) => {
    // Split content by lines and process each line
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-bold mb-6 text-cosmic-blue">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-3xl font-semibold mb-4 text-cosmic-purple mt-8">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-2xl font-semibold mb-3 text-cosmic-green mt-6">{line.substring(4)}</h3>;
      } else if (line.startsWith('#### ')) {
        return <h4 key={index} className="text-xl font-semibold mb-2 text-cosmic-orange mt-4">{line.substring(5)}</h4>;
      } else if (line.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-cosmic-blue pl-4 my-4 italic text-white bg-space-800/30 p-4 rounded-r-lg">
            {line.substring(2)}
          </blockquote>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return <li key={index} className="ml-6 mb-2 text-white">{line.trim().substring(2)}</li>;
      } else if (line.trim().match(/^\d+\. /)) {
        return <li key={index} className="ml-6 mb-2 text-white list-decimal">{line.trim().replace(/^\d+\. /, '')}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        // Handle bold text **text**
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cosmic-blue">$1</strong>');
        return <p key={index} className="mb-4 text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: boldText }} />;
      }
    });
  };

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-6 text-cosmic-blue hover:text-blue-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {/* Blog Post Header */}
            <GlassMorphism className="p-8 mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-space font-bold mb-4 leading-tight text-white">
                  {post.title}
                </h1>
                
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-cosmic-blue/20 flex items-center justify-center mr-4">
                    <span className="text-cosmic-blue font-bold text-xl">
                      {post.authorName.split(' ').map(name => name[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">{post.authorName}</h4>
                    <p className="text-white">{post.authorTitle || "Contributor"}</p>
                  </div>
                </div>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {Math.ceil(post.content.split(' ').length / 200)} min read
                  </div>
                </div>
              </div>
              
              {/* Featured Image */}
              {post.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </GlassMorphism>

            {/* Blog Post Content */}
            <GlassMorphism className="p-8">
              <div className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </div>
            </GlassMorphism>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <GlassMorphism className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-white">Enjoyed this article?</h3>
                <p className="text-white mb-6">
                  Share your thoughts or explore more amazing content on space science and astronomy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="cosmic-gradient hover:opacity-90">
                    Share Your Thoughts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900"
                    onClick={() => window.history.back()}
                  >
                    Read More Articles
                  </Button>
                </div>
              </GlassMorphism>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostView;