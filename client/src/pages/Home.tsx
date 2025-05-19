import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to blogs page as homepage
    navigate("/blogs");
  }, [navigate]);
  
  return null;
}
