import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  Check,
  MessageCircle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export default function SocialShare({ 
  url, 
  title, 
  description = "",
  hashtags = []
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const fullUrl = `${window.location.origin}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.join(',');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtagString ? `&hashtags=${hashtagString}` : ''}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 bg-space-800/50 border-space-600 hover:bg-space-700 text-space-200"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-space-800 border-space-600"
      >
        <DropdownMenuItem
          onClick={() => handleShare('facebook')}
          className="text-space-200 hover:text-space-50 hover:bg-space-700 cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleShare('twitter')}
          className="text-space-200 hover:text-space-50 hover:bg-space-700 cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleShare('linkedin')}
          className="text-space-200 hover:text-space-50 hover:bg-space-700 cursor-pointer"
        >
          <Linkedin className="mr-2 h-4 w-4" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleShare('whatsapp')}
          className="text-space-200 hover:text-space-50 hover:bg-space-700 cursor-pointer"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="text-space-200 hover:text-space-50 hover:bg-space-700 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

