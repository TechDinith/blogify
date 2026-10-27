import { Link } from "react-router-dom";
import { Calendar, Heart, MessageCircle, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Blog } from "@/types";
import TagBadge from "./TagBadge";

interface BlogCardProps {
  blog: Blog;
  onTagClick?: (tag: string) => void;
}

const BlogCard = ({ blog, onTagClick }: BlogCardProps) => (
  <article className="card group flex flex-col overflow-hidden">
    <div className="flex-1 p-5">
      <div className="mb-3 flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
        <UserIcon size={14} />
        <span>{blog.author}</span>
        <span>•</span>
        <Calendar size={14} />
        <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
      </div>
      <Link to={`/blogs/${blog.id}`}>
        <h2 className="text-xl font-bold leading-tight transition-colors group-hover:text-brand-600">
          {blog.title}
        </h2>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm text-[rgb(var(--muted))]">
        {blog.body.replace(/[#*`_]/g, "").slice(0, 160)}...
      </p>
      {blog.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <TagBadge key={t} tag={t} onClick={onTagClick ? () => onTagClick(t) : undefined} />
          ))}
        </div>
      )}
    </div>
    <div className="flex items-center justify-between border-t border-[rgb(var(--border))] px-5 py-3 text-xs text-[rgb(var(--muted))]">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Heart size={14} /> {blog.likes ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} /> comments
        </span>
      </div>
      <Link to={`/blogs/${blog.id}`} className="font-medium text-brand-600 hover:underline">
        Read more →
      </Link>
    </div>
  </article>
);

export default BlogCard;
