import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Blog } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { SaveIcon, SendIcon } from "lucide-react";

interface EditorHeaderProps {
  lastSaved: Date | null;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  blog: Partial<Blog>;
}

export default function EditorHeader({
  lastSaved,
  isSaving,
  onSaveDraft,
  onPublish,
  blog
}: EditorHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Back Button for Mobile */}
        <Link href="/blogs">
          <a className="lg:hidden text-gray-700 hover:text-primary">
            <i className="ri-arrow-left-line text-xl"></i>
          </a>
        </Link>
        
        {/* Editor Actions */}
        <div className="flex space-x-3 ml-auto">
          {lastSaved && (
            <span className="hidden sm:inline-flex items-center text-sm text-gray-500">
              Last saved: {formatDistanceToNow(lastSaved, { addSuffix: true })}
            </span>
          )}
          
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            onClick={onPublish}
            disabled={isSaving || !blog.title || !blog.content}
          >
            <SendIcon className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}
