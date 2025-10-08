import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoplay?: boolean;
}

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  onProgress, 
  onComplete,
  autoplay = false 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  // Extract video ID and platform from URL
  const getVideoInfo = (url: string) => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1] };
    } else if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1] };
    }
    
    return { platform: 'direct', id: url };
  };

  const videoInfo = getVideoInfo(videoUrl);

  // YouTube Player
  const YouTubePlayer = ({ videoId }: { videoId: string }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // Track video progress
      const interval = setInterval(() => {
        if (iframeRef.current && onProgress) {
          // YouTube IFrame API would be needed for detailed tracking
          // For now, we'll simulate basic progress
        }
      }, 5000);

      return () => clearInterval(interval);
    }, [videoId]);

    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Vimeo Player
  const VimeoPlayer = ({ videoId }: { videoId: string }) => {
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`}
          title={title}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Direct Video Player (for MP4, etc.)
  const DirectVideoPlayer = ({ url }: { url: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
        onProgress?.(currentProgress);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleEnded = () => {
        onComplete?.();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
      };
    }, [url]);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={url}
          controls
          autoPlay={autoplay}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <Card className="bg-space-800/50 border-space-700 overflow-hidden">
      <div ref={playerRef} className="relative">
        {videoInfo.platform === 'youtube' && <YouTubePlayer videoId={videoInfo.id} />}
        {videoInfo.platform === 'vimeo' && <VimeoPlayer videoId={videoInfo.id} />}
        {videoInfo.platform === 'direct' && <DirectVideoPlayer url={videoInfo.id} />}
        
        {/* Video Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
      </div>
      
      {/* Progress Bar (for direct video) */}
      {videoInfo.platform === 'direct' && duration > 0 && (
        <div className="p-4 bg-space-800">
          <div className="w-full bg-space-700 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-cosmic-blue h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-space-400 mt-1">
            <span>{Math.floor((duration * progress) / 6000)}:{Math.floor(((duration * progress) / 100) % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

