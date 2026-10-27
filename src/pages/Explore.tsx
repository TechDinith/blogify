import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type { Blog } from "@/types";
import BlogCard from "@/components/BlogCard";
import { BlogCardSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import TagBadge from "@/components/TagBadge";

const PAGE_SIZE = 9;

const Explore = () => {
  const { data, loading, error } = useFetch<Blog[]>("http://localhost:8000/blogs");
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [author, setAuthor] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "popular" | "title">("newest");
  const [page, setPage] = useState(1);

  const blogs = data ?? [];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => b.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [blogs]);

  const authors = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => set.add(b.author));
    return [...set].sort();
  }, [blogs]);

  const filtered = useMemo(() => {
    let result = [...blogs];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.body.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length) {
      result = result.filter((b) => selectedTags.every((t) => b.tags?.includes(t)));
    }
    if (author !== "all") {
      result = result.filter((b) => b.author === author);
    }
    result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return (b.likes ?? 0) - (a.likes ?? 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [blogs, query, selectedTags, author, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setAuthor("all");
    setSort("newest");
    setPage(1);
  };

  const hasFilters = query || selectedTags.length || author !== "all" || sort !== "newest";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore posts</h1>
        <p className="mt-1 text-[rgb(var(--muted))]">
          Search, filter, and discover stories from the community.
        </p>
      </div>

      {/* Search + filters */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search posts..."
              className="input pl-9"
            />
          </div>
          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
            className="input md:w-48"
          >
            <option value="all">All authors</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="input md:w-40"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most liked</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={14} className="text-[rgb(var(--muted))]" />
            {allTags.map((t) => (
              <TagBadge key={t} tag={t} active={selectedTags.includes(t)} onClick={() => toggleTag(t)} />
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-[rgb(var(--muted))] hover:text-brand-600">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 text-sm text-[rgb(var(--muted))]">
        {loading ? "Loading..." : `${filtered.length} post${filtered.length !== 1 ? "s" : ""} found`}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
          : pageItems.map((b) => <BlogCard key={b.id} blog={b} onTagClick={toggleTag} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <EmptyState title="No posts match" description="Try adjusting your search or filters." action={<button onClick={clearFilters} className="btn-ghost">Clear filters</button>} />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-ghost"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-ghost"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-ghost"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
