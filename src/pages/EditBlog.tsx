import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Blog } from "@/types";
import { useAuth } from "@/context/AuthContext";
import MarkdownEditor from "@/components/MarkdownEditor";
import TagInput from "@/components/TagInput";
import { BlogCardSkeleton } from "@/components/Skeleton";

const schema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(10),
  category: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;
const CATEGORIES = ["Technology", "Design", "Life", "Tutorial", "Opinion", "Other"];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: blog, loading } = useFetch<Blog>(`http://localhost:8000/blogs/${id}`);
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const body = watch("body");

  useEffect(() => {
    if (blog && !initialized) {
      reset({ title: blog.title, body: blog.body, category: blog.category ?? "Technology" });
      setTags(blog.tags ?? []);
      setInitialized(true);
    }
  }, [blog, initialized, reset]);

  const isAuthor = !!user && !!blog && (blog.authorId === user.id || blog.author === user.name);

  const onSubmit = async (values: FormValues) => {
    if (!blog) return;
    setSubmitting(true);
    try {
      await api.patch(`/blogs/${blog.id}`, {
        title: values.title,
        body: values.body,
        category: values.category,
        tags,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Post updated");
      navigate(`/blogs/${blog.id}`);
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><BlogCardSkeleton /></div>;
  }
  if (!blog) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-center">Post not found</div>;
  }
  if (!isAuthor) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Not authorized</h2>
        <p className="mt-2 text-[rgb(var(--muted))]">You can only edit your own posts.</p>
        <Link to={`/blogs/${blog.id}`} className="btn-primary mt-6 inline-flex">
          Back to post
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/blogs/${blog.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))] hover:text-brand-600">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Edit post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input {...register("title")} className="input" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select {...register("category")} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Body</label>
          <MarkdownEditor value={body ?? ""} onChange={(v) => setValue("body", v, { shouldValidate: true })} rows={16} />
          {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <Link to={`/blogs/${blog.id}`} className="btn-ghost">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
