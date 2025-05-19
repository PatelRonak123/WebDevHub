import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogSchema, updateBlogSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog API Routes
  const blogRouter = express.Router();

  // Get all blogs
  blogRouter.get("/blogs", async (req: Request, res: Response) => {
    try {
      const status = req.query.status as "draft" | "published" | undefined;
      let blogs;
      
      if (status) {
        blogs = await storage.getBlogsByStatus(status);
      } else {
        blogs = await storage.getAllBlogs();
      }
      
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  // Get blog by ID
  blogRouter.get("/blogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const blog = await storage.getBlogById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  // Save or update draft
  blogRouter.post("/blogs/save-draft", async (req: Request, res: Response) => {
    try {
      const blogData = { ...req.body, status: "draft" };
      const parseResult = insertBlogSchema.safeParse(blogData);
      
      if (!parseResult.success) {
        const error = fromZodError(parseResult.error);
        return res.status(400).json({ message: error.message });
      }

      // If blog has ID, update it; otherwise create new
      if (blogData.id) {
        const id = parseInt(blogData.id.toString());
        delete blogData.id; // Remove id from update data
        
        const updatedBlog = await storage.updateBlog(id, blogData);
        if (!updatedBlog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.json(updatedBlog);
      } else {
        const newBlog = await storage.createBlog(blogData);
        return res.status(201).json(newBlog);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      res.status(500).json({ message: "Failed to save draft" });
    }
  });

  // Publish blog
  blogRouter.post("/blogs/publish", async (req: Request, res: Response) => {
    try {
      const blogData = { ...req.body, status: "published" };
      const parseResult = insertBlogSchema.safeParse(blogData);
      
      if (!parseResult.success) {
        const error = fromZodError(parseResult.error);
        return res.status(400).json({ message: error.message });
      }

      // If blog has ID, update it; otherwise create new
      if (blogData.id) {
        const id = parseInt(blogData.id.toString());
        delete blogData.id; // Remove id from update data
        
        const updatedBlog = await storage.updateBlog(id, blogData);
        if (!updatedBlog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.json(updatedBlog);
      } else {
        const newBlog = await storage.createBlog(blogData);
        return res.status(201).json(newBlog);
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      res.status(500).json({ message: "Failed to publish blog" });
    }
  });

  // Update existing blog
  blogRouter.put("/blogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const parseResult = updateBlogSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error = fromZodError(parseResult.error);
        return res.status(400).json({ message: error.message });
      }

      const updatedBlog = await storage.updateBlog(id, req.body);
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Failed to update blog" });
    }
  });

  // Delete blog
  blogRouter.delete("/blogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const success = await storage.deleteBlog(id);
      if (!success) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });

  // Register all blog routes with /api prefix
  app.use("/api", blogRouter);

  const httpServer = createServer(app);
  return httpServer;
}
