import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image, 
  Video, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Eye,
  Save,
  Upload,
  Calendar,
  Tag,
  FolderOpen,
  Search,
  Plus,
  X,
  ChevronDown,
  Type,
  Palette,
  Settings,
  Globe,
  Share2,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MediaUpload from './MediaUpload';

interface WordPressStyleEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    categories: string[];
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    isPublished: boolean;
    scheduledDate?: string;
    authorName: string;
    authorTitle: string;
    authorImageUrl: string;
  };
  onSave: (data: any) => void;
  onPublish: (data: any) => void;
  onPreview: (data: any) => void;
  isLoading?: boolean;
  publishButtonText?: string; // Custom text for publish button (default: "Publish")
  saveButtonText?: string; // Custom text for save button (default: "Save Draft")
  isUserEditor?: boolean; // If true, hide publish-related controls (users can only submit for review)
}

const WordPressStyleEditor: React.FC<WordPressStyleEditorProps> = ({
  initialData,
  onSave,
  onPublish,
  onPreview,
  isLoading = false,
  publishButtonText = "Publish",
  saveButtonText = "Save Draft",
  isUserEditor = false
}) => {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('content');
  
  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    isPublished: initialData?.isPublished || false,
    scheduledDate: initialData?.scheduledDate || '',
    authorName: initialData?.authorName || '',
    authorTitle: initialData?.authorTitle || '',
    authorImageUrl: initialData?.authorImageUrl || '',
  });

  // Editor state
  const [isRichTextMode, setIsRichTextMode] = useState(true);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  // Set initial content only once when editor mounts
  useEffect(() => {
    if (editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, []);

  // Check active formats when selection changes
  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  // Listen for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isRichTextMode && editorRef.current?.contains(document.activeElement)) {
        updateActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isRichTextMode]);

  // Available categories and tags
  const [availableCategories] = useState([
    'Space Science', 'Astronomy', 'Physics', 'Technology', 'Innovation', 
    'Research', 'Education', 'News', 'Tutorials', 'Interviews'
  ]);
  
  const [availableTags] = useState([
    'NASA', 'Space Exploration', 'Quantum Physics', 'AI', 'Robotics',
    'Astrophysics', 'Cosmology', 'Satellites', 'Mars', 'Moon', 'Stars',
    'Galaxies', 'Black Holes', 'Solar System', 'Space Technology'
  ]);

  // Rich text editor functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Update active formats after command execution
    setTimeout(updateActiveFormats, 0);
  };

  const insertLink = () => {
    if (linkUrl) {
      editorRef.current?.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString() || linkText || linkUrl;
        const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${selectedText}</a>`;
        document.execCommand('insertHTML', false, link);
        if (editorRef.current) {
          setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
        }
      }
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const insertImage = (imageUrl: string) => {
    // Focus the editor first to ensure we have a selection
    editorRef.current?.focus();
    
    // Use insertHTML to insert at cursor position
    const img = `<img src="${imageUrl}" alt="${formData.title || 'Image'}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    document.execCommand('insertHTML', false, img);
    
    setShowMediaLibrary(false);
    
    // Update content state
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const insertVideo = (videoUrl: string) => {
    // Focus the editor first to ensure we have a selection
    editorRef.current?.focus();
    
    // Use insertHTML to insert at cursor position
    const video = `<video controls style="max-width: 100%; height: auto; margin: 10px 0;"><source src="${videoUrl}" type="video/mp4"></video>`;
    document.execCommand('insertHTML', false, video);
    
    setShowMediaLibrary(false);
    
    // Update content state
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const addCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = () => {
    const content = isRichTextMode ? editorRef.current?.innerHTML || '' : formData.content;
    onSave({
      ...formData,
      content
    });
  };

  const handlePublish = () => {
    const content = isRichTextMode ? editorRef.current?.innerHTML || '' : formData.content;
    onPublish({
      ...formData,
      content,
      isPublished: true
    });
  };

  const handlePreview = () => {
    const content = isRichTextMode ? editorRef.current?.innerHTML || '' : formData.content;
    onPreview({
      ...formData,
      content
    });
  };

  // Toolbar component
  const Toolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 border-b border-space-600 bg-space-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('bold')}
        className={activeFormats.bold ? "bg-cosmic-blue text-white" : "text-space-300 hover:text-white"}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('italic')}
        className={activeFormats.italic ? "bg-cosmic-blue text-white" : "text-space-300 hover:text-white"}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('underline')}
        className={activeFormats.underline ? "bg-cosmic-blue text-white" : "text-space-300 hover:text-white"}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('insertUnorderedList')}
        className={activeFormats.insertUnorderedList ? "bg-cosmic-blue text-white" : "text-space-300 hover:text-white"}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('insertOrderedList')}
        className={activeFormats.insertOrderedList ? "bg-cosmic-blue text-white" : "text-space-300 hover:text-white"}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editorRef.current?.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const blockquote = `<blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; font-style: italic; color: #d1d5db;">${selectedText || 'Quote text here'}</blockquote>`;
            document.execCommand('insertHTML', false, blockquote);
            if (editorRef.current) {
              setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
            }
          }
        }}
        className="text-space-300 hover:text-white"
        title="Insert Quote Block"
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowLinkDialog(true)}
        className="text-space-300 hover:text-white"
        title="Insert Link"
      >
        <Link className="w-4 h-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMediaLibrary(true)}
        className="text-space-300 hover:text-white"
        title="Insert Image"
      >
        <Image className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editorRef.current?.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const code = `<pre style="background: #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0;"><code style="color: #e2e8f0; font-family: 'Courier New', monospace;">${selectedText || 'Code here'}</code></pre>`;
            document.execCommand('insertHTML', false, code);
            if (editorRef.current) {
              setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
            }
          }
        }}
        className="text-space-300 hover:text-white"
        title="Insert Code Block"
      >
        <Code className="w-4 h-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          execCommand('justifyLeft');
          setTimeout(() => {
            if (editorRef.current) {
              setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
            }
          }, 0);
        }}
        className="text-space-300 hover:text-white"
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          execCommand('justifyCenter');
          setTimeout(() => {
            if (editorRef.current) {
              setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
            }
          }, 0);
        }}
        className="text-space-300 hover:text-white"
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          execCommand('justifyRight');
          setTimeout(() => {
            if (editorRef.current) {
              setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
            }
          }, 0);
        }}
        className="text-space-300 hover:text-white"
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Media Library component
  const MediaLibrary = () => (
    <MediaUpload
      onUploadComplete={(url, type) => {
        if (type === 'image') {
          insertImage(url);
        } else if (type === 'video') {
          insertVideo(url);
        }
      }}
      onClose={() => setShowMediaLibrary(false)}
    />
  );

  // Link dialog component
  const LinkDialog = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-space-800 border-space-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Insert Link
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(false)}
              className="text-space-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-space-300">Link Text</Label>
            <Input
              placeholder="Link text"
              className="bg-space-700 border-space-600 text-white"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-space-300">URL</Label>
            <Input
              placeholder="https://example.com"
              className="bg-space-700 border-space-600 text-white"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={insertLink}
              disabled={!linkUrl || !linkText}
              className="bg-cosmic-blue hover:bg-blue-600"
            >
              Insert Link
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLinkDialog(false)}
              className="border-space-600 text-space-300"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-space-900 min-h-screen">
      {/* Header */}
      <div className="bg-space-800 border-b border-space-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Add New Post</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRichTextMode(!isRichTextMode)}
                className="text-space-300 hover:text-white"
              >
                <Type className="w-4 h-4 mr-2" />
                {isRichTextMode ? 'HTML' : 'Visual'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-space-600 text-space-300 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isLoading}
              className="border-space-600 text-space-300 hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveButtonText}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="bg-cosmic-blue hover:bg-blue-600"
            >
              <Globe className="w-4 h-4 mr-2" />
              {publishButtonText}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-space-800 mb-6">
              <TabsTrigger value="content" className="data-[state=active]:bg-cosmic-blue">
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-cosmic-blue">
                Media
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-cosmic-blue">
                Categories & Tags
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-cosmic-blue">
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Title */}
              <Card className="bg-space-800 border-space-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-space-300 text-sm font-medium">Title</Label>
                      <Input
                        placeholder="Enter post title..."
                        className="bg-space-700 border-space-600 text-white text-xl font-semibold"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-space-300 text-sm font-medium">Excerpt</Label>
                      <Textarea
                        placeholder="Write a brief excerpt..."
                        className="bg-space-700 border-space-600 text-white"
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="bg-space-800 border-space-700">
                <CardHeader>
                  <CardTitle className="text-white">Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isRichTextMode ? (
                    <div>
                      <Toolbar />
                      <div
                        ref={editorRef}
                        contentEditable
                        dir="ltr"
                        className="min-h-96 p-6 bg-space-700 text-white focus:outline-none [&_*]:!direction-ltr"
                        style={{ minHeight: '400px', direction: 'ltr', textAlign: 'left' }}
                        onInput={(e) => {
                          const content = e.currentTarget.innerHTML;
                          setFormData(prev => ({ ...prev, content }));
                        }}
                        onMouseUp={updateActiveFormats}
                        onKeyUp={updateActiveFormats}
                        suppressContentEditableWarning
                      />
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Write your post content..."
                      className="bg-space-700 border-space-600 text-white min-h-96"
                      rows={20}
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card className="bg-space-800 border-space-700">
                <CardHeader>
                  <CardTitle className="text-white">Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-space-300 text-sm font-medium">Image URL</Label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      className="bg-space-700 border-space-600 text-white"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    />
                  </div>
                  {formData.featuredImage && (
                    <div className="relative">
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="w-full max-w-md h-48 object-cover rounded border border-space-600"
                      />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowMediaLibrary(true)}
                    className="border-space-600 text-space-300 hover:text-white"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card className="bg-space-800 border-space-700">
                <CardHeader>
                  <CardTitle className="text-white">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new category..."
                      className="bg-space-700 border-space-600 text-white"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <Button onClick={addCategory} className="bg-cosmic-blue hover:bg-blue-600">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-space-300 text-sm font-medium">Available Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <Badge
                          key={category}
                          variant={formData.categories.includes(category) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.categories.includes(category)
                              ? 'bg-cosmic-blue text-white'
                              : 'border-space-600 text-space-300 hover:text-white'
                          }`}
                          onClick={() => {
                            if (formData.categories.includes(category)) {
                              removeCategory(category);
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                categories: [...prev.categories, category]
                              }));
                            }
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {formData.categories.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-space-300 text-sm font-medium">Selected Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.categories.map(category => (
                          <Badge
                            key={category}
                            className="bg-cosmic-blue text-white"
                          >
                            {category}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCategory(category)}
                              className="ml-2 h-4 w-4 p-0 text-white hover:bg-white/20"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-space-800 border-space-700">
                <CardHeader>
                  <CardTitle className="text-white">Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag..."
                      className="bg-space-700 border-space-600 text-white"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} className="bg-cosmic-blue hover:bg-blue-600">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-space-300 text-sm font-medium">Available Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.tags.includes(tag)
                              ? 'bg-cosmic-blue text-white'
                              : 'border-space-600 text-space-300 hover:text-white'
                          }`}
                          onClick={() => {
                            if (formData.tags.includes(tag)) {
                              removeTag(tag);
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...prev.tags, tag]
                              }));
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-space-300 text-sm font-medium">Selected Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <Badge
                            key={tag}
                            className="bg-cosmic-blue text-white"
                          >
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTag(tag)}
                              className="ml-2 h-4 w-4 p-0 text-white hover:bg-white/20"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card className="bg-space-800 border-space-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-space-300 text-sm font-medium">SEO Title</Label>
                    <Input
                      placeholder="SEO optimized title..."
                      className="bg-space-700 border-space-600 text-white"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                    <p className="text-space-400 text-xs mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-space-300 text-sm font-medium">Meta Description</Label>
                    <Textarea
                      placeholder="SEO optimized description..."
                      className="bg-space-700 border-space-600 text-white"
                      rows={3}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    />
                    <p className="text-space-400 text-xs mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-space-800 border-l border-space-700 p-6 space-y-6">
          {/* Publish Settings */}
          <Card className="bg-space-700 border-space-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {isUserEditor ? "Submission" : "Publish"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-space-300">Status</Label>
                <Badge variant={formData.isPublished ? "default" : "outline"}>
                  {formData.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              
              {isUserEditor ? (
                // User editor: Show info message instead of publish controls
                <div className="text-sm text-space-400 p-3 bg-space-800 rounded border border-space-600">
                  <p className="mb-2">📝 Your post will be saved as a draft.</p>
                  <p>Click <strong className="text-white">"Submit for Review"</strong> when ready to send it to admins for approval.</p>
                </div>
              ) : (
                // Admin editor: Show full publish controls
                <>
                  <div className="space-y-2">
                    <Label className="text-space-300 text-sm">Schedule</Label>
                    <Input
                      type="datetime-local"
                      className="bg-space-600 border-space-500 text-white"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-space-300">Publish immediately</Label>
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Author Settings */}
          <Card className="bg-space-700 border-space-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-space-300 text-sm">Author Name</Label>
                <Input
                  className="bg-space-600 border-space-500 text-white"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="text-space-300 text-sm">Author Title</Label>
                <Input
                  placeholder="Astrophysicist, Researcher..."
                  className="bg-space-600 border-space-500 text-white"
                  value={formData.authorTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorTitle: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="text-space-300 text-sm">Author Image URL</Label>
                <Input
                  placeholder="https://example.com/author.jpg"
                  className="bg-space-600 border-space-500 text-white"
                  value={formData.authorImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorImageUrl: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-space-700 border-space-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Post Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-space-300">
                <span>Words:</span>
                <span>{formData.content.split(' ').length}</span>
              </div>
              <div className="flex justify-between text-space-300">
                <span>Characters:</span>
                <span>{formData.content.length}</span>
              </div>
              <div className="flex justify-between text-space-300">
                <span>Categories:</span>
                <span>{formData.categories.length}</span>
              </div>
              <div className="flex justify-between text-space-300">
                <span>Tags:</span>
                <span>{formData.tags.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showMediaLibrary && <MediaLibrary />}
      {showLinkDialog && <LinkDialog />}
    </div>
  );
};

export default WordPressStyleEditor;
