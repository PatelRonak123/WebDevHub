import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blog Schema
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  status: text("status").notNull().$type<"draft" | "published">().default("draft"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// User Schema (keeping original user schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Blog Insert Schema
export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  created_at: true,
});

// Blog Update Schema
export const updateBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  created_at: true,
});

// User Insert Schema
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Type Exports
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type UpdateBlog = z.infer<typeof updateBlogSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
