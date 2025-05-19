import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getAllBlogs, getBlogsByStatus, deleteBlog } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import BlogCard from "./BlogCard";
import { Blog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function BlogList() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch blogs based on active tab
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["/api/blogs", activeTab],
    queryFn: () => {
      if (activeTab === "all") {
        return getAllBlogs();
      } else {
        return getBlogsByStatus(activeTab as "draft" | "published");
      }
    }
  });
  
  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      
      toast({
        title: "Blog deleted",
        description: "The blog has been successfully deleted",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog",
        variant: "destructive",
      });
    }
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle create new blog
  const handleCreateNewBlog = () => {
    navigate("/editor");
  };
  
  // Handle delete blog
  const handleDeleteBlog = (id: number) => {
    deleteMutation.mutate(id);
  };
  
  // Filter blogs by search term
  const filteredBlogs = blogs.filter((blog: Blog) => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Blogs</h1>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  className="pl-10 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button onClick={handleCreateNewBlog}>
                <Plus className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </div>
          </div>
          
          {/* Blog Filter Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
            <TabsList className="border-b border-gray-200 w-full justify-start">
              <TabsTrigger value="all" className="data-[state=active]:border-primary data-[state=active]:text-primary">
                All
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:border-primary data-[state=active]:text-primary">
                Published
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:border-primary data-[state=active]:text-primary">
                Drafts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No blogs found. Create a new one!</p>
            <Button className="mt-4" onClick={handleCreateNewBlog}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog: Blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onDelete={handleDeleteBlog} 
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
