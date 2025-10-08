import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2,
  FileVideo,
  FileImage,
  FileArchive,
  File,
  Upload
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface ResourceLibraryProps {
  referenceType: 'course' | 'campaign' | 'workshop' | 'lesson';
  referenceId: number;
  title?: string;
  allowUpload?: boolean; // Whether to show upload button (for admins/instructors)
}

export default function ResourceLibrary({ 
  referenceType, 
  referenceId, 
  title = "Resources",
  allowUpload = false 
}: ResourceLibraryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [newResource, setNewResource] = React.useState({
    title: "",
    description: "",
    fileUrl: ""
  });

  // Fetch resources
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources", { referenceType, referenceId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        referenceType,
        referenceId: referenceId.toString()
      });
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  // Create resource mutation
  const createResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/resources", data);
    },
    onSuccess: () => {
      toast({ title: "Resource uploaded successfully!" });
      setIsUploadDialogOpen(false);
      setNewResource({
        title: "",
        description: "",
        fileUrl: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
    onError: () => {
      toast({ title: "Failed to upload resource", variant: "destructive" });
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      return await apiRequest("DELETE", `/api/resources/${resourceId}`);
    },
    onSuccess: () => {
      toast({ title: "Resource deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
    onError: () => {
      toast({ title: "Failed to delete resource", variant: "destructive" });
    },
  });

  // Track download mutation
  const trackDownloadMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      return await apiRequest("POST", `/api/resources/${resourceId}/download`);
    },
  });

  const handleUpload = () => {
    if (!newResource.title || !newResource.fileUrl) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    // Auto-detect file info from URL
    const fileName = newResource.fileUrl.split('/').pop()?.split('?')[0] || 'file';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileType = getFileType(fileExtension);

    createResourceMutation.mutate({
      title: newResource.title,
      description: newResource.description,
      fileUrl: newResource.fileUrl,
      fileName,
      fileType,
      fileSize: 0, // We'll set this to 0 for now since we can't easily get file size from URL
      referenceType,
      referenceId,
    });
  };

  const handleDownload = async (resource: any) => {
    // Track download
    trackDownloadMutation.mutate(resource.id);
    
    // Open file in new tab
    window.open(resource.fileUrl, '_blank');
  };

  const getFileType = (extension: string): string => {
    const types: Record<string, string> = {
      'pdf': 'pdf',
      'doc': 'doc',
      'docx': 'doc',
      'xls': 'spreadsheet',
      'xlsx': 'spreadsheet',
      'ppt': 'presentation',
      'pptx': 'presentation',
      'zip': 'archive',
      'rar': 'archive',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
    };
    return types[extension] || 'file';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-8 h-8" />;
      case 'video':
        return <FileVideo className="w-8 h-8" />;
      case 'image':
        return <FileImage className="w-8 h-8" />;
      case 'archive':
        return <FileArchive className="w-8 h-8" />;
      default:
        return <File className="w-8 h-8" />;
    }
  };

  const getFileColor = (fileType: string): string => {
    switch (fileType) {
      case 'pdf':
        return 'text-red-400';
      case 'doc':
        return 'text-blue-400';
      case 'video':
        return 'text-purple-400';
      case 'image':
        return 'text-green-400';
      case 'archive':
        return 'text-yellow-400';
      default:
        return 'text-space-400';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-space-400 text-sm">
            {resources.length} {resources.length === 1 ? 'resource' : 'resources'} available
          </p>
        </div>
        
        {allowUpload && user && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cosmic-blue hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-space-800 border-space-700 text-white">
              <DialogHeader>
                <DialogTitle>Upload New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-space-200">Title *</label>
                  <Input
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="Resource title..."
                    className="bg-space-700 border-space-600 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-space-200">Description</label>
                  <Textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Brief description of the resource..."
                    rows={3}
                    className="bg-space-700 border-space-600 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-space-200">File URL *</label>
                  <Input
                    value={newResource.fileUrl}
                    onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                    placeholder="https://example.com/file.pdf"
                    className="bg-space-700 border-space-600 text-white mt-1"
                  />
                  <p className="text-xs text-space-500 mt-1">
                    Provide a direct link to your file (hosted on cloud storage, Drive, etc.)
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                    className="border-space-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={createResourceMutation.isPending}
                    className="bg-cosmic-blue hover:bg-blue-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {createResourceMutation.isPending ? "Uploading..." : "Upload Resource"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
        </div>
      ) : resources.length === 0 ? (
        <Card className="bg-space-800/30 border-space-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-space-500 mx-auto mb-4" />
            <p className="text-space-400">No resources available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource: any) => (
            <Card
              key={resource.id}
              className="bg-space-800/50 border-space-700 hover:bg-space-700/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`mb-3 ${getFileColor(resource.fileType)}`}>
                    {getFileIcon(resource.fileType)}
                  </div>
                  <h3 className="font-semibold text-white mb-1 line-clamp-2">
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-space-400 line-clamp-2 mb-3">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-space-500 mb-3">
                    {resource.fileSize > 0 && (
                      <span>{formatFileSize(resource.fileSize)}</span>
                    )}
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {resource.downloadCount || 0}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue text-xs">
                    {resource.fileType.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 bg-cosmic-blue hover:bg-blue-600"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {allowUpload && user && (
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this resource?')) {
                          deleteResourceMutation.mutate(resource.id);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-space-500 text-center mt-3">
                  Added {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

