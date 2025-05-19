import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { getBlogById, saveDraft, publishBlog } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Blog, InsertBlog } from "@shared/schema";
import EditorHeader from "@/components/EditorHeader";
import BlogEditor from "@/components/BlogEditor";
import { Helmet } from "react-helmet";

export default function Editor() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for the blog being edited
  const [blog, setBlog] = useState<Partial<Blog>>({
    title: "",
    content: "",
    tags: [],
    status: "draft"
  });
  
  // Fetch blog if editing an existing one
  const { data: existingBlog, isLoading } = useQuery({
    queryKey: ['/api/blogs', parseInt(id || "0")],
    queryFn: () => getBlogById(parseInt(id || "0")),
    enabled: !!id,
    onSuccess: (data) => {
      setBlog(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load blog",
        variant: "destructive",
      });
      navigate("/blogs");
    }
  });
  
  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: (blogData: InsertBlog) => saveDraft(blogData),
    onSuccess: (savedBlog) => {
      // If this is a new blog, redirect to edit URL
      if (!id && savedBlog.id) {
        navigate(`/editor/${savedBlog.id}`);
      }
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save draft",
        variant: "destructive",
      });
    }
  });
  
  // Publish blog mutation
  const publishMutation = useMutation({
    mutationFn: (blogData: InsertBlog) => publishBlog(blogData),
    onSuccess: (publishedBlog) => {
      toast({
        title: "Blog published",
        description: "Your blog has been successfully published",
        variant: "default",
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      
      // Navigate to blogs page
      navigate("/blogs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish blog",
        variant: "destructive",
      });
    }
  });
  
  // Handle blog field change
  const handleBlogChange = (field: string, value: any) => {
    setBlog(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle save draft
  const handleSaveDraft = () => {
    if (!blog.title || !blog.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    
    saveDraftMutation.mutate(blog as InsertBlog);
  };
  
  // Handle publish
  const handlePublish = () => {
    if (!blog.title || !blog.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    
    publishMutation.mutate({ ...blog, status: "published" } as InsertBlog);
  };
  
  // Setup auto-save
  const { lastSaved, isSaving, save } = useAutoSave(
    blog,
    async (blogData) => {
      // Don't auto-save empty blogs
      if (!blogData.title && !blogData.content) return null;
      
      const result = await saveDraft(blogData as InsertBlog);
      if (!id && result.id) {
        navigate(`/editor/${result.id}`, { replace: true });
      }
      return result;
    },
    {
      delay: 5000, // 5 seconds of inactivity
    }
  );
  
  // Set page title
  useEffect(() => {
    document.title = blog.title 
      ? `Editing: ${blog.title} | BlogCraft` 
      : "New Blog | BlogCraft";
  }, [blog.title]);
  
  return (
    <div id="editor-view" className="animate-fade-in">
      <Helmet>
        <title>{blog.title ? `Editing: ${blog.title}` : "New Blog"} | BlogCraft</title>
        <meta name="description" content="Create and edit your blog posts with auto-save functionality." />
      </Helmet>
      
      <EditorHeader
        lastSaved={lastSaved}
        isSaving={isSaving || saveDraftMutation.isPending || publishMutation.isPending}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        blog={blog}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <BlogEditor
          blog={blog}
          onBlogChange={handleBlogChange}
        />
      )}
    </div>
  );
}
