import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Blog, Comment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import MarkdownView from "@/components/MarkdownView";
import ConfirmDialog from "@/components/ConfirmDialog";
import { BlogCardSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import TagBadge from "@/components/TagBadge";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: blog, loading, error, refetch } = useFetch<Blog>(`http://localhost:8000/blogs/${id}`);
  const { data: comments, refetch: refetchComments } = useFetch<Comment[]>(
    `http://localhost:8000/comments?blogId=${id}`
  );

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  const isAuthor = !!user && (blog?.authorId === user.id || blog?.author === user.name);

  const handleLike = async () => {
    if (!blog) return;
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }
    setLiking(true);
    try {
      const likedBy = blog.likedBy ?? [];
      const already = likedBy.includes(user.id);
      const newLikedBy = already ? likedBy.filter((x) => x !== user.id) : [...likedBy, user.id];
      const newLikes = already ? Math.max(0, (blog.likes ?? 0) - 1) : (blog.likes ?? 0) + 1;
      await api.patch(`/blogs/${blog.id}`, { likes: newLikes, likedBy: newLikedBy });
      refetch();
    } catch {
      toast.error("Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    setDeleting(true);
    try {
      await api.delete(`/blogs/${blog.id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/comments", {
        blogId: id,
        author: user.name,
        authorId: user.id,
        body: commentText.trim(),
        createdAt: new Date().toISOString(),
      });
      setCommentText("");
      refetchComments();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      refetchComments();
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BlogCardSkeleton />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Post not found" description="This post may have been removed." />
        <div className="mt-4 text-center">
          <Link to="/" className="btn-ghost">
            <ArrowLeft size={16} /> Back home
          </Link>
        </div>
      </div>
    );
  }

  const liked = !!user && (blog.likedBy ?? []).includes(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))] hover:text-brand-600">
        <ArrowLeft size={16} /> Back
      </Link>

      <article className="card p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {blog.tags?.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{blog.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[rgb(var(--muted))]">
          <span className="flex items-center gap-1">
            <UserIcon size={14} /> {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-6 border-t border-[rgb(var(--border))] pt-6">
          <MarkdownView content={blog.body} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[rgb(var(--border))] pt-6">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`btn ${liked ? "btn-primary" : "btn-ghost"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {blog.likes ?? 0} {liked ? "Liked" : "Like"}
          </button>

          {isAuthor && (
            <>
              <Link to={`/edit/${blog.id}`} className="btn-ghost">
                <Edit3 size={16} /> Edit
              </Link>
              <button onClick={() => setDeleteOpen(true)} className="btn-danger">
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>
      </article>

      {/* Comments */}
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <MessageCircle size={20} /> Comments ({comments?.length ?? 0})
        </h2>

        <form onSubmit={handleComment} className="card mb-6 p-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? "Share your thoughts..." : "Log in to comment"}
            disabled={!user}
            className="textarea"
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button type="submit" disabled={submitting || !user} className="btn-primary">
              <Send size={16} /> {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 text-xs font-bold">
                      {c.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.author}</p>
                      <p className="text-xs text-[rgb(var(--muted))]">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {(user?.id === c.authorId || user?.name === c.author) && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-[rgb(var(--muted))] hover:text-red-500"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{c.body}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No comments yet" description="Be the first to share your thoughts." />
          )}
        </div>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this post?"
        description="This action cannot be undone. All comments will remain orphaned."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default BlogDetails;
