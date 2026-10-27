import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import MarkdownEditor from "@/components/MarkdownEditor";
import TagInput from "@/components/TagInput";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().min(10, "Body must be at least 10 characters"),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ["Technology", "Design", "Life", "Tutorial", "Opinion", "Other"];

const CreateBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", body: "", category: "Technology" },
  });

  const body = watch("body");

  useEffect(() => {
    if (!user) {
      // allow viewing but prompt
    }
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/blogs", {
        title: values.title,
        body: values.body,
        author: user.name,
        authorId: user.id,
        tags,
        category: values.category,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
      });
      toast.success("Post published!");
      navigate(`/blogs/${data.id}`);
    } catch {
      toast.error("Failed to publish post");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Sign in required</h2>
        <p className="mt-2 text-[rgb(var(--muted))]">You need an account to write a post.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="btn-primary">
            Log in
          </Link>
          <Link to="/register" className="btn-ghost">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))] hover:text-brand-600">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Create new post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input {...register("title")} className="input" placeholder="An awesome title" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select {...register("category")} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
          <MarkdownEditor
            value={body}
            onChange={(v) => setValue("body", v, { shouldValidate: true })}
            placeholder="Write your post in Markdown..."
            rows={16}
          />
          {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/" className="btn-ghost">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Publishing..." : "Publish post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
