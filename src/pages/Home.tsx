import { Link } from "react-router-dom";
import { ArrowRight, PenSquare } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type { Blog } from "@/types";
import BlogCard from "@/components/BlogCard";
import { BlogCardSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { data, loading, error } = useFetch<Blog[]>("http://localhost:8000/blogs?_sort=createdAt&_order=desc");
  const { user } = useAuth();

  const blogs = (data ?? []).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))]">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
            Share ideas that <span className="text-brand-600">matter.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--muted))]">
            Read, write, and discuss. A full-featured blogging platform with markdown, comments, and dark mode.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/explore" className="btn-primary">
              Explore posts <ArrowRight size={16} />
            </Link>
            {user ? (
              <Link to="/create" className="btn-ghost">
                <PenSquare size={16} /> Write a post
              </Link>
            ) : (
              <Link to="/register" className="btn-ghost">
                Get started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest posts</h2>
          <Link to="/explore" className="text-sm font-medium text-brand-600 hover:underline">
            View all →
          </Link>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
        </div>

        {!loading && blogs.length === 0 && (
          <EmptyState
            title="No posts yet"
            description="Be the first to share something."
            action={
              user ? (
                <Link to="/create" className="btn-primary">
                  Create post
                </Link>
              ) : (
                <Link to="/register" className="btn-primary">
                  Join now
                </Link>
              )
            }
          />
        )}
      </section>
    </div>
  );
};

export default Home;
