import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Blog } from "@shared/schema";
import { X } from "lucide-react";

interface BlogEditorProps {
  blog: Partial<Blog>;
  onBlogChange: (field: string, value: any) => void;
}

export default function BlogEditor({ blog, onBlogChange }: BlogEditorProps) {
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  
  // Function to handle adding a new tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      // Get current tags or empty array if none
      const currentTags = blog.tags || [];
      
      // Don't add if tag already exists
      if (currentTags.includes(tagInput.trim())) {
        toast({
          title: "Tag already exists",
          variant: "destructive",
        });
        return;
      }
      
      // Add new tag to the list
      onBlogChange("tags", [...currentTags, tagInput.trim()]);
      
      // Clear input
      setTagInput("");
    }
  };
  
  // Function to remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = blog.tags || [];
    onBlogChange("tags", currentTags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 bg-white shadow-sm rounded-lg my-6">
      {/* Title Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Enter blog title..."
          className="w-full text-3xl font-bold border-0 focus:ring-0 focus:outline-none"
          value={blog.title || ""}
          onChange={(e) => onBlogChange("title", e.target.value)}
        />
      </div>
      
      {/* Content Editor */}
      <div className="py-4 border-t border-b border-gray-200">
        <Textarea
          placeholder="Write your blog content here..."
          className="min-h-[300px] w-full border-0 focus:ring-0 focus:outline-none resize-none"
          value={blog.content || ""}
          onChange={(e) => onBlogChange("content", e.target.value)}
        />
      </div>
      
      {/* Tags Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {/* Render current tags */}
          {blog.tags && blog.tags.map((tag, index) => (
            <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
              {tag}
              <button 
                onClick={() => handleRemoveTag(tag)} 
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {/* Tag input */}
          <Input
            type="text"
            placeholder="Add a tag..."
            className="border-none outline-none bg-transparent text-sm inline-flex w-auto"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Press Enter to add a tag</p>
      </div>
    </div>
  );
}
