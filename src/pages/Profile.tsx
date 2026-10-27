import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PenSquare } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type { Blog } from "@/types";
import { useAuth } from "@/context/AuthContext";
import BlogCard from "@/components/BlogCard";
import EmptyState from "@/components/EmptyState";

const Profile = () => {
  const { user } = useAuth();
  const { data } = useFetch<Blog[]>("http://localhost:8000/blogs");

  const myPosts = useMemo(
    () => (data ?? []).filter((b) => b.authorId === user?.id || b.author === user?.name),
    [data, user]
  );
  const totalLikes = useMemo(() => myPosts.reduce((s, b) => s + (b.likes ?? 0), 0), [myPosts]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Please log in</h2>
        <Link to="/login" className="btn-primary mt-6 inline-flex">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="card mb-8 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-[rgb(var(--muted))]">{user.email}</p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{myPosts.length}</p>
            <p className="text-xs text-[rgb(var(--muted))]">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalLikes}</p>
            <p className="text-xs text-[rgb(var(--muted))]">Likes</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Your posts</h2>
        <Link to="/create" className="btn-primary">
          <PenSquare size={16} /> New post
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <EmptyState title="No posts yet" description="Share your first story." action={<Link to="/create" className="btn-primary">Create post</Link>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myPosts.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
