import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Blog } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface BlogCardProps {
  blog: Blog;
  onDelete: (id: number) => void;
}

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [, navigate] = useLocation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleEditClick = () => {
    navigate(`/editor/${blog.id}`);
  };
  
  const handleDeleteConfirm = () => {
    onDelete(blog.id);
    setIsDeleteDialogOpen(false);
  };
  
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };
  
  return (
    <Card className="hover:shadow-md transition-all">
      {/* Blog Card Header with Status */}
      <CardHeader className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <Badge variant={blog.status === "published" ? "success" : "warning"}>
          {blog.status === "published" ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Published
            </>
          ) : (
            <>
              <Clock className="mr-1 h-3 w-3" />
              Draft
            </>
          )}
        </Badge>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleEditClick}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      {/* Blog Content Preview */}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {truncateContent(blog.content)}
        </p>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div className="text-xs text-gray-500">
          {blog.status === "draft" ? "Auto-saved: " : "Last updated: "}
          {formatDistanceToNow(new Date(blog.updated_at), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}
