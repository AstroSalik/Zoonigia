import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, Video, File, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  onUploadComplete: (url: string, type: 'image' | 'video' | 'file') => void;
  onClose: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // In a real implementation, you would upload to your server or cloud storage
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file);
      
      // Determine file type
      let fileType: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          onUploadComplete(url, fileType);
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded successfully`
          });
        }, 500);
      }, 2000);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-space-800 border-space-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Upload Media
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-space-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-cosmic-blue bg-cosmic-blue/10' 
                  : 'border-space-600 hover:border-space-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-space-400 mx-auto mb-4" />
              <p className="text-space-300 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-space-400 text-sm mb-4">
                Supports images, videos, and documents up to 10MB
              </p>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border-space-600 text-space-300 hover:text-white"
              >
                Select Files
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-space-300 text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* File Type Info */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border border-space-600 rounded-lg">
                <Image className="w-8 h-8 text-space-400 mx-auto mb-2" />
                <p className="text-space-300 text-sm">Images</p>
                <p className="text-space-400 text-xs">JPG, PNG, GIF</p>
              </div>
              <div className="p-4 border border-space-600 rounded-lg">
                <Video className="w-8 h-8 text-space-400 mx-auto mb-2" />
                <p className="text-space-300 text-sm">Videos</p>
                <p className="text-space-400 text-xs">MP4, MOV, AVI</p>
              </div>
              <div className="p-4 border border-space-600 rounded-lg">
                <File className="w-8 h-8 text-space-400 mx-auto mb-2" />
                <p className="text-space-300 text-sm">Documents</p>
                <p className="text-space-400 text-xs">PDF, DOC, TXT</p>
              </div>
            </div>

            {/* URL Input Option */}
            <div>
              <Label className="text-space-300 text-sm font-medium mb-2 block">
                Or Enter Media URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  className="bg-space-700 border-space-600 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const url = e.currentTarget.value;
                      const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 
                                   url.match(/\.(mp4|mov|avi|webm)$/i) ? 'video' : 'file';
                      onUploadComplete(url, type);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  className="border-space-600 text-space-300 hover:text-white"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input && input.value) {
                      const url = input.value;
                      const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 
                                   url.match(/\.(mp4|mov|avi|webm)$/i) ? 'video' : 'file';
                      onUploadComplete(url, type);
                    }
                  }}
                >
                  Insert
                </Button>
              </div>
              <p className="text-space-400 text-xs mt-1">
                Paste a URL to an image or video and press Enter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaUpload;
