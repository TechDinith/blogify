import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="mx-auto max-w-6xl px-4 py-20">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
