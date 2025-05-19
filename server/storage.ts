import { blogs, type Blog, type InsertBlog, type UpdateBlog, users, type User, type InsertUser } from "@shared/schema";
import { z } from "zod";

// Storage Interface
export interface IStorage {
  // Blog Methods
  getAllBlogs(): Promise<Blog[]>;
  getBlogById(id: number): Promise<Blog | undefined>;
  getBlogsByStatus(status: "draft" | "published"): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, blog: UpdateBlog): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
  
  // User Methods (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// In-Memory Storage Implementation
export class MemStorage implements IStorage {
  private blogs: Map<number, Blog>;
  private users: Map<number, User>;
  private blogCurrentId: number;
  private userCurrentId: number;

  constructor() {
    this.blogs = new Map();
    this.users = new Map();
    this.blogCurrentId = 1;
    this.userCurrentId = 1;
  }

  // Blog Methods
  async getAllBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values());
  }

  async getBlogById(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async getBlogsByStatus(status: "draft" | "published"): Promise<Blog[]> {
    return Array.from(this.blogs.values()).filter(
      (blog) => blog.status === status
    );
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.blogCurrentId++;
    const now = new Date();
    const blog: Blog = { 
      ...insertBlog, 
      id, 
      tags: insertBlog.tags || [], 
      status: insertBlog.status as "draft" | "published", 
      created_at: now, 
      updated_at: now 
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updateData: UpdateBlog): Promise<Blog | undefined> {
    const blog = this.blogs.get(id);
    if (!blog) return undefined;

    const now = new Date();
    const updatedBlog: Blog = { 
      ...blog, 
      ...updateData, 
      tags: updateData.tags || blog.tags || [],
      status: (updateData.status || blog.status) as "draft" | "published",
      updated_at: now 
    };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  // User Methods (existing implementation)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
