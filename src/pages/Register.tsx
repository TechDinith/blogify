import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await doRegister(name, email, password);
      toast.success("Account created! Welcome.");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="card p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <UserPlus size={22} />
          </div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-[rgb(var(--muted))]">Join the community</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[rgb(var(--muted))]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
