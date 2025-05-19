import { useEffect } from "react";
import BlogList from "@/components/BlogList";
import { Helmet } from "react-helmet";

export default function AllBlogs() {
  // Add page title
  useEffect(() => {
    document.title = "All Blogs | BlogCraft";
  }, []);
  
  return (
    <div id="all-blogs-view" className="animate-fade-in">
      <Helmet>
        <title>All Blogs | BlogCraft</title>
        <meta name="description" content="View and manage all your blog posts and drafts." />
      </Helmet>
      <BlogList />
    </div>
  );
}
