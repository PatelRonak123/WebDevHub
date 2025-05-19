import { apiRequest } from "./queryClient";
import { Blog, InsertBlog, UpdateBlog } from "@shared/schema";

// Blog API functions
export async function getAllBlogs(): Promise<Blog[]> {
  const response = await fetch("/api/blogs");
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return response.json();
}

export async function getBlogsByStatus(status: "draft" | "published"): Promise<Blog[]> {
  const response = await fetch(`/api/blogs?status=${status}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${status} blogs`);
  }
  return response.json();
}

export async function getBlogById(id: number): Promise<Blog> {
  const response = await fetch(`/api/blogs/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }
  return response.json();
}

export async function saveDraft(blog: InsertBlog | UpdateBlog): Promise<Blog> {
  const response = await apiRequest("POST", "/api/blogs/save-draft", blog);
  return response.json();
}

export async function publishBlog(blog: InsertBlog | UpdateBlog): Promise<Blog> {
  const response = await apiRequest("POST", "/api/blogs/publish", blog);
  return response.json();
}

export async function updateBlog(id: number, blog: UpdateBlog): Promise<Blog> {
  const response = await apiRequest("PUT", `/api/blogs/${id}`, blog);
  return response.json();
}

export async function deleteBlog(id: number): Promise<{ success: boolean }> {
  const response = await apiRequest("DELETE", `/api/blogs/${id}`);
  return response.json();
}
